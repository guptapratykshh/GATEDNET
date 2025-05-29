const admin = require('firebase-admin');
const Admin = require('../models/Admin');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

// Rate limiter for token verification
const tokenVerificationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: 'Too many token verification attempts, please try again later' }
});

// In-memory token blacklist (consider using Redis in production)
const tokenBlacklist = new Set();

const firebaseAuth = async (req, res, next) => {
    // Add request ID for tracking
    req.requestId = uuidv4();
    console.log(`[${req.requestId}] Incoming request to: ${req.method} ${req.originalUrl}`);

    try {
        const authHeader = req.headers.authorization;
        console.log(`[${req.requestId}] Authorization Header: ${authHeader}`);
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log(`[${req.requestId}] No or invalid token provided`);
            return res.status(401).json({ 
                error: 'No token provided',
                requestId: req.requestId
            });
        }

        const token = authHeader.split('Bearer ')[1];
        console.log(`[${req.requestId}] Extracted Token: ${token ? token.substring(0, 10) + '...' : 'null'}`); // Log partial token
        
        // Check if token is blacklisted
        if (tokenBlacklist.has(token)) {
            console.log(`[${req.requestId}] Token is blacklisted`);
            return res.status(401).json({ 
                error: 'Token has been invalidated',
                requestId: req.requestId
            });
        }

        // Apply rate limiting
        await new Promise((resolve, reject) => {
            tokenVerificationLimiter(req, res, (err) => {
                if (err) reject(err);
                resolve();
            });
        });
        console.log(`[${req.requestId}] Rate limiting passed`);
        
        // Verify the Firebase token
        let decodedToken;
        try {
            decodedToken = await admin.auth().verifyIdToken(token);
            console.log(`[${req.requestId}] Firebase token verified. Decoded email: ${decodedToken.email}, UID: ${decodedToken.uid}`);
        } catch (verifyError) {
            console.error(`[${req.requestId}] Firebase token verification failed:`, verifyError.code || verifyError.message);
             if (verifyError.code === 'auth/id-token-expired') {
                return res.status(401).json({ 
                    error: 'Token has expired',
                    requestId: req.requestId
                });
            }
            if (verifyError.code === 'auth/invalid-id-token') {
                 return res.status(401).json({ 
                    error: 'Invalid token',
                    requestId: req.requestId
                });
            }
            // Generic authentication failed for other verification errors
            return res.status(401).json({ 
                error: 'Authentication failed during token verification',
                requestId: req.requestId
            });
        }

        // Check token expiration (redundant with verifyIdToken but good practice)
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
             console.log(`[${req.requestId}] Token expired based on exp claim`);
            return res.status(401).json({ 
                error: 'Token has expired',
                requestId: req.requestId
            });
        }
        console.log(`[${req.requestId}] Token expiration check passed`);
        
        // Get admin details from database using email from token
        console.log(`[${req.requestId}] Searching for admin with email: ${decodedToken.email}`);
        const adminUser = await Admin.findOne({ email: decodedToken.email });
        console.log(`[${req.requestId}] Admin user found: ${adminUser ? adminUser._id : 'None'}, isActive: ${adminUser ? adminUser.isActive : 'N/A'}`);

        if (!adminUser) {
            console.log(`[${req.requestId}] Admin not found in DB for email: ${decodedToken.email}. Returning 403.`);
            return res.status(403).json({ 
                error: 'Admin not found',
                requestId: req.requestId
            });
        }

        if (!adminUser.isActive) {
             console.log(`[${req.requestId}] Admin found but inactive: ${adminUser._id}. Returning 403.`);
            return res.status(403).json({ 
                error: 'Admin account is inactive',
                requestId: req.requestId
            });
        }
        

        // Attach admin details and token info to request
        req.admin = adminUser;
        req.token = token;
        req.tokenExpiry = decodedToken.exp;
        console.log(`[${req.requestId}] Authentication successful for admin: ${adminUser._id}. Proceeding.`);

        next();
    } catch (error) {
        // Catch any other unexpected errors during middleware execution
        console.error(`[${req.requestId}] Unexpected Firebase auth middleware error:`, error);
        res.status(500).json({ 
            error: 'Internal authentication error',
            requestId: req.requestId,
             details: error.message // Provide some error detail in dev/test
        });
    }
};

// Function to blacklist a token
const blacklistToken = (token) => {
    tokenBlacklist.add(token);
    // Remove from blacklist after token expiry (1 hour)
    setTimeout(() => {
        tokenBlacklist.delete(token);
    }, 60 * 60 * 1000);
};

module.exports = {
    firebaseAuth,
    blacklistToken
}; 
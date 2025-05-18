const admin = require('firebase-admin');
const Admin = require('../models/Admin');

const firebaseAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split('Bearer ')[1];
        
        // Verify the Firebase token
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Get admin details from database
        const adminUser = await Admin.findOne({ email: decodedToken.email });
        
        if (!adminUser) {
            return res.status(403).json({ error: 'Admin not found' });
        }

        if (!adminUser.isActive) {
            return res.status(403).json({ error: 'Admin account is inactive' });
        }

        // Attach admin details to request
        req.admin = adminUser;
        next();
    } catch (error) {
        console.error('Firebase auth error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = firebaseAuth; 
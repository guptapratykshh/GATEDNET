const Admin = require('../models/Admin');
const admin = require('firebase-admin');

// Admin sign in
const adminSignIn = async (req, res) => {
    try {
        const { email, password, name, societyId, role } = req.body;

        // Validate required fields
        if (!email || !password || !name || !societyId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin with this email already exists' });
        }

        // Create user in Firebase
        const userRecord = await admin.auth().createUser({
            email,
            password,
            emailVerified: false
        });

        // Create custom token for the new user
        const customToken = await admin.auth().createCustomToken(userRecord.uid);

        // Create admin in database
        const adminUser = new Admin({
            email,
            name,
            societyId,
            role: role || 'society_admin',
            firebaseUid: userRecord.uid, // Store Firebase UID for future reference
            isActive: true,              // Add default value if required
            createdAt: new Date()        // Add if required by schema
        });

        await adminUser.save();

        res.status(201).json({
            message: 'Admin created successfully',
            admin: {
                id: adminUser._id,
                email: adminUser.email,
                name: adminUser.name,
                role: adminUser.role
            },
            token: customToken // Send the custom token to the client
        });
    } catch (error) {
        console.error('Admin sign in error:', error);
        if (error.errors) {
            console.error('Validation errors:', error.errors); // <-- Add this line
            Object.keys(error.errors).forEach(key => {
                console.error(`Validation error for ${key}:`, error.errors[key].message);
            });
        }

        // Handle Firebase email already exists error
        if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Handle Firebase weak password error
        if (error.code === 'auth/weak-password') {
            return res.status(400).json({ error: 'Password should be at least 6 characters' });
        }

        // Handle missing or invalid fields
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }

        // Log and return the actual error message for debugging (remove in production)
        res.status(500).json({ error: 'Error creating admin account', details: error.message });
    }
};

// Admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find admin in database
        const adminUser = await Admin.findOne({ email });

        if (!adminUser) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        if (!adminUser.isActive) {
            return res.status(403).json({ error: 'Admin account is inactive' });
        }

        // Verify Firebase credentials
        try {
            // Create custom token for the user
            const customToken = await admin.auth().createCustomToken(adminUser.firebaseUid);

            // Update last login
            adminUser.lastLogin = new Date();
            await adminUser.save();

            res.status(200).json({
                message: 'Login successful',
                admin: {
                    id: adminUser._id,
                    email: adminUser.email,
                    name: adminUser.name,
                    role: adminUser.role
                },
                token: customToken // Send the custom token to the client
            });
        } catch (firebaseError) {
            console.error('Firebase authentication error:', firebaseError);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Error during login' });
    }
};

// Get admin profile
const getAdminProfile = async (req, res) => {
    try {
        const admin = req.admin;
        res.status(200).json({
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
                societyId: admin.societyId,
                lastLogin: admin.lastLogin
            }
        });
    } catch (error) {
        console.error('Get admin profile error:', error);
        res.status(500).json({ error: 'Error fetching admin profile' });
    }
};

module.exports = {
    adminSignIn,
    adminLogin,
    getAdminProfile
};
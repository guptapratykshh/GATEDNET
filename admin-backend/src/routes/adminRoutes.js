const express = require('express');
const router = express.Router();
const { adminSignIn, adminLogin, getAdminProfile } = require('../controllers/adminController');
const firebaseAuth = require('../middleware/firebaseAuth');

const blacklistedTokens = [];

function checkToken(req, res, next) {
  const token = req.token;
  if (blacklistedTokens.includes(token)) {
    return res.status(401).json({ message: 'Token is invalid' });
  }
  next();
}

// Public routes
router.post('/signup', adminSignIn);
router.post('/login', adminLogin);

// Protected routes
router.get('/profile', firebaseAuth, getAdminProfile);

router.post('/logout', (req, res) => {
    const token = req.token;
    blacklistedTokens.push(token); 
    res.clearCookie("refreshToken");
  res.json({ message: 'Logout successful' });
});

module.exports = router; 
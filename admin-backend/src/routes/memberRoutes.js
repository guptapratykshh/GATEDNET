const express = require('express');
const router = express.Router();
const { 
  addMember, 
  getAllMembers, 
  getMemberById, 
  updateMember, 
  deleteMember 
} = require('../controllers/memberController');
const firebaseAuth = require('../middleware/firebaseAuth');

// Apply Firebase authentication middleware to all routes
router.use(firebaseAuth);

// Member routes
router.post('/add', addMember);
router.get('/', getAllMembers);
router.get('/:id', getMemberById);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

module.exports = router;
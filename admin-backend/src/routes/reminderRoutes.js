const express = require('express');
const router = express.Router();
const { 
  addReminder,
  getAllReminders,
  getReminderById,
  updateReminder,
  toggleReminderStatus,
  deleteReminder
} = require('../controllers/ReminderController');
const firebaseAuth = require('../middleware/firebaseAuth');

// Apply Firebase authentication middleware to all routes
router.use(firebaseAuth);

// Reminder routes
router.post('/add', addReminder);
router.get('/', getAllReminders);
router.get('/:id', getReminderById);
router.put('/:id', updateReminder);
router.patch('/:id/toggle', toggleReminderStatus);
router.delete('/:id', deleteReminder);

module.exports = router; 
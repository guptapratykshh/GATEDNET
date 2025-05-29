const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  priority: String,
  isCompleted: Boolean,
  createdAt: Date,
});

module.exports = mongoose.model('Reminder', reminderSchema, 'reminders'); 
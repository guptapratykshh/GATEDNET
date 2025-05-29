const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: String,
  message: String,
  isActive: Boolean,
  createdAt: Date
});

module.exports = mongoose.model('Announcement', announcementSchema, 'announcements'); 
const mongoose = require('mongoose');

const adminActivitySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN',
      'LOGOUT',
      'CREATE_ADMIN',
      'UPDATE_ADMIN',
      'DEACTIVATE_ADMIN',
      'CREATE_POLL',
      'CLOSE_POLL',
      'DELETE_POLL',
      'CREATE_ANNOUNCEMENT',
      'UPDATE_ANNOUNCEMENT',
      'DELETE_ANNOUNCEMENT',
      'ADD_MEMBER',
      'UPDATE_MEMBER',
      'DELETE_MEMBER',
      'ADD_REMINDER',
      'UPDATE_REMINDER',
      'DELETE_REMINDER'
    ]
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  details: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String
});

// Index for faster queries
adminActivitySchema.index({ adminId: 1, timestamp: -1 });
adminActivitySchema.index({ action: 1, timestamp: -1 });

module.exports = mongoose.model('AdminActivity', adminActivitySchema); 
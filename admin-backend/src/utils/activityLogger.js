const AdminActivity = require('../models/AdminActivity');

// Log admin activity
exports.logAdminActivity = async ({ action, adminId, details }) => {
  try {
    const activity = new AdminActivity({
      action,
      adminId,
      details,
      timestamp: new Date()
    });
    await activity.save();
    return activity;
  } catch (error) {
    console.error('Error logging admin activity:', error);
    // Don't throw error to prevent disrupting the main flow
    return null;
  }
};

// Get admin activities
exports.getAdminActivities = async (adminId, limit = 50) => {
  try {
    const activities = await AdminActivity.find({ adminId })
      .sort({ timestamp: -1 })
      .limit(limit);
    return activities;
  } catch (error) {
    console.error('Error fetching admin activities:', error);
    return [];
  }
}; 
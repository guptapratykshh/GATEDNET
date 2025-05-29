const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  priority: String,
  assignedTo: mongoose.Schema.Types.ObjectId,
  createdBy: mongoose.Schema.Types.ObjectId,
  createdAt: Date,
  updatedAt: Date
});

module.exports = mongoose.model('Maintenance', maintenanceSchema, 'tasks'); 
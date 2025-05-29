const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  email: { type: String, required: true },
  flat: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Member', memberSchema);
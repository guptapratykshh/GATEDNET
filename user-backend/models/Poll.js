const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  title: String,
  options: [
    {
      text: String,
      votes: { type: Number, default: 0 }
    }
  ],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Poll', pollSchema); 
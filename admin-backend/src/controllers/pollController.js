const Poll = require('../models/Poll');

exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const poll = new Poll({ question, options });
    await poll.save();
    res.status(201).json({ message: 'Poll created', poll });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create poll' });
  }
};
const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Announcement = require('../models/Announcement');
const Maintenance = require('../models/Maintenance');
const Reminder = require('../models/Reminder');
const Poll = require('../models/Poll');

// Polls endpoint - fetch active polls
router.get('/polls', async (req, res) => {
  console.log('GET /polls called');
  try {
    const polls = await Poll.find({ isActive: true });
    console.log('Fetched polls:', polls);
    res.json(polls);
  } catch (err) {
    console.error('Error fetching polls:', err);
    res.status(500).json({ message: 'Error fetching polls' });
  }
});

// Placeholder GET endpoints for frontend integration
router.get('/amenities', (req, res) => res.json([]));

// Announcements endpoint - fetch from announcements collection
router.get('/announcements', async (req, res) => {
  console.log('GET /announcements called');
  try {
    const announcements = await Announcement.find({ isActive: true });
    console.log('Fetched announcements:', announcements);
    res.json(announcements);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ message: 'Error fetching announcements' });
  }
});

// Maintenances endpoint - fetch from tasks collection
router.get('/maintenances', async (req, res) => {
  console.log('GET /maintenances called');
  try {
    const maintenances = await Maintenance.find({});
    console.log('Fetched maintenances:', maintenances);
    res.json(maintenances);
  } catch (err) {
    console.error('Error fetching maintenances:', err);
    res.status(500).json({ message: 'Error fetching maintenances' });
  }
});

// Reminders endpoint - fetch from reminders collection
router.get('/reminders', async (req, res) => {
  console.log('GET /reminders called');
  try {
    const reminders = await Reminder.find({});
    console.log('Fetched reminders:', reminders);
    res.json(reminders);
  } catch (err) {
    console.error('Error fetching reminders:', err);
    res.status(500).json({ message: 'Error fetching reminders' });
  }
});

// Vote on a poll
router.post('/vote', async (req, res) => {
  const { pollId, optionIndex, memberId } = req.body;
  console.log(`POST /vote called for poll ${pollId}, option ${optionIndex}, member ${memberId}`);
  try {
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    // Check if optionIndex is valid
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: 'Invalid option index' });
    }

    // Check if member has already voted in this poll
    // NOTE: This check is based on the assumption that votes is an array of member references.
    // Since the database schema has 'votes' as a number, this check cannot function correctly.
    // To enable accurate duplicate vote prevention without changing the database schema,
    // a separate mechanism (e.g., a new collection to track user votes) would be required.
    // For now, we are commenting out this check to allow vote counting.
    /*
    const alreadyVoted = poll.options.some(option => 
      option.votes.some(vote => vote.member && vote.member.toString() === memberId)
    );

    if (alreadyVoted) {
      return res.status(400).json({ message: 'You have already voted in this poll' });
    }
    */

    // Increment the vote count for the selected option
    poll.options[optionIndex].votes += 1;
    console.log(`Incremented vote count for option ${optionIndex}: ${poll.options[optionIndex].votes}`);

    await poll.save();
    console.log('Vote recorded successfully');
    res.json({ message: 'Vote recorded', poll }); // Return updated poll

  } catch (err) {
    console.error('Error recording vote:', err);
    res.status(500).json({ message: 'Error recording vote' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, flat } = req.body;
  const member = await Member.findOne({ email, flat });
  if (!member) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ message: 'Login successful', member });
});

// TODO: Add routes for polls, voting, announcements, reminders, maintenances, amenities, and booking

module.exports = router; 
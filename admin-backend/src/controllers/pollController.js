const Poll = require('../models/Poll');

// Create a new poll
exports.createPoll = async (req, res) => {
  try {
    const { question, options, endDate } = req.body;

    // Validate required fields
    if (!question || !options || !endDate) {
      return res.status(400).json({ 
        error: 'Missing required fields: question, options, and endDate are required' 
      });
    }

    // Validate endDate is in the future
    const endDateObj = new Date(endDate);
    if (endDateObj <= new Date()) {
      return res.status(400).json({ 
        error: 'End date must be in the future' 
      });
    }

    // Validate options array
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ 
        error: 'At least two options are required' 
      });
    }

    const poll = new Poll({ 
      question,
      options: options.map(text => ({ text })),
      endDate: endDateObj,
      createdBy: req.admin._id // Assuming req.admin is populated by middleware
    });

    await poll.save();
    res.status(201).json({ message: 'Poll created', poll });
  } catch (error) {
    console.error('Create poll error:', error);
    res.status(500).json({ error: 'Failed to create poll' });
  }
};

// Get all polls
exports.getAllPolls = async (req, res) => {
  try {
    const { status } = req.query; // Get status from query parameters
    let filter = {};

    if (status === 'active') {
      filter = { isActive: true, endDate: { $gt: new Date() } }; // Filter for active polls that haven't ended
    } else if (status === 'closed') {
      filter = { $or: [{ isActive: false }, { endDate: { $lte: new Date() } }] }; // Filter for inactive polls or polls that have ended
    }
    
    console.log('Filtering polls with filter:', filter);

    // Use .lean() to get plain JavaScript objects, potentially faster and avoids hydration issues
    const polls = await Poll.find(filter)
      .select('question options endDate isActive createdAt') // Explicitly select necessary fields, including options and votes
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email') // Populate createdBy field
      .lean(); // Add .lean() here

    console.log('Fetched polls in admin backend:', polls);
    res.json(polls);
  } catch (error) {
    console.error('Get all polls error:', error);
    res.status(500).json({ error: 'Failed to fetch polls' });
  }
};

// Get a single poll by ID
exports.getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }
    
    res.json(poll);
  } catch (error) {
    console.error('Get poll by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch poll' });
  }
};

// Update a poll
exports.updatePoll = async (req, res) => {
  try {
    const { question, options, endDate, isActive } = req.body;
    const poll = await Poll.findById(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }
    
    // Only allow updating isActive for now, other fields would require more complex handling
    if (typeof isActive !== 'undefined') {
        poll.isActive = isActive;
    }

    // Optional: Allow updating question, options, endDate if needed with proper validation
    // if (question) poll.question = question;
    // if (options) { /* validation and update */ }
    // if (endDate) { /* validation and update */ }

    poll.updatedAt = new Date(); // Update timestamp
    await poll.save();
    res.json({ message: 'Poll updated', poll });
  } catch (error) {
    console.error('Update poll error:', error);
    res.status(500).json({ error: 'Failed to update poll' });
  }
};

// Delete a poll
exports.deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Allow any admin to delete for simplicity, you might add role checks here
    // if (req.admin.role !== 'super_admin') {
    //   return res.status(403).json({ error: 'Not authorized to delete polls' });
    // }
  
    await poll.deleteOne();
    res.json({ message: 'Poll deleted' });
  } catch (error) {
    console.error('Delete poll error:', error);
    res.status(500).json({ error: 'Failed to delete poll' });
  }
};

// Vote on a poll
exports.voteOnPoll = async (req, res) => {
  try {
    const { optionIndex, memberId } = req.body; // Corrected to use optionIndex and memberId
    const poll = await Poll.findById(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Check if poll is still active
    if (!poll.isActive || new Date() > poll.endDate) {
      return res.status(400).json({ error: 'This poll is no longer active' });
    }
    
    // Check if user has already voted
    // Assuming memberId is the user identifier for voting
    const alreadyVoted = poll.options.some(option => 
      option.votes.some(vote => vote.member && vote.member.toString() === memberId)
    );

    if (alreadyVoted) {
      return res.status(400).json({ error: 'You have already voted on this poll' });
    }

    // Validate optionIndex
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
       return res.status(400).json({ message: 'Invalid option index' });
    }

    // Add vote
    poll.options[optionIndex].votes.push({ member: memberId }); // Corrected to push memberId
    
    await poll.save();
    res.json({ message: 'Vote recorded', poll });
  } catch (error) {
    console.error('Vote on poll error:', error);
    res.status(500).json({ error: 'Failed to record vote' });
  }
};
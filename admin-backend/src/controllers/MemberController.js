const Member = require('../models/Member');

// Add a new member
exports.addMember = async (req, res) => {
  try {
    const { name, flat, contact } = req.body;
    const member = new Member({ name, flat, contact });
    await member.save();
    res.status(201).json({ message: 'Member added', member });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ error: 'Failed to add member' });
  }
};

// Get all members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.status(200).json({ members });
  } catch (error) {
    console.error('Error getting members:', error);
    res.status(500).json({ error: 'Failed to get members' });
  }
};

// Get member by ID
exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.status(200).json({ member });
  } catch (error) {
    console.error('Error getting member:', error);
    res.status(500).json({ error: 'Failed to get member' });
  }
};

// Update member
exports.updateMember = async (req, res) => {
  try {
    const { name, flat, contact } = req.body;
    const member = await Member.findByIdAndUpdate(
      req.params.id, 
      { name, flat, contact },
      { new: true }
    );
    
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.status(200).json({ message: 'Member updated', member });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
};

// Delete member
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.status(200).json({ message: 'Member deleted' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: 'Failed to delete member' });
  }
};
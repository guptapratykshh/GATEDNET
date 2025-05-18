const Reminder = require('../models/Reminder');

// Add a new reminder
exports.addReminder = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    
    // Validate required fields
    if (!title || !dueDate) {
      return res.status(400).json({ error: 'Title and due date are required' });
    }
    
    const reminder = new Reminder({
      title,
      description,
      dueDate,
      priority: priority || 'Medium'
    });
    
    await reminder.save();
    res.status(201).json({ message: 'Reminder added successfully', reminder });
  } catch (error) {
    console.error('Error adding reminder:', error);
    res.status(500).json({ error: 'Failed to add reminder' });
  }
};

// Get all reminders
exports.getAllReminders = async (req, res) => {
  try {
    // Allow filtering by status (completed/incomplete)
    const { isCompleted } = req.query;
    
    const filter = {};
    if (isCompleted !== undefined) {
      filter.isCompleted = isCompleted === 'true';
    }
    
    const reminders = await Reminder.find(filter).sort({ dueDate: 1, priority: 1 });
    res.status(200).json({ reminders });
  } catch (error) {
    console.error('Error getting reminders:', error);
    res.status(500).json({ error: 'Failed to get reminders' });
  }
};

// Get reminder by ID
exports.getReminderById = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    res.status(200).json({ reminder });
  } catch (error) {
    console.error('Error getting reminder:', error);
    res.status(500).json({ error: 'Failed to get reminder' });
  }
};

// Update reminder
exports.updateReminder = async (req, res) => {
  try {
    const { title, description, dueDate, priority, isCompleted } = req.body;
    
    // Prepare update object with only provided fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    if (priority !== undefined) updateData.priority = priority;
    if (isCompleted !== undefined) updateData.isCompleted = isCompleted;
    
    const reminder = await Reminder.findByIdAndUpdate(
      req.params.id, 
      updateData,
      { new: true }
    );
    
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    res.status(200).json({ message: 'Reminder updated successfully', reminder });
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ error: 'Failed to update reminder' });
  }
};

// Mark reminder as completed/incomplete
exports.toggleReminderStatus = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    reminder.isCompleted = !reminder.isCompleted;
    await reminder.save();
    
    res.status(200).json({ 
      message: `Reminder marked as ${reminder.isCompleted ? 'completed' : 'incomplete'}`, 
      reminder 
    });
  } catch (error) {
    console.error('Error toggling reminder status:', error);
    res.status(500).json({ error: 'Failed to update reminder status' });
  }
};

// Delete reminder
exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);
    
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    res.status(200).json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ error: 'Failed to delete reminder' });
  }
}; 
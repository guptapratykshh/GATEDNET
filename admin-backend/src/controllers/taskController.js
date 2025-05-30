const Task = require('../models/Task');

// Create a new task
exports.createTask = async (req, res) => {
    try {
        console.log('Received task data:', req.body);
        console.log('Admin user:', req.admin);

        if (!req.admin || !req.admin._id) {
            console.error('No admin user found in request');
            return res.status(401).json({ message: 'Authentication required' });
        }

        const taskData = {
            ...req.body,
            createdBy: req.admin._id,
            assignedTo: req.body.assignedTo || req.admin._id // Default to creator if not assigned
        };

        console.log('Creating task with data:', taskData);

        const task = new Task(taskData);
        const validationError = task.validateSync();
        
        if (validationError) {
            console.error('Task validation error:', validationError);
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: Object.values(validationError.errors).map(err => err.message)
            });
        }

        await task.save();
        console.log('Task created successfully:', task);
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(400).json({ 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        Object.assign(task, req.body);
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        await task.deleteOne();
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get tasks by status
exports.getTasksByStatus = async (req, res) => {
    try {
        const tasks = await Task.find({ status: req.params.status })
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get tasks assigned to a specific user
exports.getTasksByAssignee = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.params.userId })
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 
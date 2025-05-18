const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('firebase-admin');
const config = require('./config/config');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(config.firebaseConfig)
});

// Middleware
app.use(cors(config.corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/admin', adminRoutes);

// Member, announcement, and reminder routes
const memberRoutes = require('./routes/memberRoutes');
const announcementRoute = require('./routes/anoncementRoute');
const reminderRoutes = require('./routes/reminderRoutes');

app.use('/api/members', memberRoutes);
app.use('/api/announcements', announcementRoute);
app.use('/api/reminders', reminderRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to GatedNet API' });
});

const pollRoutes = require('./routes/pollRoutes');
app.use('/api/polls', pollRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
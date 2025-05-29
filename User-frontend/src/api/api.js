import axios from 'axios';

// This file contains all API calls and mock implementations for the application

// In a real application, this would be set via environment variables
const API_URL = 'http://localhost:5001/api/member';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const login = async (email, flat) => {
  const res = await api.post('/login', { email, flat });
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// Polls API
export const getActivePolls = async () => {
  const res = await api.get('/polls');
  return res.data;
};

export const getPollById = async (id) => {
  const polls = await getActivePolls();
  return polls.find(poll => poll.id === id) || null;
};

export const castVote = async (pollId, optionIndex, memberId) => {
  const res = await api.post('/vote', { pollId, optionIndex, memberId });
  return res.data;
};

// Maintenance API
export const getMaintenanceUpdates = async () => {
  const res = await api.get('/maintenances');
  return res.data;
};

// Notifications/Reminders API
export const getNotifications = async () => {
  const res = await api.get('/reminders');
  return res.data;
};

// Amenities API
export const getAmenities = async () => {
  const res = await api.get('/amenities');
  return res.data;
};

export const getAmenityBookings = async () => {
  // Mocked response for demo
  return [
    {
      id: '1',
      amenityId: '1',
      userId: '1',
      date: '2025-04-22',
      startTime: '10:00',
      endTime: '12:00',
      status: 'confirmed',
    },
  ];
};

export const checkAmenityAvailability = async (amenityId, date) => {
  // In a real app, this would check with the backend
  // For demo, return true for most dates except a few
  const unavailableDates = ['2025-05-01', '2025-05-15', '2025-05-20'];
  return !unavailableDates.includes(date);
};

export const bookAmenity = async (amenity, date, memberId) => {
  const res = await api.post('/book-amenity', { amenity, date, memberId });
  return res.data;
};

// Announcements API
export const getAnnouncements = async () => {
  const res = await api.get('/announcements');
  return res.data;
};

export default api;
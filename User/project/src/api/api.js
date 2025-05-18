import axios from 'axios';

// In a real application, this would be set via environment variables
const API_URL = 'https://api.example.com';

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
export const login = async (email, password) => {
  // For demo purposes only
  // In a real app, this would call the actual backend API
  if (email === 'demo@example.com' && password === 'password') {
    const mockUser = {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      apartmentNumber: 'A-101',
      role: 'resident',
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'mock-token');
    
    return { user: mockUser, token: 'mock-token' };
  }
  
  throw new Error('Invalid credentials');
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// Polls API
export const getActivePolls = async () => {
  // Mocked response for demo
  return [
    {
      id: '1',
      title: 'Security Enhancement',
      description: 'Vote on the timing for security patrols',
      options: [
        { id: '1-1', text: '10 PM', votes: 230 },
        { id: '1-2', text: '12 AM', votes: 280 },
      ],
      startDate: '2025-04-01',
      endDate: '2025-04-30',
      status: 'active',
    },
    {
      id: '2',
      title: 'Parking Allocation',
      description: 'Vote on new parking allocation system',
      options: [
        { id: '2-1', text: 'By apartment size', votes: 150 },
        { id: '2-2', text: 'First come, first served', votes: 90 },
        { id: '2-3', text: 'By vehicle type', votes: 210 },
      ],
      startDate: '2025-04-15',
      endDate: '2025-05-15',
      status: 'active',
    },
  ];
};

export const getPollById = async (id) => {
  const polls = await getActivePolls();
  return polls.find(poll => poll.id === id) || null;
};

export const castVote = async (pollId, optionId) => {
  // In a real app, this would make an API call to the backend
  console.log(`Vote cast for poll ${pollId}, option ${optionId}`);
};

// Maintenance API
export const getMaintenanceUpdates = async () => {
  // Mocked response for demo
  return [
    {
      id: '1',
      title: 'Elevator Not Working',
      description: 'The main elevator is out of service due to technical issues.',
      status: 'open',
      createdAt: '2025-04-20T10:00:00Z',
      updatedAt: '2025-04-20T10:00:00Z',
    },
    {
      id: '2',
      title: 'Power Outage',
      description: 'Scheduled power outage for maintenance on 25th April from 10AM to 2PM.',
      status: 'resolved',
      createdAt: '2025-04-18T09:00:00Z',
      updatedAt: '2025-04-19T14:00:00Z',
    },
  ];
};

// Notifications API
export const getNotifications = async () => {
  // Mocked response for demo
  return [
    {
      id: '1',
      title: 'AGM meeting to be held on 1 May, 2025',
      description: 'The Annual General Meeting will be held on 1st May, 2025 at 6PM in the Clubhouse.',
      createdAt: '2025-04-15T09:00:00Z',
      read: false,
    },
    {
      id: '2',
      title: 'New poll created for Security Enhancement',
      description: 'A new poll has been created to vote on security enhancement measures.',
      createdAt: '2025-04-10T12:00:00Z',
      read: false,
    },
    {
      id: '3',
      title: 'Parking allocation form will not accept responses after 22 April, 2025 6:00 PM IST.',
      description: 'Please submit your parking preferences before the deadline.',
      createdAt: '2025-04-05T15:30:00Z',
      read: false,
    },
  ];
};

// Amenities API
export const getAmenities = async () => {
  // Mocked response for demo
  return [
    { id: '1', name: 'clubhouse', displayName: 'Clubhouse' },
    { id: '2', name: 'swimming pool', displayName: 'Swimming Pool' },
    { id: '3', name: 'amphitheatre', displayName: 'Amphitheatre' },
    { id: '4', name: 'garden', displayName: 'Garden' },
    { id: '5', name: 'kids pool', displayName: 'Kids Pool' },
  ];
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

export const bookAmenity = async (amenityId, date, startTime, endTime) => {
  // Mocked response for demo
  return {
    id: Date.now().toString(),
    amenityId,
    userId: '1',
    date,
    startTime,
    endTime,
    status: 'confirmed',
  };
};

// Announcements API
export const getAnnouncements = async () => {
  // Mocked response for demo
  return [];
};

export default api;
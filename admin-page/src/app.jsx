import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';

// Admin Authentication
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';

// 👥 Member Management Pages
import AddMember from './pages/AddMember';
import UpdateMembers from './pages/UpdateMembers';
import DownloadExcel from './pages/DownloadExcel';

// 📢 Announcement Feature
import Announcements from './components/Announcements';
import AddAnnouncement from './pages/AddAnnouncement';
import ViewAnnouncements from './pages/ViewAnnouncements';

// 🗳️ Voting / Polls Feature
import CreatePoll from './pages/CreatePoll';
import PollResults from './pages/PollResults';

// 🏠 Book Amenities Feature
import BookedAmenities from './components/BookedAmenities';
import ViewBookedAmenities from './pages/ViewBookedAmenities';

// 🛠️ Maintenance Feature
import MaintenanceUpdates from './pages/MaintenanceUpdates'; // main page with buttons
import AddTask from './pages/AddTask';
import UpdateTask from './pages/UpdateTask';
import ViewTasks from './pages/ViewTasks';

// Seed demo data for Bookings and Tasks if not present
const seedDemoData = () => {
  if (!localStorage.getItem('bookedAmenities')) {
    const demoBookings = [
      {
        amenityName: 'Tennis Court',
        userName: 'Alice Johnson',
        bookingTime: '2025-05-15 10:00 AM',
        status: 'Confirmed',
      },
      {
        amenityName: 'Swimming Pool',
        userName: 'Bob Smith',
        bookingTime: '2025-05-16 3:00 PM',
        status: 'Pending',
      },
      {
        amenityName: 'Conference Room',
        userName: 'Carol Lee',
        bookingTime: '2025-05-17 1:00 PM',
        status: 'Cancelled',
      },
    ];
    localStorage.setItem('bookedAmenities', JSON.stringify(demoBookings));
  }

  if (!localStorage.getItem('tasks')) {
    const demoTasks = [
      {
        id: 1,
        title: 'Fix broken elevator',
        description: 'Elevator in Tower A is not working',
        status: 'open',
      },
      {
        id: 2,
        title: 'Clean water tanks',
        description: 'Annual water tank cleaning due',
        status: 'in-progress',
      },
      {
        id: 3,
        title: 'Repair gym equipment',
        description: 'Treadmill needs belt replacement',
        status: 'resolved',
      },
    ];
    localStorage.setItem('tasks', JSON.stringify(demoTasks));
  }
};

// Authentication guard component
const RequireAuth = ({ children }) => {
  const isAuthenticated = localStorage.getItem('admin_id_token');
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

const { Content, Sider } = Layout;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    seedDemoData();
    const token = localStorage.getItem('admin_id_token');
    setIsAuthenticated(!!token);
  }, []); // Empty dependency array means this runs once on mount

  // To update isAuthenticated when localStorage changes (e.g., logout)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('admin_id_token');
      setIsAuthenticated(!!token);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Listen for storage changes across tabs/windows

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        {/* Conditionally render Header and Sider based on isAuthenticated state */}
        {isAuthenticated && <Header setIsAuthenticated={setIsAuthenticated} />}
        <Layout>
          {isAuthenticated && (
            <Sider width={200} theme="dark">
              <Navigation />
            </Sider>
          )}
          <Layout style={{ padding: '24px' }}>
            <Content>
              <Routes>
                {/* Auth Routes */}
                <Route path="/" element={<Navigate to="/admin/login" />} />
                <Route path="/admin/login" element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/admin/signup" element={<AdminSignup />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                } />

                {/* 👥 Member Management */}
                <Route path="/add-member" element={
                  <RequireAuth>
                    <AddMember />
                  </RequireAuth>
                } />
                <Route path="/update-members" element={
                  <RequireAuth>
                    <UpdateMembers />
                  </RequireAuth>
                } />
                <Route path="/download-excel" element={
                  <RequireAuth>
                    <DownloadExcel />
                  </RequireAuth>
                } />

                {/* 📢 Announcements */}
                <Route path="/announcements" element={
                  <RequireAuth>
                    <ViewAnnouncements />
                  </RequireAuth>
                } />
                <Route path="/add-announcement" element={
                  <RequireAuth>
                    <AddAnnouncement />
                  </RequireAuth>
                } />

                {/* 🗳️ Polls */}
                <Route path="/create-poll" element={
                  <RequireAuth>
                    <CreatePoll />
                  </RequireAuth>
                } />
                <Route path="/poll-results" element={
                  <RequireAuth>
                    <PollResults />
                  </RequireAuth>
                } />

                {/* 🏠 Amenities */}
                <Route path="/booked-amenities" element={
                  <RequireAuth>
                    <BookedAmenities />
                  </RequireAuth>
                } />
                <Route path="/view-booked-amenities" element={
                  <RequireAuth>
                    <ViewBookedAmenities />
                  </RequireAuth>
                } />

                {/* 🛠️ Maintenance Updates */}
                <Route path="/maintenance-updates" element={
                  <RequireAuth>
                    <MaintenanceUpdates />
                  </RequireAuth>
                } />
                <Route path="/maintenance-updates/add-task" element={
                  <RequireAuth>
                    <AddTask />
                  </RequireAuth>
                } />
                <Route path="/maintenance-updates/update-task" element={
                  <RequireAuth>
                    <UpdateTask />
                  </RequireAuth>
                } />
                <Route path="/maintenance-updates/view-tasks" element={
                  <RequireAuth>
                    <ViewTasks />
                  </RequireAuth>
                } />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;

import React from 'react';
import SettingsModal from './components/settings/SettingsModal';
import PollsModal from './components/polls/PollsModal';
import AnnouncementsModal from './components/announcements/AnnouncementsModal';
import UpdatesModal from './components/updates/UpdatesModal';
import NotificationsModal from './components/notifications/NotificationsModal';
import BookingsModal from './components/bookings/BookingsModal';
import useModals from './hooks/useModals';
import './App.css';

const App = () => {
  const { modals, openModal, closeModal } = useModals();

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <img src="/shield-icon.png" alt="Shield" className="shield-icon" />
          GREENLANDS SOCIETY
        </div>
        <div className="user-menu">
          <div className="dropdown">
            <button className="dropdown-button">
              <img src="/profile-icon.png" alt="Profile" className="profile-icon" />
            </button>
            <div className="dropdown-content">
              <button onClick={() => openModal('settings')}>Account Settings</button>
              <button>Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="app-content">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <button className="nav-item">Dashboard</button>
            <button 
              className="nav-item"
              onClick={() => openModal('polls')}
            >
              Voting & Polling
            </button>
            <button className="nav-item">
              Maintenance Requests
            </button>
            <button 
              className="nav-item"
              onClick={() => openModal('bookings')}
            >
              Amenity Booking
            </button>
            <button className="nav-item">
              Society By Laws
            </button>
            <button 
              className="nav-item"
              onClick={() => openModal('settings')}
            >
              Settings
            </button>
          </nav>
        </aside>

        <main className="main-content">
          <div className="dashboard-grid">
            <div className="dashboard-card active-votes">
              <h2>ACTIVE VOTES</h2>
              <div className="votes-content">
                <div className="vote-item">
                  <div className="vote-progress" />
                  <span>Security Enhancement</span>
                </div>
                <div className="vote-item">
                  <div className="vote-progress" />
                  <span>Parking Allocation</span>
                </div>
              </div>
              <button 
                className="card-action"
                onClick={() => openModal('polls')}
              >
                SEE ALL LIVE POLLS
              </button>
            </div>
            
            <div className="dashboard-card maintenance">
              <h2>MAINTENANCE UPDATES</h2>
              <div className="maintenance-items">
                <div className="maintenance-item">
                  <span>Elevator Not Working</span>
                  <span className="status open">OPEN</span>
                </div>
                <div className="maintenance-item">
                  <span>Power Outage</span>
                  <span className="status resolved">RESOLVED</span>
                </div>
              </div>
              <button 
                className="card-action"
                onClick={() => openModal('updates')}
              >
                SEE ALL UPDATES
              </button>
            </div>
            
            <div className="dashboard-card notifications">
              <h2>RECENT NOTIFICATIONS</h2>
              <div className="notifications-list">
                <div className="notification-item">
                  <span className="notification-dot" />
                  <p>Reminder: AGM meeting to be held on 1 May, 2025</p>
                </div>
                <div className="notification-item">
                  <span className="notification-dot" />
                  <p>Reminder: New poll created for Security Enhancement</p>
                </div>
                <div className="notification-item">
                  <span className="notification-dot" />
                  <p>Reminder: Parking allocation form will not accept responses after 22 April, 2025 6:00 PM IST.</p>
                </div>
              </div>
              <button 
                className="card-action"
                onClick={() => openModal('notifications')}
              >
                SEE ALL NOTIFICATIONS
              </button>
            </div>
            
            <div className="dashboard-card bookings">
              <h2>BOOKED AMENITIES</h2>
              <div className="booking-info">
                <span>April 22</span>
                <span>Clubhouse</span>
              </div>
              <button 
                className="card-action"
                onClick={() => openModal('bookings')}
              >
                SEE ALL BOOKINGS
              </button>
            </div>
            
            <div className="dashboard-card announcements">
              <h2>ANNOUNCEMENTS</h2>
              <div className="announcements-content">
                <span className="bell-icon">🔔</span>
                <p>No New Announcements</p>
              </div>
              <button 
                className="card-action"
                onClick={() => openModal('announcements')}
              >
                SEE ALL ANNOUNCEMENTS
              </button>
            </div>
          </div>
        </main>
      </div>

      <SettingsModal 
        isOpen={modals.settings} 
        onClose={() => closeModal('settings')} 
      />
      
      <PollsModal 
        isOpen={modals.polls} 
        onClose={() => closeModal('polls')} 
      />
      
      <AnnouncementsModal 
        isOpen={modals.announcements} 
        onClose={() => closeModal('announcements')} 
      />
      
      <UpdatesModal 
        isOpen={modals.updates} 
        onClose={() => closeModal('updates')} 
      />
      
      <NotificationsModal 
        isOpen={modals.notifications} 
        onClose={() => closeModal('notifications')} 
      />
      
      <BookingsModal 
        isOpen={modals.bookings} 
        onClose={() => closeModal('bookings')} 
      />
    </div>
  );
};

export default App;
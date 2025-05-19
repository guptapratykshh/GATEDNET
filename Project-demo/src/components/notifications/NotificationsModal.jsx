import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import './NotificationsModal.css';

// Mock data - replace with actual data fetching
const mockNotifications = [
  {
    id: 1,
    title: 'New Poll Available',
    description: 'A new poll on "Community Garden Proposal" is now available for voting.',
    date: '2023-11-10',
    read: false
  },
  {
    id: 2,
    title: 'Payment Reminder',
    description: 'Your maintenance payment for November is due in 5 days.',
    date: '2023-11-08',
    read: true
  },
  {
    id: 3,
    title: 'Amenity Booking Confirmed',
    description: 'Your booking of the Community Hall for November 20th has been confirmed.',
    date: '2023-11-05',
    read: true
  }
];

const NotificationsModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching notifications
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        setTimeout(() => {
          setNotifications(mockNotifications);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: true } 
        : notification
    ));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Notifications" 
      width="500px"
    >
      {loading ? (
        <div className="loading-spinner">Loading notifications...</div>
      ) : (
        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="no-notifications">You have no notifications</div>
          ) : (
            <>
              <div className="notifications-header">
                <span>{notifications.filter(n => !n.read).length} unread notifications</span>
                {notifications.some(n => !n.read) && (
                  <button 
                    className="mark-all-read"
                    onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-content">
                    <h3 className="notification-title">{notification.title}</h3>
                    <p className="notification-description">{notification.description}</p>
                    <span className="notification-date">{notification.date}</span>
                  </div>
                  {!notification.read && <div className="unread-indicator"></div>}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </Modal>
  );
};

export default NotificationsModal;
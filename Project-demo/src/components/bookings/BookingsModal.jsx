import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import './BookingsModal.css';

// Mock data - replace with actual data fetching
const mockBookings = [
  {
    id: 1,
    amenity: 'Community Hall',
    date: '2023-11-20',
    time: '6:00 PM - 9:00 PM',
    status: 'confirmed',
    bookedBy: 'John Doe'
  },
  {
    id: 2,
    amenity: 'Tennis Court',
    date: '2023-11-15',
    time: '4:00 PM - 6:00 PM',
    status: 'pending',
    bookedBy: 'John Doe'
  },
  {
    id: 3,
    amenity: 'Swimming Pool',
    date: '2023-11-22',
    time: '10:00 AM - 12:00 PM',
    status: 'confirmed',
    bookedBy: 'John Doe'
  }
];

const BookingsModal = ({ isOpen, onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'confirmed', 'pending'

  useEffect(() => {
    // Simulate fetching bookings
    const fetchBookings = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        setTimeout(() => {
          setBookings(mockBookings);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchBookings();
    }
  }, [isOpen]);

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  const cancelBooking = (id) => {
    // In a real app, would make API call to cancel booking
    setBookings(bookings.map(booking => 
      booking.id === id 
        ? { ...booking, status: 'cancelled' } 
        : booking
    ));
    console.log(`Cancelled booking ${id}`);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Amenity Bookings" 
      width="650px"
    >
      {loading ? (
        <div className="loading-spinner">Loading bookings...</div>
      ) : (
        <>
          <div className="bookings-filter">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
              onClick={() => setFilter('confirmed')}
            >
              Confirmed
            </button>
            <button 
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
          </div>
          
          <div className="bookings-list">
            {filteredBookings.length === 0 ? (
              <div className="no-bookings">No bookings found</div>
            ) : (
              filteredBookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h3>{booking.amenity}</h3>
                    <span className={`booking-status ${booking.status}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="booking-details">
                    <div className="booking-info">
                      <div className="booking-date">
                        <span className="info-label">Date:</span>
                        <span>{booking.date}</span>
                      </div>
                      <div className="booking-time">
                        <span className="info-label">Time:</span>
                        <span>{booking.time}</span>
                      </div>
                    </div>
                    
                    {booking.status !== 'cancelled' && (
                      <button 
                        className="cancel-booking-btn"
                        onClick={() => cancelBooking(booking.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="new-booking-section">
            <button className="new-booking-btn">Book an Amenity</button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default BookingsModal;
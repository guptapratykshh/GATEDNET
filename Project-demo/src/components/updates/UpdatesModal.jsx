import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import './UpdatesModal.css';

// Mock data - replace with actual data fetching
const mockUpdates = [
  {
    id: 1,
    title: 'New Playground Equipment',
    description: 'The society has approved installation of new playground equipment next month.',
    date: '2023-11-05',
    category: 'Amenities'
  },
  {
    id: 2,
    title: 'Water Supply Interruption',
    description: 'Scheduled water supply interruption on November 15th from 10AM to 2PM for maintenance.',
    date: '2023-11-10',
    category: 'Maintenance'
  },
  {
    id: 3,
    title: 'Annual General Meeting',
    description: 'The AGM is scheduled for December 5th at 6PM in the community hall.',
    date: '2023-11-08',
    category: 'Meetings'
  }
];

const UpdatesModal = ({ isOpen, onClose }) => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching updates
    const fetchUpdates = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        setTimeout(() => {
          setUpdates(mockUpdates);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching updates:', error);
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUpdates();
    }
  }, [isOpen]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Recent Updates" 
      width="600px"
    >
      {loading ? (
        <div className="loading-spinner">Loading updates...</div>
      ) : (
        <div className="updates-list">
          {updates.length === 0 ? (
            <div className="no-updates">No updates available</div>
          ) : (
            updates.map(update => (
              <div key={update.id} className="update-card">
                <div className="update-header">
                  <span className={`update-category ${update.category.toLowerCase()}`}>
                    {update.category}
                  </span>
                  <span className="update-date">{update.date}</span>
                </div>
                <h3 className="update-title">{update.title}</h3>
                <p className="update-description">{update.description}</p>
              </div>
            ))
          )}
        </div>
      )}
    </Modal>
  );
};

export default UpdatesModal;
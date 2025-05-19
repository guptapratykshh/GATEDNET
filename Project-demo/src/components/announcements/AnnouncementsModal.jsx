import React from 'react';
import Modal from '../common/Modal';
import './AnnouncementsModal.css';

const AnnouncementsModal = ({ isOpen, onClose }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Announcements" 
      width="500px"
    >
      <div className="no-announcements">
        <div className="empty-icon">📢</div>
        <h3>No New Announcements</h3>
        <p>There are no announcements at this time. Check back later!</p>
      </div>
    </Modal>
  );
};

export default AnnouncementsModal;
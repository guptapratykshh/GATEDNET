import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ComponentCard.css';
import announcementImage from '../assets/AnnouncementImage.png';

const Announcements = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/announcements'); // Navigate to view announcements
  };

  return (
    <div className="card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <h3>ANNOUNCEMENTS</h3>
      <img src={announcementImage} alt="Announcements" className="announcement-image" />
      <p>🔔 View & manage announcements</p>
    </div>
  );
};

export default Announcements;

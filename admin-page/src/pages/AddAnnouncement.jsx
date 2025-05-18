// AnnouncementCard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './AddAnnouncement.css';

const AddAnnouncement = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Please enter both title and announcement message!');
      return;
    }

    setIsLoading(true);
    
    try {
      await axios.post('http://localhost:7000/api/announcements/add', {
        title: formData.title,
        message: formData.message,
      });
      setSuccessMessage('✅ Announcement added!');
      setFormData({ title: '', message: '' });
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/announcements');
      }, 3000);
    } catch (error) {
      console.error('Error adding announcement:', error);
      toast.error('Failed to add announcement. Please try again.');
      setSuccessMessage('❌ Failed to add announcement');
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="announcement-wrapper">
      <h2>Add New Announcement</h2>
      {successMessage && <div className="success-toast">{successMessage}</div>}
      <form onSubmit={handleAddAnnouncement}>
        <input
          className="announcement-input"
          type="text"
          name="title"
          placeholder="Announcement Title"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
        <textarea
          className="announcement-textarea"
          name="message"
          rows="3"
          placeholder="Type your announcement message..."
          value={formData.message}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
        <button 
          className="announce-btn" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Adding Announcement...' : 'Add Announcement'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddAnnouncement;

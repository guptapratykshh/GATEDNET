import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllAnnouncements, deleteAnnouncement } from '../api/announcements';
import './ViewAnnouncements.css';

const ViewAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await getAllAnnouncements();
      if (response.error) {
        setError(response.error);
      } else {
        setAnnouncements(response.announcements || []);
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        const response = await deleteAnnouncement(id);
        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success('Announcement deleted successfully');
          fetchAnnouncements(); // Refresh the list
        }
      } catch (err) {
        console.error('Error deleting announcement:', err);
        toast.error('Failed to delete announcement');
      }
    }
  };

  const handleAddNew = () => {
    navigate('/add-announcement');
  };

  if (loading) {
    return <div className="loading">Loading announcements...</div>;
  }

  return (
    <div className="view-announcements-container">
      <div className="announcements-header">
        <h2>📢 Announcements</h2>
        <button className="add-new-btn" onClick={handleAddNew}>
          + Add New
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {announcements.length === 0 ? (
        <div className="no-announcements">
          No announcements available. Create your first announcement!
        </div>
      ) : (
        <div className="announcements-list">
          {announcements.map((announcement) => (
            <div className="announcement-card" key={announcement._id}>
              <div className="announcement-header">
                <h3>{announcement.title}</h3>
                <div className="announcement-actions">
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(announcement._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="announcement-message">{announcement.message}</p>
              <div className="announcement-date">
                {new Date(announcement.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ViewAnnouncements; 
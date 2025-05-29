import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { refreshToken } from '../utils/auth';
import '../styles/Maintenance.css';

// Use port 7000 for backend
const BASE_URL = 'http://localhost:7000';

const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      let token = localStorage.getItem('admin_id_token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          // Token might be expired, try to refresh it
          try {
            token = await refreshToken();
            // Retry the request with the new token
            const response = await axios.get(`${BASE_URL}/api/tasks`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            setTasks(response.data);
            setLoading(false);
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            setError('Session expired. Please login again.');
            setLoading(false);
          }
        } else {
          console.error('Error fetching tasks:', err);
          setError('Failed to fetch tasks.');
          setLoading(false);
        }
      }
    } catch (err) {
      console.error('Error in fetchTasks:', err);
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <p className="maintenance-container">Loading tasks...</p>;
  if (error) return <p className="maintenance-container">Error: {error}</p>;
  if (tasks.length === 0) return <p className="maintenance-container">No tasks available.</p>;

  return (
    <div className="maintenance-container">
      <h2 className="maintenance-heading">All Tasks</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li key={task._id} className="task-list-item">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p className="task-status">Status: {task.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewTasks;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { refreshToken } from '../utils/auth';
import '../styles/Maintenance.css';

// Use port 7000 for backend
const BASE_URL = 'http://localhost:7000';

const UpdateTask = () => {
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
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            setError('Session expired. Please login again.');
          }
        } else {
          console.error('Error fetching tasks:', err);
          setError('Failed to fetch tasks.');
        }
      }
    } catch (err) {
      console.error('Error in fetchTasks:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      let token = localStorage.getItem('admin_id_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      try {
        await axios.put(`${BASE_URL}/api/tasks/${id}`, { status: newStatus }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTasks(tasks.map(t => (t._id === id ? { ...t, status: newStatus } : t)));
      } catch (err) {
        if (err.response?.status === 401) {
          // Token might be expired, try to refresh it
          try {
            token = await refreshToken();
            // Retry the request with the new token
            await axios.put(`${BASE_URL}/api/tasks/${id}`, { status: newStatus }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            setTasks(tasks.map(t => (t._id === id ? { ...t, status: newStatus } : t)));
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            setError('Session expired. Please login again.');
          }
        } else {
          console.error('Error updating task status:', err);
          setError('Failed to update task status.');
        }
      }
    } catch (err) {
      console.error('Error in handleStatusChange:', err);
      setError('An unexpected error occurred.');
    }
  };

  if (loading) return <p className="maintenance-container">Loading tasks...</p>;
  if (error) return <p className="maintenance-container">Error: {error}</p>;
  if (tasks.length === 0) return <p className="maintenance-container">No tasks found to update.</p>;

  return (
    <div className="maintenance-container">
      <h2 className="maintenance-heading">Update Tasks</h2>
      <table className="maintenance-table">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Status</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.status}</td>
              <td>
                <select value={task.status} onChange={e => handleStatusChange(task._id, e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpdateTask;

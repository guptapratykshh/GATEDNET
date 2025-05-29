import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Maintenance.css';
import '../styles/AddTask.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Use port 7000 for backend
const BASE_URL = 'http://localhost:7000';

const AddTask = () => {
  const navigate = useNavigate();
  const [task, setTask] = useState({ 
    title: '', 
    description: '', 
    status: 'pending',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_id_token');
    if (!token) {
      toast.error('Please login to continue');
      navigate('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/admin/login');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('admin_id_token');
      console.log('Sending task data:', task);
      
      const response = await axios.post(`${BASE_URL}/api/tasks`, task, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        toast.success('✅ Task added successfully!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });

        // Reset form after adding task
        setTask({ 
          title: '', 
          description: '', 
          status: 'pending',
          priority: 'medium'
        });
        
        // Navigate to view tasks page
        navigate('/maintenance-updates/view-tasks');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('admin_id_token');
        navigate('/admin/login');
      } else if (error.response?.status === 404) {
        toast.error('Server not found. Please check if the backend is running.');
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        error.response.data.errors.forEach(err => {
          toast.error(err);
        });
      } else {
        toast.error(error.response?.data?.message || 'Failed to add task. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Don't render the form if not authenticated
  }

  return (
    <div className="add-task-container">
      <h2 className="maintenance-heading">Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Task Title</label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Enter task title"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Enter task description"
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            className="form-control"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="form-group">
          <label>Priority</label>
          <select
            name="priority"
            value={task.priority}
            onChange={handleChange}
            className="form-control"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button 
          type="submit" 
          className="btn btn-primary mt-3"
          disabled={loading}
        >
          {loading ? 'Adding Task...' : 'Add Task'}
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/maintenance-updates/view-tasks')}
          disabled={loading}
        >
          Go to View Tasks
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddTask;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addReminder } from '../api/reminders';
import './AddReminder.css';

const AddReminder = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium'
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await addReminder(formData);
      
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(' Reminder added successfully!', {
          position: 'top-right',
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });

        // For backward compatibility with localStorage
        const existingReminders = JSON.parse(localStorage.getItem('reminders')) || [];
        localStorage.setItem('reminders', JSON.stringify([...existingReminders, formData]));

        // Redirect after toast shows
        setTimeout(() => {
          navigate('/reminders');
        }, 2600);
      }
    } catch (err) {
      console.error('Error adding reminder:', err);
      toast.error('Failed to add reminder. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-reminder-container">
      <h2>Add New Reminder</h2>
      <form className="add-reminder-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
        />
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
        <select 
          name="priority" 
          value={formData.priority} 
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="High">🔴 High</option>
          <option value="Medium">🟡 Medium</option>
          <option value="Low">🟢 Low</option>
        </select>
        <button 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Adding Reminder...' : 'Add Reminder'}
        </button>
      </form>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default AddReminder;

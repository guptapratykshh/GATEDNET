import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { createPoll } from '../api/polls';
import 'react-toastify/dist/ReactToastify.css';
import './CreatePoll.css'; // Import custom styles

const CreatePoll = () => {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    if (options.length >= 6) {
      toast.warning('Maximum 6 options allowed');
      return;
    }
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length <= 2) {
      toast.warning('Minimum 2 options required');
      return;
    }
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (title.trim() === '' || !endDate) {
      toast.error('Title and end date are required');
      return;
    }

    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      toast.error('At least 2 valid options are required');
      return;
    }

    setLoading(true);

    // Format poll data for API
    const pollData = {
      question: title,
      options: validOptions,
      endDate: new Date(endDate).toISOString()
    };

    try {
      const response = await createPoll(pollData);
      
      if (response.error) {
        toast.error(response.error);
      } else {
        // Also save to localStorage for backward compatibility
        const simplePoll = {
          question: title,
          options: validOptions,
          votes: Array(validOptions.length).fill(0),
        };
        const existingPolls = JSON.parse(localStorage.getItem('polls')) || [];
        existingPolls.push(simplePoll);
        localStorage.setItem('polls', JSON.stringify(existingPolls));
        
        toast.success('Poll created successfully!');
        setTitle('');
        setOptions(['', '']);
        setEndDate('');
      }
    } catch (error) {
      toast.error('Error creating poll: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate min date for datepicker (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  return (
    <div className="create-poll-container">
      <h2>Create a New Poll</h2>
      <form onSubmit={handleSubmit} className="poll-form">
        <input
          type="text"
          placeholder="Poll Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="poll-input question"
          required
        />

        <label className="date-label">Poll End Date</label>
        <input
          type="date"
          value={endDate}
          min={minDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="poll-input date"
          required
        />

        <div className="options-container">
          <h4>Poll Options</h4>
          {options.map((option, index) => (
            <div key={index} className="option-row">
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="poll-input option"
                required
              />
              {options.length > 2 && (
                <button 
                  type="button" 
                  onClick={() => removeOption(index)}
                  className="remove-option-btn"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="button" onClick={addOption} className="add-option-btn">
          + Add Option
        </button>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Poll'}
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default CreatePoll;

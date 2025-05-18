import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { getAllPolls, closePoll, deletePoll } from '../api/polls';
import 'react-toastify/dist/ReactToastify.css';
import './PollResults.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PollResults = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const response = await getAllPolls(statusFilter);
      if (response.error) {
        setError(response.error);
        // Fallback to localStorage if API fails
        const storedPolls = JSON.parse(localStorage.getItem('polls')) || [];
        setPolls(storedPolls);
      } else {
        setPolls(response.polls || []);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch polls: ' + err.message);
      // Fallback to localStorage
      const storedPolls = JSON.parse(localStorage.getItem('polls')) || [];
      setPolls(storedPolls);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [statusFilter]);

  const handleClosePoll = async (id) => {
    try {
      const response = await closePoll(id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Poll closed successfully');
        fetchPolls();
      }
    } catch (err) {
      toast.error('Error closing poll: ' + err.message);
    }
  };

  const handleDeletePoll = async (id) => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
      try {
        const response = await deletePoll(id);
        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success('Poll deleted successfully');
          fetchPolls();
        }
      } catch (err) {
        toast.error('Error deleting poll: ' + err.message);
      }
    }
  };

  // Old fallback function for localStorage compatibility
  const togglePublish = (index) => {
    const updatedPolls = [...polls];
    const poll = updatedPolls[index];
    poll.published = !poll.published;
    localStorage.setItem('polls', JSON.stringify(updatedPolls));
    setPolls(updatedPolls);

    toast.success(
      `Poll "${poll.title || poll.question}" ${poll.published ? 'published' : 'unpublished'} successfully!`
    );
  };

  if (loading) {
    return <div className="loading">Loading polls...</div>;
  }

  return (
    <div className="poll-results-container">
      <h2>Poll Results</h2>
      
      <div className="filter-controls">
        <label>
          Filter by Status:
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="">All Polls</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <button onClick={fetchPolls} className="refresh-btn">Refresh</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {polls.length === 0 ? (
        <p className="no-polls">No polls found.</p>
      ) : (
        polls.map((poll, index) => {
          // Handle both API response format and localStorage format
          const isApiFormat = poll.options && Array.isArray(poll.options) && poll.options[0].text;
          
          const options = isApiFormat 
            ? poll.options.map(opt => opt.text) 
            : (poll.options || []);
          
          const votes = isApiFormat 
            ? poll.options.map(opt => opt.votes) 
            : (poll.votes || []);
          
          const total = votes.reduce((a, b) => a + b, 0) || 1;
          const percentages = votes.map(v => ((v / total) * 100).toFixed(1));

          const chartData = {
            labels: options,
            datasets: [
              {
                label: '% of Votes',
                data: percentages,
                backgroundColor: ['#4CAF50', '#F44336', '#2196F3', '#FF9800', '#9C27B0', '#607D8B'],
                borderWidth: 1,
              },
            ],
          };

          const chartOptions = {
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: (value) => `${value}%`,
                },
              },
            },
          };

          return (
            <div className={`poll-card ${poll.status === 'closed' ? 'closed' : ''}`} key={poll._id || index}>
              <div className="poll-header">
                <h4 className="poll-question">{poll.title || poll.question}</h4>
                {poll.status && (
                  <span className={`poll-status-badge ${poll.status}`}>
                    {poll.status.charAt(0).toUpperCase() + poll.status.slice(1)}
                  </span>
                )}
              </div>
              
              {poll.description && <p className="poll-description">{poll.description}</p>}
              
              <Bar data={chartData} options={chartOptions} />
              
              <p className="poll-total">
                Total Votes: <strong>{total}</strong>
              </p>
              
              {poll.endDate && (
                <p className="poll-end-date">
                  Ends on: <strong>{new Date(poll.endDate).toLocaleDateString()}</strong>
                </p>
              )}

              <div className="poll-actions">
                {poll._id ? (
                  <>
                    {poll.status === 'active' && (
                      <button 
                        className="close-btn"
                        onClick={() => handleClosePoll(poll._id)}
                      >
                        Close Poll
                      </button>
                    )}
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeletePoll(poll._id)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  // Fallback for localStorage data
                  <button
                    className="publish-btn"
                    onClick={() => togglePublish(index)}
                  >
                    {poll.published ? 'Unpublish' : 'Publish'} Result
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default PollResults;

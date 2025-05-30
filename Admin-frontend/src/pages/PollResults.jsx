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
import { getAllPolls, updatePoll, deletePoll } from '../api/polls';
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
        // Assuming localStorage polls have a 'published' field for active status
        setPolls(storedPolls.map(poll => ({ ...poll, isActive: poll.published }))); 
      } else {
        // Map API response polls to ensure 'isActive' field exists
        setPolls(response.map(poll => ({ ...poll, isActive: poll.isActive })));
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch polls: ' + err.message);
      // Fallback to localStorage
      const storedPolls = JSON.parse(localStorage.getItem('polls')) || [];
      // Assuming localStorage polls have a 'published' field for active status
      setPolls(storedPolls.map(poll => ({ ...poll, isActive: poll.published })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [statusFilter]);

  const handleToggleActive = async (poll) => {
    try {
      const updatedPoll = { ...poll, isActive: !poll.isActive };
      const response = await updatePoll(poll._id, { isActive: updatedPoll.isActive });
      
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(`Poll ${updatedPoll.isActive ? 'activated' : 'deactivated'} successfully`);
        // Update the state with the modified poll
        setPolls(polls.map(p => p._id === poll._id ? updatedPoll : p));
        // Update localStorage for consistency (if needed)
        // Note: localStorage fallback might need adjustment to handle 'isActive'
      }
    } catch (err) {
      toast.error('Error updating poll status: ' + err.message);
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
          setPolls(polls.filter(poll => poll._id !== id));
          // Update localStorage for consistency (if needed)
          // Note: localStorage fallback might need adjustment to handle deleted items
        }
      } catch (err) {
        toast.error('Error deleting poll: ' + err.message);
      }
    }
  };

  // Old fallback function for localStorage compatibility (can be removed or updated)
  const togglePublish = (index) => {
    const updatedPolls = [...polls];
    const poll = updatedPolls[index];
    poll.published = !poll.published;
    // Update isActive for consistency with new state structure
    poll.isActive = poll.published;
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
          const isApiFormat = poll._id && poll.options && Array.isArray(poll.options) && typeof poll.isActive !== 'undefined'; // Improved check
          
          const options = isApiFormat 
            ? poll.options.map(opt => opt.text) 
            : (poll.options || []).map(opt => opt.text); // Ensure text is accessed correctly
          
          const votes = isApiFormat 
            ? poll.options.map(opt => opt.votes) // Use opt.votes directly as it's a number
            : (poll.votes || []); // Assuming localStorage stores total votes per option
          
          const total = votes.reduce((a, b) => a + b, 0) || 1;

          const chartData = {
            labels: options,
            datasets: [
              {
                label: 'Number of Votes',
                data: votes,
                backgroundColor: ['#4CAF50', '#F44336', '#2196F3', '#FF9800', '#9C27B0', '#607D8B'],
                borderWidth: 1,
              },
            ],
          };

          const chartOptions = {
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => `${value}`,
                },
              },
            },
          };

          return (
            <div className={`poll-card ${poll.isActive === false ? 'closed' : ''}`} key={poll._id || index}> {/* Use isActive for class */}              <div className="poll-header">
                <h4 className="poll-question">{poll.question || poll.title}</h4> {/* Use question for API, title for localStorage */}                {typeof poll.isActive !== 'undefined' ? ( // Display status badge based on isActive
                  <span className={`poll-status-badge ${poll.isActive ? 'active' : 'closed'}`}>
                    {poll.isActive ? 'Active' : 'Closed'}
                  </span>
                ) : poll.status && ( // Fallback for old status field
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
              
              {poll.endDate && ( // Display end date if available
                <p className="poll-end-date">
                  Ends on: <strong>{new Date(poll.endDate).toLocaleDateString()}</strong>
                </p>
              )}

              <div className="poll-actions">
                {poll._id ? ( // Show action buttons only for API polls
                  <>
                    <button 
                      className="toggle-active-btn"
                      onClick={() => handleToggleActive(poll)}
                    >
                      {poll.isActive ? 'Deactivate Poll' : 'Activate Poll'}
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeletePoll(poll._id)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  // Fallback for localStorage data - Keep old toggle if needed
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

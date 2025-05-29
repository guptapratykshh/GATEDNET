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
  Title
} from 'chart.js';
import { getAllPolls, updatePoll, deletePoll } from '../api/polls';
import 'react-toastify/dist/ReactToastify.css';
import './PollResults.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const PollResults = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const response = await getAllPolls(statusFilter);
      console.log('API Response:', response); // Debug log
      if (response.error) {
        setError(response.error);
        setPolls([]);
      } else {
        const formattedPolls = response.map(poll => ({
          ...poll,
          isActive: poll.isActive,
          options: poll.options ? poll.options.map(option => ({
            ...option,
            votes: typeof option.votes === 'number' ? option.votes : 0 // Handle votes as number
          })) : []
        }));
        console.log('Formatted polls:', formattedPolls); // Debug log
        setPolls(formattedPolls);
        setError(null);
      }
    } catch (err) {
      console.error('Fetch error:', err); // Debug log
      setError('Failed to fetch polls: ' + err.message);
      setPolls([]);
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
        }
      } catch (err) {
        toast.error('Error deleting poll: ' + err.message);
      }
    }
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
        polls.map((poll) => {
          console.log('Rendering poll:', poll); // Debug log
          const options = poll.options.map(opt => opt.text);
          const votes = poll.options.map(opt => opt.votes || 0); // Get votes as numbers
          
          console.log('Chart data:', { options, votes }); // Debug log
          
          const total = votes.reduce((a, b) => a + b, 0);
          const percentages = votes.map(v => ((v / total) * 100).toFixed(1));

          const chartData = {
            labels: options,
            datasets: [
              {
                label: 'Votes',
                data: votes,
                backgroundColor: ['#4e7cff', '#6e8eff', '#3b5fe0', '#1E3A8A', '#5e7eff', '#172C6A'],
                borderWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.1)',
                borderRadius: 5,
              },
            ],
          };

          console.log('Final chart data:', chartData); // Debug log

          const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                labels: {
                  color: '#cccccc',
                  font: {
                    weight: 'bold',
                  },
                },
              },
              title: {
                display: true,
                text: 'Poll Results',
                color: '#ffffff',
                font: {
                  size: 20,
                  weight: 'bold',
                },
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                bodyColor: '#ffffff',
                titleColor: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                cornerRadius: 4,
              }
            },
            scales: {
              x: {
                ticks: {
                  color: '#ffffff',
                  font: {
                    weight: 'bold'
                  }
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                }
              },
              y: {
                ticks: {
                  color: '#ffffff',
                  font: {
                    weight: 'bold'
                  }
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                }
              }
            }
          };

          return (
            <div className={`poll-card ${poll.isActive === false ? 'closed' : ''}`} key={poll._id}>
              <div className="poll-header">
                <h4 className="poll-question">{poll.question}</h4>
                {typeof poll.isActive !== 'undefined' && (
                  <span className={`poll-status-badge ${poll.isActive ? 'active' : 'closed'}`}>
                    {poll.isActive ? 'Active' : 'Closed'}
                  </span>
                )}
              </div>
              
              {poll.description && <p className="poll-description">{poll.description}</p>}
              
              <div style={{ height: '300px', width: '100%' }}>
              <Bar data={chartData} options={chartOptions} />
              </div>
              
              <p className="poll-total">
                Total Votes: <strong>{total}</strong>
              </p>
              
              {poll.endDate && (
                <p className="poll-end-date">
                  Ends on: <strong>{new Date(poll.endDate).toLocaleDateString()}</strong>
                </p>
              )}

              <div className="poll-actions">
                {/* Show action buttons only for API polls - _id check is sufficient */}                <>
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

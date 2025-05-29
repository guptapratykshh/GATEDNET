import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import useStore from '../store/useStore';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Button from '../components/UI/Button';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AllPollsPage = () => {
  const { activePolls, fetchActivePolls, castVote, isLoading, error, user } = useStore();
  const [voteMessages, setVoteMessages] = useState({}); // State to manage vote messages per poll

  useEffect(() => {
    fetchActivePolls();
  }, [fetchActivePolls]);

  const handleVote = async (pollId, optionIndex) => {
    const memberId = user?._id;
    if (!memberId) {
      setVoteMessages(prev => ({ ...prev, [pollId]: 'Error: User not logged in.' }));
      return;
    }

    // Clear previous message for this poll
    setVoteMessages(prev => ({ ...prev, [pollId]: null }));
    
    try {
      await castVote(pollId, optionIndex);
      setVoteMessages(prev => ({ ...prev, [pollId]: 'Vote submitted successfully!' }));
    } catch (err) {
      setVoteMessages(prev => ({ ...prev, [pollId]: err.message || 'Failed to submit vote.' }));
    }
  };

  if (isLoading && activePolls.length === 0) {
    return <Layout><div className="text-center py-8">Loading polls...</div></Layout>;
  }

  if (error) {
    return <Layout><div className="text-center py-8 text-red-600 bg-red-100 rounded">{error}</div></Layout>;
  }

  if (activePolls.length === 0) {
    return <Layout><div className="text-center py-8">No active polls at the moment.</div></Layout>;
  }

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-navy-900 mb-6">All Live Polls</h2>
      <div className="space-y-10">
        {activePolls.map(poll => {
          // Calculate total votes for chart display
          const totalVotes = poll.options.reduce((sum, option) => sum + (option.votes ? option.votes.length : 0), 0);

          // Prepare chart data
          const chartData = {
            labels: poll.options.map(opt => opt.text),
            datasets: [
              {
                label: 'Number of Votes',
                data: poll.options.map(opt => (opt.votes ? opt.votes.length : 0)),
                backgroundColor: 'rgba(75, 192, 250, 0.6)',
                borderColor: 'rgb(45, 85, 255)',
                borderWidth: 1,
              },
            ],
          };

          const chartOptions = {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { stepSize: 1 },
              },
            },
          };

          return (
            <div key={poll._id || poll.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">{poll.title || poll.question}</h3>
              
              {/* Display chart */}
              {totalVotes > 0 ? (
                 <div className="mb-6"><Bar data={chartData} options={chartOptions} /></div>
              ) : (
                 <div className="text-center py-6 text-gray-500 mb-6">No votes yet.</div>
              )}

              {/* Display vote message for this poll */}
              {voteMessages[poll._id] && (
                 <div className={`mt-4 mb-4 text-center p-3 rounded ${voteMessages[poll._id].includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                   {voteMessages[poll._id]}
                 </div>
               )}

              <div className="mt-4">
                <h4 className="font-medium mb-2">Cast your vote:</h4>
                <div className="space-y-2">
                  {poll.options.map((option, index) => (
                    <div
                      key={option._id || index}
                      className="p-3 border rounded-md cursor-pointer transition-colors hover:border-blue-500"
                      onClick={() => handleVote(poll._id, index)}
                    >
                      {option.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default AllPollsPage; 
import React, { useEffect, useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import useStore from '../../store/useStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PollModal = ({ pollId, onClose }) => {
  const { activePolls, castVote, isLoading, error } = useStore();
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [voteMessage, setVoteMessage] = useState(null);
  
  useEffect(() => {
    if (pollId) {
      const poll = activePolls.find(p => p._id === pollId);
      if (poll) {
        setSelectedPoll(poll);
        setVoteMessage(null); // Reset message on new poll
      }
    }
  }, [pollId, activePolls]);
  
  const handlePrevPoll = () => {
    if (!selectedPoll) return;
    
    const currentIndex = activePolls.findIndex(p => p._id === selectedPoll._id);
    if (currentIndex > 0) {
      setSelectedPoll(activePolls[currentIndex - 1]);
      setVoteMessage(null);
      setSelectedOptionIndex(null);
    }
  };
  
  const handleNextPoll = () => {
    if (!selectedPoll) return;
    
    const currentIndex = activePolls.findIndex(p => p._id === selectedPoll._id);
    if (currentIndex < activePolls.length - 1) {
      setSelectedPoll(activePolls[currentIndex + 1]);
      setVoteMessage(null);
      setSelectedOptionIndex(null);
    }
  };
  
  const handleVote = async () => {
    if (selectedPoll && selectedOptionIndex !== null) {
      try {
        await castVote(selectedPoll._id, selectedOptionIndex);
        setVoteMessage('Vote submitted successfully!');
        // The store will refetch polls, which will update selectedPoll via useEffect
      } catch (err) {
        setVoteMessage(err.message || 'Failed to submit vote.');
      }
      setSelectedOptionIndex(null); // Clear selection after attempting to vote
    }
  };
  
  if (!selectedPoll) return null;
  
  // Calculate total votes
  const totalVotes = selectedPoll.options.reduce((sum, option) => sum + (option.votes ? option.votes.length : 0), 0);

  // Prepare chart data
  const chartData = {
    labels: selectedPoll.options.map(opt => opt.text),
    datasets: [
      {
        label: 'Number of Votes',
        data: selectedPoll.options.map(opt => (opt.votes ? opt.votes.length : 0)),
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
        ticks: { stepSize: 1 }, // Ensure integer ticks for votes
      },
    },
  };
  
  return (
    <Modal isOpen={!!pollId} onClose={onClose} title="ACTIVE VOTES" width="lg">
      <div className="relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
          <button 
            onClick={handlePrevPoll}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
            disabled={activePolls.findIndex(p => p._id === selectedPoll._id) === 0}
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        
        <div className="mx-10 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            {/* Only show chart if there are votes */}
            {totalVotes > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <div className="text-center py-10 text-gray-500">No votes yet.</div>
            )}
          </div>
          
          <h3 className="text-center mt-4 text-xl font-bold text-navy-900">
            {selectedPoll.title.toUpperCase()}
          </h3>
          
          {/* Display vote message */}
          {voteMessage && (
            <div className={`mt-4 text-center p-3 rounded ${voteMessage.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {voteMessage}
            </div>
          )}
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Cast your vote:</h4>
            <div className="space-y-2">
              {selectedPoll.options.map((option, index) => (
                <div 
                  key={option._id || index}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedOptionIndex === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedOptionIndex(index)}
                >
                  {option.text}
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleVote}
                disabled={selectedOptionIndex === null || isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Vote'}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
          <button 
            onClick={handleNextPoll}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
            disabled={activePolls.findIndex(p => p._id === selectedPoll._id) === activePolls.length - 1}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PollModal;
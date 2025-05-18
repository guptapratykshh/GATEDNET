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
  const { activePolls, castVote } = useStore();
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  
  useEffect(() => {
    if (pollId) {
      const poll = activePolls.find(p => p.id === pollId);
      if (poll) {
        setSelectedPoll(poll);
      }
    }
  }, [pollId, activePolls]);
  
  const handlePrevPoll = () => {
    if (!selectedPoll) return;
    
    const currentIndex = activePolls.findIndex(p => p.id === selectedPoll.id);
    if (currentIndex > 0) {
      setSelectedPoll(activePolls[currentIndex - 1]);
    }
  };
  
  const handleNextPoll = () => {
    if (!selectedPoll) return;
    
    const currentIndex = activePolls.findIndex(p => p.id === selectedPoll.id);
    if (currentIndex < activePolls.length - 1) {
      setSelectedPoll(activePolls[currentIndex + 1]);
    }
  };
  
  const handleVote = async () => {
    if (selectedPoll && selectedOption) {
      await castVote(selectedPoll.id, selectedOption);
      setSelectedOption(null);
    }
  };
  
  if (!selectedPoll) return null;
  
  const chartData = {
    labels: selectedPoll.options.map(opt => opt.text),
    datasets: [
      {
        label: 'Number of Votes',
        data: selectedPoll.options.map(opt => opt.votes),
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
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        
        <div className="mx-10 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <Bar data={chartData} options={chartOptions} />
          </div>
          
          <h3 className="text-center mt-4 text-xl font-bold text-navy-900">
            {selectedPoll.title.toUpperCase()}
          </h3>
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Cast your vote:</h4>
            <div className="space-y-2">
              {selectedPoll.options.map(option => (
                <div 
                  key={option.id}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedOption === option.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedOption(option.id)}
                >
                  {option.text}
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleVote}
                disabled={!selectedOption}
              >
                Submit Vote
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
          <button 
            onClick={handleNextPoll}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PollModal;
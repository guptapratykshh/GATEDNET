import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import './PollsModal.css';

// Mock data - replace with actual data fetching
const mockPolls = [
  {
    id: 1,
    title: 'Community Garden Proposal',
    description: 'Should we convert the empty lot into a community garden?',
    options: [
      { id: 1, text: 'Yes', votes: 45 },
      { id: 2, text: 'No', votes: 15 },
      { id: 3, text: 'Need more information', votes: 10 }
    ],
    endDate: '2023-11-30'
  },
  {
    id: 2,
    title: 'Swimming Pool Hours',
    description: 'What should be the new swimming pool hours?',
    options: [
      { id: 1, text: '6 AM - 10 PM', votes: 28 },
      { id: 2, text: '7 AM - 9 PM', votes: 32 },
      { id: 3, text: '8 AM - 8 PM', votes: 18 }
    ],
    endDate: '2023-11-25'
  }
];

const PollsModal = ({ isOpen, onClose }) => {
  const [polls, setPolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching polls
    const fetchPolls = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        setTimeout(() => {
          setPolls(mockPolls);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching polls:', error);
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchPolls();
    }
  }, [isOpen]);

  const handlePollClick = (poll) => {
    setSelectedPoll(poll);
  };

  const handleVote = (pollId, optionId) => {
    // Update votes in UI
    setPolls(polls.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          options: poll.options.map(option => {
            if (option.id === optionId) {
              return { ...option, votes: option.votes + 1 };
            }
            return option;
          })
        };
      }
      return poll;
    }));

    // Update selected poll if it's the one being voted on
    if (selectedPoll && selectedPoll.id === pollId) {
      setSelectedPoll(polls.find(p => p.id === pollId));
    }

    // In a real app, would make API call to record vote
    console.log(`Voted for option ${optionId} in poll ${pollId}`);
  };

  const handleBackToPolls = () => {
    setSelectedPoll(null);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={selectedPoll ? 'Poll Results' : 'Live Polls'} 
      width="600px"
    >
      {loading ? (
        <div className="loading-spinner">Loading polls...</div>
      ) : (
        <>
          {selectedPoll ? (
            <div className="poll-detail">
              <button className="back-btn" onClick={handleBackToPolls}>
                ← Back to all polls
              </button>
              <h3>{selectedPoll.title}</h3>
              <p className="poll-description">{selectedPoll.description}</p>
              
              <div className="poll-chart">
                {selectedPoll.options.map(option => {
                  const totalVotes = selectedPoll.options.reduce((sum, opt) => sum + opt.votes, 0);
                  const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                  
                  return (
                    <div key={option.id} className="chart-bar-container">
                      <div className="chart-label">
                        <span>{option.text}</span>
                        <span>{percentage}% ({option.votes} votes)</span>
                      </div>
                      <div className="chart-bar-bg">
                        <div 
                          className="chart-bar-fill" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="poll-actions">
                <p className="poll-deadline">Poll ends: {selectedPoll.endDate}</p>
                <div className="poll-options">
                  {selectedPoll.options.map(option => (
                    <button 
                      key={option.id} 
                      className="vote-btn"
                      onClick={() => handleVote(selectedPoll.id, option.id)}
                    >
                      Vote for "{option.text}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="polls-list">
              {polls.length === 0 ? (
                <p className="no-polls">No active polls at the moment.</p>
              ) : (
                polls.map(poll => (
                  <div 
                    key={poll.id} 
                    className="poll-card"
                    onClick={() => handlePollClick(poll)}
                  >
                    <h3>{poll.title}</h3>
                    <p>{poll.description}</p>
                    <div className="poll-meta">
                      <span className="poll-options-count">{poll.options.length} options</span>
                      <span className="poll-deadline">Ends: {poll.endDate}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default PollsModal;
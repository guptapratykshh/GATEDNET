import React from 'react';
import Modal from '../UI/Modal';
import useStore from '../../store/useStore';
import PollItem from './PollItem';

const AllPollsModal = ({ isOpen, onClose, onViewPoll }) => {
  const { activePolls, isLoading, error } = useStore();
  
  const calculateProgress = (poll) => {
    // Calculate progress based on actual vote count from backend
    const totalVotes = poll.options.reduce((sum, option) => sum + (option.votes ? option.votes.length : 0), 0);
    // Use the same placeholder as in ActivePolls for consistency
    const placeholderTotal = 10; 
    return Math.min(100, (totalVotes / placeholderTotal) * 100);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ALL LIVE POLLS" width="lg">
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-4">Loading polls...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-600 bg-red-100 rounded">{error}</div>
        ) : activePolls.length === 0 ? (
          <div className="text-center py-4">No active polls at the moment</div>
        ) : (
          activePolls.map(poll => (
            <PollItem
              key={poll._id || poll.id}
              id={poll._id || poll.id}
              title={poll.title || poll.question}
              progress={calculateProgress(poll)}
              onClick={() => {
                onViewPoll(poll._id || poll.id);
                onClose(); // Close the AllPollsModal when viewing a single poll
              }}
            />
          ))
        )}
      </div>
    </Modal>
  );
};

export default AllPollsModal;
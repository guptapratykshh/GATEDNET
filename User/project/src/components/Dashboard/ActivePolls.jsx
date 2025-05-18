import React, { useEffect } from 'react';
import PollItem from '../Poll/PollItem';
import Card from '../UI/Card';
import useStore from '../../store/useStore';

const ActivePolls = ({ onViewPoll }) => {
  const { activePolls, fetchActivePolls, isLoading } = useStore();
  
  useEffect(() => {
    fetchActivePolls();
  }, [fetchActivePolls]);
  
  const calculateProgress = (poll) => {
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
    return Math.min(100, (totalVotes / 300) * 100);
  };
  
  return (
    <Card 
      title="ACTIVE VOTES"
      footer={<span>SEE ALL LIVE POLLS</span>}
    >
      {isLoading ? (
        <div className="text-center py-4">Loading polls...</div>
      ) : activePolls.length === 0 ? (
        <div className="text-center py-4">No active polls at the moment</div>
      ) : (
        <div>
          {activePolls.map(poll => (
            <PollItem
              key={poll.id}
              id={poll.id}
              title={poll.title}
              progress={calculateProgress(poll)}
              onClick={onViewPoll}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default ActivePolls;
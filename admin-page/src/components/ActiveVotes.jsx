import { useNavigate } from 'react-router-dom';

const ActiveVotes = () => {
  const navigate = useNavigate();

  return (
    <div className="card">
      <h3>ACTIVE VOTES</h3>
      <div className="poll-button-container">
        <button className="poll-button" onClick={() => navigate('/create-poll')}>
          ➕<br />Create a new poll
        </button>
        <button className="poll-button" onClick={() => navigate('/poll-results')}>
          ✅<br />View / Publish Poll Results
        </button>
      </div>
    </div>
  );
};

export default ActiveVotes;
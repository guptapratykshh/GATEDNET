import React from 'react';
import ActiveVotes from './ActiveVotes';
import MaintenanceUpdates from '../pages/MaintenanceUpdates';
import Announcements from './Announcements';
import SocietyByLaws from './SocietyByLaws';
import BookedAmenities from './BookedAmenities';
import SocietyMembers from './SocietyMembers';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="row">
        <ActiveVotes />
        <MaintenanceUpdates />
      </div>
      <div className="row">
        <Announcements />
        <SocietyByLaws />
        <BookedAmenities />
        <SocietyMembers />
      </div>
    </div>
  );
};

export default Dashboard;

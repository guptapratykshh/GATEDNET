import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import ActivePolls from '../components/Dashboard/ActivePolls';
import MaintenanceUpdates from '../components/Dashboard/MaintenanceUpdates';
import Notifications from '../components/Dashboard/Notifications';
import BookedAmenities from '../components/Dashboard/BookedAmenities';
import Announcements from '../components/Dashboard/Announcements';
import PollModal from '../components/Poll/PollModal';
import AmenityModal from '../components/Amenity/AmenityModal';
import SettingsModal from '../components/Settings/SettingsModal';
import AllMaintenanceModal from '../components/Maintenance/AllMaintenanceModal';
import AllNotificationsModal from '../components/Dashboard/AllNotificationsModal';
import AllAnnouncementsModal from '../components/Dashboard/AllAnnouncementsModal';

// Main dashboard component for displaying all features
const Dashboard = () => {
  const [activePollId, setActivePollId] = useState(null);
  const [showAmenityModal, setShowAmenityModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAllMaintenanceModal, setShowAllMaintenanceModal] = useState(false);
  const [showAllNotificationsModal, setShowAllNotificationsModal] = useState(false);
  const [showAllAnnouncementsModal, setShowAllAnnouncementsModal] = useState(false);
  
  const navigate = useNavigate();
  
  const handleViewPoll = (pollId) => {
    setActivePollId(pollId);
  };
  
  const handleClosePollModal = () => {
    setActivePollId(null);
  };
  
  const handleBookAmenity = () => {
    setShowAmenityModal(true);
  };
  
  // Handles sidebar navigation and opens corresponding modals/pages
  const handleSidebarItemClick = (item) => {
    switch (item) {
      case 'settings':
        setShowSettingsModal(true);
        break;
      case 'voting':
        navigate('/user/polls'); // Navigate to the new polls page
        break;
      case 'maintenance':
        setShowAllMaintenanceModal(true);
        break;
      case 'amenity':
        setShowAmenityModal(true);
        break;
      default:
        break;
    }
  };
  
  return (
    <Layout onSidebarItemClick={handleSidebarItemClick}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <ActivePolls 
              onViewPoll={handleViewPoll}
              onSeeAll={() => navigate('/user/polls')} // Navigate to polls page
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BookedAmenities onBookAmenity={handleBookAmenity} />
            <Announcements onSeeAll={() => setShowAllAnnouncementsModal(true)} />
          </div>
        </div>
        <div className="space-y-6">
          <MaintenanceUpdates onSeeAll={() => setShowAllMaintenanceModal(true)} />
          <Notifications onSeeAll={() => setShowAllNotificationsModal(true)} />
        </div>
      </div>
      
      {/* Modals */}
      <PollModal pollId={activePollId} onClose={handleClosePollModal} />
      <AmenityModal isOpen={showAmenityModal} onClose={() => setShowAmenityModal(false)} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
      <AllMaintenanceModal 
        isOpen={showAllMaintenanceModal} 
        onClose={() => setShowAllMaintenanceModal(false)} 
      />
      <AllNotificationsModal 
        isOpen={showAllNotificationsModal}
        onClose={() => setShowAllNotificationsModal(false)}
      />
      <AllAnnouncementsModal 
        isOpen={showAllAnnouncementsModal}
        onClose={() => setShowAllAnnouncementsModal(false)}
      />
    </Layout>
  );
};

export default Dashboard;
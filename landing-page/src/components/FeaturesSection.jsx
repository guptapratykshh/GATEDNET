import votingImg from '../assets/votingImg.png';
import maintenanceImg from '../assets/maintenanceImg.png';
import bookingImg from '../assets/bookingImg.png';
import announcementImg from '../assets/announcementImg.png';

const FeaturesSection = () => (
  <section className="features">
    <div className="feature-card">
      <img src={votingImg} alt="Voting & Polling" className="feature-img" />
      <h3>VOTING & POLLING</h3>
      <p>Conduct live polls and gather community opinions</p>
    </div>
    <div className="feature-card">
      <img src={maintenanceImg} alt="Maintenance Reporting" className="feature-img" />
      <h3>MAINTENANCE REPORTING</h3>
      <p>Report and track maintenance issues</p>
    </div>
    <div className="feature-card">
      <img src={bookingImg} alt="Amenity Booking" className="feature-img" />
      <h3>AMENITY BOOKING</h3>
      <p>Reserve community facilities in real time</p>
    </div>
    <div className="feature-card">
      <img src={announcementImg} alt="Announcements" className="feature-img" />
      <h3>ANNOUNCEMENTS</h3>
      <p>All the announcements at one place so you don't miss anything</p>
    </div>
  </section>
);

export default FeaturesSection; 
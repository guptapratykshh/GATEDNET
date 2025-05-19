import React from 'react';
import votingImg from '../assets/votingImg.png';
import maintenanceImg from '../assets/maintenanceImg.png';
import bookingImg from '../assets/bookingImg.png';
import announcementImg from '../assets/announcementImg.png';

const features = [
  {
    title: 'VOTING & POLLING',
    desc: 'Conduct live polls and gather community opinions',
    image: votingImg,
  },
  {
    title: 'MAINTENANCE REPORTING',
    desc: 'Report and track maintenance issues seamlessly',
    image: maintenanceImg,
  },
  {
    title: 'AMENITY BOOKING',
    desc: 'Reserve community facilities in real time',
    image: bookingImg,
  },
  {
    title: 'ANNOUNCEMENTS',
    desc: 'All the announcements at one place so you don’t miss any deadlines',
    image: announcementImg,
  },
];

const FeaturesSection = () => {
  return (
    <section className="features-section">
      {features.map((feature, idx) => (
        <div key={idx} className="feature-card">
          <img
            src={feature.image}
            alt={feature.title}
            style={{ width: '130px', height: '98px', marginBottom: '1rem' }}
          />
          <h3>{feature.title}</h3>
          <p>{feature.desc}</p>
        </div>
      ))}
    </section>
  );
};

export default FeaturesSection;

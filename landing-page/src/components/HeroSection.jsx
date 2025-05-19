import React from 'react';
import illustration from '../assets/img.png';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-text">
        <h1>Simplifying Community Management</h1>
        <p>
          Effortless management of your gated community with our comprehensive platform
        </p>
        <div className="hero-buttons">
          <button className="btn-primary">Admin</button>
          <button className="btn-primary">User</button>
        </div>
      </div>
      <img src={illustration} alt="Illustration" />
    </section>
  );
};

export default HeroSection;

import React, { useState } from 'react';
import logo from '../assets/logo.png';

const Header = () => {
  const [modal, setModal] = useState(null);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="header-logo" />
          <div className="logo-placeholder">GREENLAND SOCIETY</div>
        </div>
        <div className="navbar-right">
          <a href="#features">Features</a>
          <a href="#pricing" onClick={e => { e.preventDefault(); setModal('pricing'); }}>Pricing</a>
          <a href="#support" onClick={e => { e.preventDefault(); setModal('support'); }}>Support</a>
        </div>
      </nav>
      {modal === 'pricing' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>&times;</button>
            <h2><span role="img" aria-label="pricing">💳</span> Pricing</h2>
            <table className="pricing-table">
              <thead>
                <tr><th>Plan</th><th>Price</th><th>Features</th></tr>
              </thead>
              <tbody>
                <tr><td>Basic</td><td>Free</td><td>Access to community news</td></tr>
                <tr><td>Standard</td><td>₹499/mo</td><td>All Basic features + Voting, Maintenance</td></tr>
                <tr><td>Premium</td><td>₹999/mo</td><td>All Standard features + Amenity Booking, Priority Support</td></tr>
              </tbody>
            </table>
            <button className="modal-bottom-btn" onClick={() => setModal(null)}>Close</button>
          </div>
        </div>
      )}
      {modal === 'support' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>&times;</button>
            <h2><span role="img" aria-label="support">🛟</span> Support</h2>
            <p>Contact us at <a href="mailto:support@greenlandsociety.com">support@greenlandsociety.com</a> or call <b>1800-123-456</b> for help.</p>
            <button className="modal-bottom-btn" onClick={() => window.location='mailto:support@greenlandsociety.com'}>Contact Us</button>
            <button className="modal-bottom-btn" onClick={() => setModal(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header; 
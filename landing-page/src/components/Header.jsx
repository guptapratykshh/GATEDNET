import React from 'react';
import logo from '../assets/logo.png'; // or from uploaded image path

const Header = () => {
  return (
    <header className="header">
 <div className="branding">
    <img src={logo} alt="GatedNet Logo" className="logo" />
    <h2>GatedNet</h2>
</div>
      <nav>
        <ul className="nav-list">
          <li>Features</li>
          <li>Pricing</li>
          <li>Support</li>
          <li>Login</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

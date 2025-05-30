import heroImg from '../assets/img.png';

const HeroSection = () => {
  const handleAdminClick = () => {
     window.open('https://ademin-f.vercel.app/admin/login', '_blank');
  };
  const handleUserClick = () => {
    window.open('https://gatednet.vercel.app/', '_blank');
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Simplifying Community Management</h1>
        <p>Effortless management of your gated community with our comprehensive platform</p>
        <div className="hero-buttons">
          <button className="admin-btn" onClick={handleAdminClick}>Admin</button>
          <button className="user-btn" onClick={handleUserClick}>User</button>
        </div>
      </div>
      <div className="hero-image">
        <img src={heroImg} alt="Hero Illustration" className="hero-img-animated" />
      </div>
    </section>
  );
};

export default HeroSection; 
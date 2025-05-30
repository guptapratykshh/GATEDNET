import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import './components/styles.css';

function App() {
  return (
    <div className="main-bg">
      <Header />
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}

export default App;

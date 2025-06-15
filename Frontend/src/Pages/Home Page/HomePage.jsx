import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function HomePage() {
  const Navigate = useNavigate();

  useEffect(() => {
    const removeRolesAndTokens = () => {
      localStorage.removeItem("admin-token");
      localStorage.removeItem("admin-role");
    };
    removeRolesAndTokens();
  }, []);

  return (
    <div className="home-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-logo-group">
          <img 
            src="/removed-bg-logo.png" 
            alt="Think Charge Logo" 
            className="logo"
          />
          <span className="navbar-title">Think Charge</span>
        </div>
        <button 
          className="login-btn"
          onClick={() => Navigate("/login")}
        >
          Login
        </button>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-slogan">
            Power up your mind with knowledge 🚀
          </h1>
          <p className="hero-description">
            Join us at Think Charge and put your quiz knowledge to the ultimate test with thrilling questions and exciting rounds. Challenge yourself, compete, and power up your mind!
          </p>
          <div className="hero-buttons">
            <a 
              href="#register" 
              className="cta-button primary"
            >
              Register Now
            </a>
            <a 
              href="#learn-more" 
              className="cta-button secondary"
            >
              Learn More
            </a>
          </div>
        </div>
        <div className="hero-image">
          <img src="/quizillustration.png" alt="Quiz Illustration" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">
          Why Choose Think Charge?
        </h2>
        <div className="features-grid">
          {[
            {
              icon: "🎯",
              title: "Challenging Questions",
              description: "Test your knowledge with carefully crafted questions"
            },
            {
              icon: "🏆",
              title: "Win Prizes",
              description: "Compete and win exciting prizes"
            },
            {
              icon: "👥",
              title: "Community",
              description: "Join a vibrant community of quiz enthusiasts"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="feature-card"
            >
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Event Highlights */}
      <section className="event-highlights">
        <div className="highlights-content">
          <h2>Event Highlights 📢</h2>
          <p>Experience engaging sessions, dynamic speakers, and powerful networking opportunities.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Think Charge</h3>
            <p>Powering minds through knowledge</p>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: chowdhurysonu047@gmail.com</p>
            <p>Developer: Sonu Chowdhury</p>
          </div>
          <div className="footer-section">
            <a 
              href="https://portfolio-sonuuchowdhury.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="portfolio-link"
            >
              Visit My Portfolio
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Think Charge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

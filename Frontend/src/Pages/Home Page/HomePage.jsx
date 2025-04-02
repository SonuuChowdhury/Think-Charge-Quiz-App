import './HomePage.css';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const Navigate= useNavigate();

  return (
    <>
      {/* Navbar */}
      <header className="navbar">
        <img src="/removed-bg-logo.png" alt="Think Charge Logo" className="logo" />
        <button className="login-btn" onClick={()=>Navigate("/login")}>Login</button>
      </header>

      {/* Hero Section */}
<section className="hero">
  <h1 className="hero-slogan">Power up your mind with knowledge.🐱‍🏍</h1>
  <p className="hero-description">
  Join us at Think Charge and put your quiz knowledge to the ultimate test with thrilling questions and exciting rounds. Challenge yourself, compete, and power up your mind!
  </p>
  <div className="hero-buttons">
    {/* <button className="register-btn">Register Now</button> */}
    <a href="#schedule" className="learn-more-btn">Register Now</a>
    <a href="#schedule" className="learn-more-btn">Learn More</a>
  </div>
</section>


      {/* Body */}
      <main className="body-content">
        <section className="event-highlights">
          <h2>Event Highlights📢</h2>
          <p>Experience engaging sessions, dynamic speakers, and powerful networking opportunities.</p>
        </section>
      </main>

    {/* Footer */}
    <footer className="footer">
    <div className="footer-details">
        <p>&copy; 2025 Think Charge. All rights reserved.</p>
        <p>
        Contact: chowdhurysonu047@gmail.com
        </p>
        <p>
        Sonu Chowdhury
        </p>
        <a 
        href="https://portfolio-sonuuchowdhury.vercel.app/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="portfolio-footer-link"
        >
        Visit My Portfolio
        </a>
    </div>
    </footer>

    </>
  );
}

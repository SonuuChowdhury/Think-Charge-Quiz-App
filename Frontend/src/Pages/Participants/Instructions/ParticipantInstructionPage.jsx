/* eslint-disable no-unused-vars */
import './ParticipantInstructionPage.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa';


export default function ParticipantInstructionPage() {
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [startTime, setStartTime] = useState(localStorage.getItem('groupStartTime')?.replace('Z', '') || null);
  const [groupName, setGroupName] = useState(() => {
    const data = JSON.parse(localStorage.getItem('participantData') || '{}');
    return data.groupName || '-';
  });
  const [teamName, setTeamName] = useState(() => {
    const data = JSON.parse(localStorage.getItem('participantData') || '{}');
    return data.teamName || '-';
  });
  const [timer, setTimer] = useState('00:00');
  const [canStart, setCanStart] = useState(false);

  // Timer logic
  useEffect(() => {
    if (!startTime) return;
    const start = new Date(startTime);
    const updateTimer = () => {
      const now = new Date();
      const diff = start - now;
      if (diff > 0) {
        const mins = String(Math.floor(diff / 60000)).padStart(2, '0');
        const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        setTimer(`${mins}:${secs}`);
        setCanStart(false);
      } else {
        setTimer('00:00');
        setCanStart(true);
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  // Logout logic
  const handleLogout = () => setShowLogoutDialog(true);
  const confirmLogout = () => {
    localStorage.removeItem('participant-token');
    localStorage.removeItem('isAttendanceMarked');
    localStorage.removeItem('groupStartTime');
    localStorage.removeItem('participantData');
    localStorage.removeItem('attendanceDetails');
    navigate('/');
  };

  // Start Quiz logic (navigate or trigger quiz start)
  const handleStartQuiz = () => {
    if (canStart) {
      navigate('/participant/game'); // Change route as needed
    }
  };

  // Format start time for display
  const formattedStartTime = startTime ? new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' | ' + new Date(startTime).toLocaleDateString() : '-';

  // Example instructions (edit as needed)
  const instructions = [
    'Read all questions carefully before answering.',
    'Do not refresh or close the browser during the quiz.',
    'Each question may have a time limit.',
    'Ensure a stable internet connection.',
    'Do not use any unfair means; violations may lead to disqualification.',
    'Click the Start Quiz button when it becomes active.',
    'Contact the event coordinator in case of technical issues.'
  ];

  return (
    <div className="participant-instruction-root participant-instruction-theme-vibrant">
      {/* Navbar */}
      <nav className="participant-instruction-navbar">
        <div className="participant-instruction-navbar-left">
          <FaUsers className="participant-instruction-group-logo" />
          <div className="participant-instruction-group-info">
            <span className="participant-instruction-group-label">Group</span>
            <span className="participant-instruction-group-name">{groupName}</span>
            <span className="participant-instruction-team-name">{teamName}</span>
          </div>
        </div>
        <button className="participant-instruction-logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="participant-instruction-dialog-backdrop">
          <div className="participant-instruction-dialog">
            <div className="participant-instruction-dialog-title">Confirm Logout</div>
            <div className="participant-instruction-dialog-message">
              Logging out now will affect your quiz participation. Are you sure you want to logout?
            </div>
            <div className="participant-instruction-dialog-actions">
              <button className="participant-instruction-dialog-cancel" onClick={() => setShowLogoutDialog(false)}>Cancel</button>
              <button className="participant-instruction-dialog-confirm" onClick={confirmLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
      {/* Main Section */}
      <main className="participant-instruction-main">
        {/* Left: Instructions */}
        <section className="participant-instruction-left">
          <h2 className="participant-instruction-title">Quiz Instructions</h2>
          <ul className="participant-instruction-list">
            {instructions.map((inst, idx) => (
              <li className="participant-instruction-list-item" key={idx}>{inst}</li>
            ))}
          </ul>
        </section>
        {/* Right: Start Time & Timer */}
        <section className="participant-instruction-right">
          <div className="participant-instruction-start-info">
            <div className="participant-instruction-start-label">Quiz Start Time</div>
            <div className="participant-instruction-start-time">{formattedStartTime}</div>
          </div>
          <div className="participant-instruction-timer-container">
            <span className="participant-instruction-timer-label">Time Remaining</span>
            <span className="participant-instruction-timer-value">{timer}</span>
          </div>
          <button
            className="participant-instruction-start-btn"
            onClick={handleStartQuiz}
            disabled={!canStart}
          >
            Start Quiz
          </button>
        </section>
      </main>
    </div>
  );
}




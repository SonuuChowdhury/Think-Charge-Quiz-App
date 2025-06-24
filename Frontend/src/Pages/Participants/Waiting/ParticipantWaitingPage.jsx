import './ParticipateWaitingPage.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../Components/Loader/Loader';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

export default function ParticipantWaitingPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [teamData] = useState({
    isAttendanceMarked: localStorage.getItem('isAttendanceMarked') === 'true',
    groupStartTime: localStorage.getItem('groupStartTime') || null,
    participantData: JSON.parse(localStorage.getItem('participantData') || '{}'),
  });

  // Attendance window: open = start - 30min, close = start + 15min
  const getWindowTimes = (start) => {
    if (!start) return { open: '', close: '', start: '' };
    const startDate = new Date(start.replace('Z', ''));
    const openDate = new Date(startDate.getTime() - 30 * 60 * 1000);
    const closeDate = new Date(startDate.getTime() + 15 * 60 * 1000);
    const format = (d) =>
      d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
      ' | ' +
      d.toLocaleDateString();
    return {
      open: format(openDate),
      close: format(closeDate),
      start: format(startDate),
      openDate,
      closeDate,
      startDate,
    };
  };

  const { participantData, groupStartTime } = teamData;
  const windowTimes = getWindowTimes(groupStartTime);
  const now = new Date();
  const startDate = groupStartTime ? new Date(groupStartTime.replace('Z', '')) : null;
  const openDate = startDate ? new Date(startDate.getTime() - 30 * 60 * 1000) : null;
  const closeDate = startDate ? new Date(startDate.getTime() + 15 * 60 * 1000) : null;
  const windowStatus = now >= openDate && now <= closeDate ? 'Open' : 'Closed';

  // Counter logic
  const [remaining, setRemaining] = useState('00:00');
  const intervalRef = useRef();

  useEffect(() => {
    if (windowStatus === 'Open' && closeDate) {
      const updateCounter = () => {
        const now = new Date();
        const diff = closeDate - now;
        if (diff > 0) {
          const mins = String(Math.floor(diff / 60000)).padStart(2, '0');
          const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
          setRemaining(`${mins}:${secs}`);
        } else {
          setRemaining('00:00');
        }
      };
      updateCounter();
      intervalRef.current = setInterval(updateCounter, 1000);
      return () => clearInterval(intervalRef.current);
    } else {
      setRemaining('00:00');
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [windowStatus, closeDate]);

  // Refresh handler
  const handleRefresh = async () => {
    if (windowStatus === 'Open') {
      setIsLoading(true);
      setErrorMessage('');
      
      try {
        const token = localStorage.getItem('participant-token');
        const response = await axios.post('https://think-charge-quiz-app.onrender.com/get-attendance-status', {}, {
          headers: {
            'participant-token': token
          }
        });

        if (response.data.isAttendanceMarked) {
          // Attendance is marked - update localStorage
          localStorage.setItem('isAttendanceMarked', 'true');
          localStorage.setItem('attendanceDetails', JSON.stringify(response.data.attendanceDetails));
          // Don't update groupStartTime as requested
          setErrorMessage('');
          navigate("/participant/instructions")
        } else {
          // Attendance not marked - show error
          setErrorMessage('Attendance not marked yet');
        }
      } catch (error) {
        console.error('Error checking attendance status:', error);
        setErrorMessage('Error checking attendance status');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isRefreshEnabled = windowStatus === 'Open';

  const handleLogout = () => {
    localStorage.removeItem('participant-token');
    localStorage.removeItem('isAttendanceMarked');
    localStorage.removeItem('groupStartTime');
    localStorage.removeItem('participantData');
    localStorage.removeItem('attendanceDetails');
    navigate('/');
  };

  return (
    <div className="participant-waiting-root participant-waiting-theme-vibrant">
      {isLoading && <Loader />}
      {/* Navbar */}
      <nav className="participant-waiting-navbar participant-waiting-navbar-horizontal-mobile">
        <div className="participant-waiting-navbar-left">
          <img src="/logo.png" alt="Think Charge Logo" className="participant-waiting-logo" />
          <span className="participant-waiting-title">Think Charge</span>
        </div>
        <button className="participant-waiting-logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
      {/* Main Section */}
      <main className="participant-waiting-main">
        {/* Left: Team & Members */}
        <section className="participant-waiting-left">
          <div className="participant-waiting-team-info">
            <h2 className="participant-waiting-team-name">{participantData.teamName || '-'}</h2>
            <div className="participant-waiting-team-details">
              <div><b>Group:</b> {participantData.groupName || '-'}</div>
              <div><b>Mobile:</b> {participantData.mobile || '-'}</div>
              <div><b>Email:</b> {participantData.email || '-'}</div>
            </div>
          </div>
          {/* Counter, Refresh, and Message */}
          <div className="participant-waiting-counter-row">
            <span className="participant-waiting-counter-label">Time remaining to mark attendance:</span>
            <span className="participant-waiting-counter-value">{remaining}</span>
            <button
              className="participant-waiting-refresh-btn"
              onClick={handleRefresh}
              disabled={!isRefreshEnabled}
            >
              Refresh
            </button>
          </div>
          {/* Error Message */}
          {errorMessage && (
            <div className="participant-waiting-error-message">
              {errorMessage}
            </div>
          )}
          <div className="participant-waiting-members-list">
            <h3 className="participant-waiting-members-title">Team Members</h3>
            <div className="participant-waiting-members-grid">
              {(participantData.teamMembers || []).map((member, idx) => (
                <div className="participant-waiting-member-card" key={member._id || idx}>
                  <div className="participant-waiting-member-avatar">{member.name?.[0] || '?'}</div>
                  <div className="participant-waiting-member-info">
                    <div className="participant-waiting-member-name">{member.name}</div>
                    <div className="participant-waiting-member-role">{member.role}</div>
                    <div className="participant-waiting-member-meta">{member.department} | Sem {member.sem}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Right: QR & Attendance Window */}
        <section className="participant-waiting-right">
          <div className="participant-waiting-qr-container">
            <QRCodeSVG
              value={String(participantData.mobile || '')}
              size={160}
              bgColor="#fff"
              fgColor="#222"
              className="participant-waiting-qr"
            />
            <div className="participant-waiting-qr-label">Scan to Mark Attendance</div>
          </div>
          <div className="participant-waiting-window-info">
            <div><b>Start Time:</b> {windowTimes.start || '-'}</div>
            <div><b>Window Opens:</b> {windowTimes.open || '-'}</div>
            <div><b>Window Closes:</b> {windowTimes.close || '-'}</div>
            <div className={`participant-waiting-window-status participant-waiting-window-status-${windowStatus.toLowerCase()}`}>{windowStatus}</div>
          </div>
          <div className="participant-waiting-instructions">
            Show this QR code to the attendance manager present at your venue to mark your attendance.
          </div>
        </section>
      </main>
    </div>
  );
}

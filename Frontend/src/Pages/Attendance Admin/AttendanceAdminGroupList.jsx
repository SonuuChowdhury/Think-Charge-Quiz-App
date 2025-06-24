import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AttendanceAdminGroupList.css';
import { useNavigate } from 'react-router-dom';
import Loader from '../../Components/Loader/Loader';


// Helper to check if attendance window is open for a group
function isAttendanceWindowOpen(startTime) {
  if (!startTime) return false;
  const now = new Date();
  const start = new Date(startTime.slice(0, -1));
  const windowStart = new Date(start.getTime() - 30 * 60 * 1000); // 30 min before
  const windowEnd = new Date(start.getTime() + 15 * 60 * 1000); // 15 min after
  return now >= windowStart && now <= windowEnd;
}

export default function AttendanceAdminGroupList() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('admin-token');
        if (!token) {
          navigate('/admin-login');
          return;
        }
        const response = await axios.get(
          'https://think-charge-quiz-app.onrender.com/fetch-all-groups-info',
          { headers: { 'scee-event-admin-token': token } }
        );
        if (response.data.success) {
          setGroups(response.data.groups);
        } else {
          setError('Failed to fetch groups');
        }
      } catch (err) {
        setError('Error fetching groups');
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  if (loading) return <Loader/>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (<>
  <nav className="master-admin-nav">
        <div className="nav-brand">
          <h1>Attendance Dashboard</h1>
          <small>Admin Portal</small>
        </div>
        <button className="logout-button" onClick={() => navigate('/admin-login')}>
          Log Out
        </button>
      </nav>
    <div className="attendance-group-list">
      
      <h2>Groups</h2>
      {groups.length === 0 ? (
        <div>No groups found.</div>
      ) : (
        <ul>
          {groups.map((group) => {
            const enabled = isAttendanceWindowOpen(group.startTime);
            return (
              <li onClick={() => navigate(`/attendance-admin/${group.groupName}`)} key={group.groupName} style={{ marginBottom: '1rem' }}>
                <div>
                  <strong>{group.groupName}</strong> &mdash; Teams: {group.teamCount}
                  <br />
                  <span className="start-time">
                    Start Time: {group.startTime ? new Date(group.startTime.slice(0, -1)).toLocaleString('en-IN') : 'Not set'}
                  </span>
                  <br />
                  <span className={enabled ? 'open' : 'closed'}>
                    {enabled ? 'Attendance Window OPEN' : 'Attendance Window CLOSED'}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div></>
  );
}

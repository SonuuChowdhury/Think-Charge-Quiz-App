/* eslint-disable no-unused-vars */
import './AttendnaceAdmin.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faTrash, faQrcode } from '@fortawesome/free-solid-svg-icons';

export default function AttendanceAdminPage() {
  const navigate = useNavigate();
  const [participantDetails, setParticipantDetails] = useState([]);
  const [PresentTeams, setPresentTeams] = useState([]);
  const [AbsentTeams, setAbsentTeams] = useState([]);
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    const present = participantDetails.filter((team) => team.isPresent === true);
    const absent = participantDetails.filter((team) => team.isPresent === false);
    setAbsentTeams(absent);
    setPresentTeams(present);
    console.log(absent);
    console.log(present);
  }, [participantDetails]);

  // Check Admin Role
  useEffect(() => {
    const checkRole = async () => {
      const role = await localStorage.getItem('admin-role');
      if (role !== "attendanceAdmin") navigate('/admin-login');
    };
    checkRole();
  }, [navigate]);

  // Fetch Team Details
  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const token = localStorage.getItem("admin-token");
        if (!token) throw new Error("No admin token found!");

        const response = await axios.post(
          "https://think-charge-quiz-app.onrender.com/fetch-attendance",
          {},
          { headers: { "scee-event-admin-token": token } }
        );
        setParticipantDetails(response.data.reports);
      } catch (error) {
        console.error("Error fetching team details:", error);
      }
    };
    fetchTeamDetails();
  }, []);


  return (
    <>
      <nav className="master-admin-nav">
        <div className="nav-brand">
          <h1>Attendance Dashboard</h1>
          <small>Admin Portal</small>
        </div>
        <button className="logout-button" onClick={() => navigate('/admin-login')}>
          Log Out
        </button>
      </nav>

      <div className="ControlSectionAttendanceAdmin">
        <div className="ControlSectionAttendanceAdminLeft">
          <button className="RefreshButton" onClick={() => window.location.reload()}>
            Refresh <FontAwesomeIcon icon={faArrowsRotate} />
          </button>
          <button className='ResetButton'>
            Reset <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
        <button className='ScanQRButton' onClick={() => setIsScanning(true)}>
          Scan <FontAwesomeIcon icon={faQrcode} />
        </button>
      </div>

    </>
  );
}

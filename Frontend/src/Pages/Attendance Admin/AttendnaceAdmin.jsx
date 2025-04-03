/* eslint-disable no-unused-vars */
import './AttendnaceAdmin.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faTrash, faQrcode } from '@fortawesome/free-solid-svg-icons';
import QrScanner from 'qr-scanner'

export default function AttendanceAdminPage() {
  const navigate = useNavigate();
  const [participantDetails, setParticipantDetails] = useState([]);
  const [PresentTeams, setPresentTeams] = useState([]);
  const [AbsentTeams, setAbsentTeams] = useState([]);
  const [expandedTeam, setExpandedTeam] = useState(null);

  const [file,setFile]=useState(null)
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    if(!isScanning){
      setScannedData(null)
      setFile(null)
    }
  }, [isScanning])


  const handleFileChange = async (e) => {
    if (e.target.files.length > 0) {
      const imageFile = e.target.files[0];
      const imageUrl = URL.createObjectURL(imageFile);
      setFile(imageUrl); // Update the state for UI
  
      try {
        const QRresponse = await QrScanner.scanImage(imageFile, { returnDetailedScanResult: true });
        if (QRresponse) {
          console.log(QRresponse.data);
          setScannedData(QRresponse.data);
        } else {
          alert("No QR Found");
        }
      } catch (error) {
        console.error("QR Scanning Error:", error);
        alert("Unsupported image type or no QR code detected.");
      }
    }
  };
  

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
        <button className='ScanQRButton' onClick={() => setIsScanning((val)=>!val)}>
        {isScanning ? "Cancel" : <span>Scan <FontAwesomeIcon icon={faQrcode} /></span>}
        </button>
      </div>

      {isScanning? <div className="ScannerArea">
        <div className="ScanerAreaImageArea">
          {file?
          <img className='ScannerQRImage' src={file} alt="QR Image" />: <label htmlFor="qrinput" className="ScannerAreaImageAddArea">
              Click to add image
          </label>}
          <input type="file" id="qrinput" onChange={handleFileChange}/>
        </div>
        <div className="ScannerControl">
          <span className="ScannerControlMobile">
            {scannedData} 
          </span>
          <button className="ScannerControlAddButton" disabled={!file}>
            ADD
          </button>
        </div>
      </div>
      :null}

    </>
  );
}

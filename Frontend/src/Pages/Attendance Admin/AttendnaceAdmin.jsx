/* eslint-disable no-unused-vars */
import './AttendnaceAdmin.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faTrash, faQrcode,faUser } from '@fortawesome/free-solid-svg-icons';
import QrScanner from 'qr-scanner'
import Loader from '../../Components/Loader/Loader.jsx'

export default function AttendanceAdminPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [participantDetails, setParticipantDetails] = useState([]);
  const [PresentTeams, setPresentTeams] = useState([]);
  const [AbsentTeams, setAbsentTeams] = useState([]);
  const [ViewListTeamName, setViewListTeamName] = useState("")
  const [absentMembersList, setAbsentMembersList] = useState([])
  const [presentMebersList, setPresentMebersList] = useState([])
  const [isViewingTeamList, setIsViewingTeamList] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [file,setFile]=useState(null)
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [fetchedDataAfterQR, setFetchedDataAfterQR] = useState({})
  const [PresentMembers, setPresentMembers] = useState([])
  const [isAllPresent, setIsAllPresent] = useState(false)
  const [isselectingMemebrLists, setselectingMemebrLists] = useState(false)
  const [Refresh, setRefresh] = useState(false)

  const startScanner = async () => {
    try {
      setIsLoading(true);
      
      // Request camera permission first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Stop the stream immediately after getting permission
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        alert("Camera permission is required to scan QR codes. Please allow camera access and try again.");
        setIsScanning(false);
        setIsLoading(false);
        return;
      }

      const scanner = new QrScanner(
        videoRef.current,
        async (result) => {
          if (result) {
            setScannedData(result.data);
            try {
              const token = localStorage.getItem("admin-token");
              if (!token) throw new Error("No admin token found!");
              const response = await axios.get(
                `https://think-charge-quiz-app.onrender.com/fetch-team/${result.data}`,
                {
                  headers: { "scee-event-admin-token": token }
                }
              );
              if (response.status === 200) {
                setFetchedDataAfterQR(response.data);
                scanner.stop();
                setIsScanning(false);
                setselectingMemebrLists(true);
              } else {
                alert("No Teams Found!");
              }
            } catch (err) {
              console.log(err);
              if (err.status === 404) {
                setselectingMemebrLists(false);
                setIsAllPresent(false);
                setFetchedDataAfterQR({});
                setScannedData(null);
                alert("No Teams Found!");
              }
            }
          }
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
      
      await scanner.start();
      scannerRef.current = scanner;
    } catch (error) {
      console.error("QR Scanner Error:", error);
      alert("Failed to start camera. Please check camera permissions.");
    } finally {
      setIsLoading(false);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current = null;
    }
  };

  useEffect(() => {
    if (isScanning) {
      startScanner();
    } else {
      stopScanner();
      setFetchedDataAfterQR({});
    }
  }, [isScanning]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      // Add the participant to PresentMembers
      setPresentMembers((prev) => [...prev, value]);
    } else {
      // Remove the participant from PresentMembers
      setPresentMembers((prev) => prev.filter((member) => member !== value));
    }
  };

  const AddAttendance= async()=>{
    try{
      setIsLoading(true)
      const token = localStorage.getItem("admin-token");
      if (!token) throw new Error("No admin token found!");

      // Log the request payload for debugging
      const requestPayload = {
        "teamName": fetchedDataAfterQR.teamName,
        "isAllPresent": isAllPresent,
        "mobile": scannedData,
        "PresentMembers": PresentMembers
      };
      console.log("Request Payload:", requestPayload);

      const response = await axios.post(
        "https://think-charge-quiz-app.onrender.com/mark-present",
        requestPayload,
        { headers: { "scee-event-admin-token": token } }
      );
      
      console.log("Response:", response);
      
      if(response.status === 201){
        setselectingMemebrLists(false)
        setIsAllPresent(false)
        setFetchedDataAfterQR({})
        setScannedData(null)
        setIsScanning(false)
        setFile(null)
        setIsViewingTeamList(false)
        setRefresh((val)=>!val)
      }else{
        alert("Failed to Mark Attendance.");
      }
    }catch(err){
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      if (err.response?.status === 400) {
        alert("Invalid request data. Please check the team information and try again.");
      } else {
        alert("Failed to Mark Attendance or May be Attendance Already Marked. Check and Try Again!");
      }
    }finally{
      setIsLoading(false)
    }
  }
  

  useEffect(() => {
    // Sort the array based on the enteredOn field (most recent first)
    const sortedParticipants = [...participantDetails].sort((a, b) => {
      const dateA = a.enteredOn ? new Date(a.enteredOn) : new Date(0); // Handle null dates
      const dateB = b.enteredOn ? new Date(b.enteredOn) : new Date(0);
      return dateB - dateA; // Descending order
    });
  
    // Filter into present and absent teams
    const present = sortedParticipants.filter((team) => team.isPresent === true);
    const absent = sortedParticipants.filter((team) => team.isPresent === false);
  
    setAbsentTeams(absent);
    setPresentTeams(present);
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
        setIsLoading(true)
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
      }finally{
        setIsLoading(false)
      }
    };
    fetchTeamDetails();
  }, []);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setIsLoading(true)
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
      }finally{
        setIsLoading(false)
      }
    };
    fetchTeamDetails();
  }, [Refresh]);

  const DeleteAttendance = async(mobile)=>{
    try {
      setIsLoading(true)
      const token = localStorage.getItem("admin-token");
      if (!token) throw new Error("No admin token found!");

      const response = await axios.delete(
        `https://think-charge-quiz-app.onrender.com/delete-one-attendance/${mobile}`,
        {
          headers: { "scee-event-admin-token": token }
        }
      );      
      if(response.status==200){
        setRefresh((val)=>!val)
      }else{
        alert("Failed To delete")
      }
    } catch (error) {
      console.error("Error fetching team details:", error);
    }finally{
      setIsLoading(false)
    }
  }

  const ResetAttendance = async(mobile)=>{
    try {
      setIsLoading(true)
      const token = localStorage.getItem("admin-token");
      if (!token) throw new Error("No admin token found!");

      const response = await axios.delete(
        `https://think-charge-quiz-app.onrender.com/delete-all-attendance`,
        {
          headers: { "scee-event-admin-token": token }
        }
      );      
      if(response.status==200){
        setRefresh((val)=>!val)
      }else{
        alert("Failed To delete")
      }
    } catch (error) {
      console.error("Error fetching team details:", error);
    }finally{
      setIsLoading(false)
    }
  }

  function formatDate(dateString) {
    const dt = new Date(dateString);
    
    // Adjust for Indian Standard Time (IST) which is UTC+5:30
    const utc = dt.getTime() + (dt.getTimezoneOffset() * 60000);
    const ISTTime = new Date(utc);

    const hours = ISTTime.getHours();
    const minutes = ISTTime.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 === 0 ? 12 : hours % 12;
    const month = (ISTTime.getMonth() + 1).toString().padStart(2, '0');
    const day = ISTTime.getDate().toString().padStart(2, '0');
    const year = ISTTime.getFullYear().toString().slice(2);

    const formattedDate = `${hours12}:${minutes} ${ampm}, ${day}/${month}/${year}`;
    return formattedDate;
}



const TeamViewList = ()=>{
  return <div className="TeamViewOverlay" onClick={()=>{setIsViewingTeamList(false)}}>
    <div className="TeamViewListContainer" onClick={(e)=>{e.stopPropagation()}}>
      <span className='TeamViewListContainerTeamName'>{ViewListTeamName}</span>
      {presentMebersList.map((data,index)=>(
        <div className="presentMebersListViewItem" key={index}>
          <span>{data.name}</span>
          <span className='TeamViewListContainerRole'>{data.role}</span>
        </div>
      ))}

      {absentMembersList.map((data,index)=>(
        <div className="AbsentMebersListViewItem" key={index}>
          <span>{data.name}</span>
          <span className='TeamViewListContainerRole'>{data.role}</span>
        </div>
      ))}

    </div>
  </div>
}


const SelctingMemebrsList = ()=>{
  return <div className="TeamViewOverlay" onClick={()=>{setselectingMemebrLists(false)}}>
    <div className="TeamViewListContainer" onClick={(e)=>{e.stopPropagation()}}>
      <span className='TeamSelectingMembersTeamName'>{fetchedDataAfterQR?.teamName || 'Loading...'}</span>
      <span>{scannedData}</span>
      <div className='TeamSelectingMembersAllPresentChoice'>
        <span>All Present: </span>
        <input className="switch" type="checkbox" checked={isAllPresent} onChange={()=>{setIsAllPresent((val)=>!val)}}></input>
      </div>
      {isAllPresent ? null : (
        (fetchedDataAfterQR?.membersList || []).map((data,index)=>(<div key={index} className="MemebersListItem">
            <input
              className="MemebersListItemCheckBox"
              type="checkbox"
              value={data}
              onChange={handleCheckboxChange}
              checked={PresentMembers.includes(data)}
            />
            <span>{data}</span>
        </div>
        ))
      )}
      <button className='MemebersListItemDoneButton' onClick={AddAttendance}>
        Done
      </button>
    </div>
  </div>
}


  return (
    <>{isLoading && <Loader/>}
      {isViewingTeamList && <TeamViewList/>}
      {isselectingMemebrLists&& <SelctingMemebrsList/> }
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
          <button className="RefreshButton" onClick={() => setRefresh((val)=>!val)}>
            Refresh <FontAwesomeIcon icon={faArrowsRotate} />
          </button>
          <button className='ResetButton' onClick={ResetAttendance}>
            Reset <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
        <button className='ScanQRButton' onClick={() => {
          setIsScanning((val)=>!val)
          setFetchedDataAfterQR({})}}>
        {isScanning ? "Cancel" : <span>Scan <FontAwesomeIcon icon={faQrcode} /></span>}
        </button>
      </div>

      {isScanning ? (
        <div className="ScannerArea">
          <div className="ScanerAreaImageArea">
            <video ref={videoRef} className="ScannerVideo" />
          </div>
          <div className="ScannerControl">
            <span className="ScannerControlMobile">
              {scannedData}
            </span>
            <span>{fetchedDataAfterQR.teamName}</span>
          </div>
        </div>
      ) : null}

      <div className="PresentTeamsSectionArea">
        <span className="PresntTeamSectionHeader">
          Present Teams
        </span>
        {PresentTeams.length==0? <span>No Teams Found</span>: <div className="PresentTeamsListSection">
          {PresentTeams.map((data,index)=>(
            <div className="PresentTeamItem" key={index}>
              <div className="PresentTeamItemLeftPart">
                <span className={`PresentTeamItemLeftPartStatus ${data.status=="Partial Present"? "MarkStatusOrange":"MarkStatusGreen"}`}>
                    Status: {data.status}
                </span>
                <span className="PresentTeamItemLeftPartName">
                  {data.teamName}
                </span>
                <span className="PresentTeamItemLeftPartMobile">
                  {data.mobile}
                </span>
                <span className="PresentTeamItemLeftPartTime">
                  {formatDate(data.enteredOn)}
                </span>
                <span className="PresentTeamItemLeftPartSet">
                  Set Assigned: {data.SetAssigned}
                </span>
              </div>
              <div className="PresentTeamItemRightPart">
                <div className="PresentTeamItemRightPartTeamMembersGraphics">
                  {data.presentMembers.map((presentMembersItem,index)=>(
                    <FontAwesomeIcon icon={faUser} key={index} className='presentMembersIcon' />
                  ))}
                  {data.absentMembers.map((presentMembersItem,index)=>(
                    <FontAwesomeIcon icon={faUser} key={index} className='AbsentMembersIcon' />
                  ))}
                </div>
                <div className="PresentTeamItemRightPartButtonSection">
                  <button className="ViewAllButton" onClick={()=>{
                    setIsViewingTeamList(true)
                    setViewListTeamName(data.teamName)
                    setAbsentMembersList(data.absentMembers)
                    setPresentMebersList(data.presentMembers)
                    }}>
                    View Team
                  </button>
                  <button className="DeleteAttendanceForTeamButton" onClick={()=>DeleteAttendance(data.mobile)} >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div> }
      </div>


      <div className="PresentTeamsSectionArea">
        <span className="PresntTeamSectionHeader">
          Absent Teams
        </span>
        {AbsentTeams.length==0? <span>No Teams Found</span>: <div className="PresentTeamsListSection">
          {AbsentTeams.map((data,index)=>(
            <div className="PresentTeamItem" key={index}>
              <div className="PresentTeamItemLeftPart">
                <span className="PresentTeamItemLeftPartStatus MarkStatusRed">
                    Status: {data.status}
                </span>
                <span className="PresentTeamItemLeftPartName">
                  {data.teamName}
                </span>
                <span className="PresentTeamItemLeftPartMobile">
                  {data.mobile}
                </span>
              </div>
              <div className="PresentTeamItemRightPart">
                <div className="PresentTeamItemRightPartTeamMembersGraphics">
                  {data.presentMembers.map((presentMembersItem,index)=>(
                    <FontAwesomeIcon icon={faUser} key={index} className='presentMembersIcon' />
                  ))}
                  {data.absentMembers.map((presentMembersItem,index)=>(
                    <FontAwesomeIcon icon={faUser} key={index} className='AbsentMembersIcon' />
                  ))}
                </div>
                <div className="PresentTeamItemRightPartButtonSection">
                  <button className="ViewAllButton" onClick={()=>{
                  setIsViewingTeamList(true)
                  setViewListTeamName(data.teamName)
                  setPresentMebersList(data.presentMembers)
                  setAbsentMembersList(data.absentMembers)
                }}>
                    View Team
                  </button>
          
                </div>
              </div>
            </div>
          ))}
        </div> }
        </div>

    </>
  );
}

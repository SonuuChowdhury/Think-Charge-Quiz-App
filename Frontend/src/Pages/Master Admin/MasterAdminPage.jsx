/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import "./MasterAdminPage.css";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../Components/Loader/Loader.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListUl,
  faUserGroup,
  faCircleInfo,
  faKey,
  faClock,
  faTrash,
  faEye,
  faBan,
  faPen,
  faMedal,
  faQrcode,
} from "@fortawesome/free-solid-svg-icons";
import QrScanner from 'qr-scanner';

export default function MasterAdminPage() {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [isScanningQR, setIsScanningQR] = useState(false);
  const [scanError, setScanError] = useState(null);
  const [deletingTeamDetails, setDeletingTeamDetails] = useState({});
  const [deletingTeam, setDeletingTeam] = useState(false);
  const [deletingAllTeams, setDeletingAllTeams] = useState(false);
  const [viewingTeamDetails, setViewingTeamDetails] = useState({});
  const [viewingTeam, setViewingTeam] = useState(false);
  const [Refresh, setRefresh] = useState(true);
  const [isSideControlBarOpen, setisSideControlBarOpen] = useState(false);
  const [isViewingLockOpenKey, setIsViewingLockOpenKey] = useState(false);
  const [lockOpenKey, setLockOpenKey] = useState("");
  const [participantDetails, setParticipantDetails] = useState([]);
  const [isEditingQuizStartingTime, setIsEditingQuizStartingTime] = useState(false);
  const [quizStartingTime, setQuizStartingTime] = useState("");
  const [isViewingQuizStartingTime, setIsViewingQuizStartingTime] = useState(false);
  const [quizSchedule, setQuizSchedule] = useState(false);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    const checkRole = () => {
      const role = localStorage.getItem("admin-role");
      if (role !== "masterAdmin") {
        navigate("/admin-login");
      }
    };
    checkRole();
  }, [navigate]);

  useEffect(() => {
    const FetchTeamDetails = async () => {
      try {
        setisLoading(true);
        const token = localStorage.getItem("admin-token");

        if (!token) {
          console.error("No admin token found!");
          return;
        }

        const response = await axios.get(
          "https://think-charge-quiz-app.onrender.com/fetch-teams",
          {
            headers: {
              "scee-event-admin-token": token,
            },
          }
        );

        if (response.status == 200) {
          setParticipantDetails(response.data.data);
        } else {
          alert("Failed to fetch teams");
        }
      } catch (error) {
        console.error("Error fetching team details:", error);
      } finally {
        setisLoading(false);
      }
    };

    FetchTeamDetails();
  }, [Refresh]);

  function formatDate(dateString) {
    const dt = new Date(dateString);

    // Adjust for Indian Standard Time (IST) which is UTC+5:30
    const utc = dt.getTime() + dt.getTimezoneOffset() * 60000;
    const ISTTime = new Date(utc);

    const hours = ISTTime.getHours();
    const minutes = ISTTime.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 === 0 ? 12 : hours % 12;
    const month = (ISTTime.getMonth() + 1).toString().padStart(2, "0");
    const day = ISTTime.getDate().toString().padStart(2, "0");
    const year = ISTTime.getFullYear().toString().slice(2);

    const formattedDate = `${hours12}:${minutes} ${ampm}, ${day}/${month}/${year}`;
    return formattedDate;
  }

  const GetLockOpenKey = async () => {
    try {
      setisLoading(true);
      const token = localStorage.getItem("admin-token");
      if (!token) {
        console.error("No admin token found!");
        return;
      }
      const response = await axios.get(
        "https://think-charge-quiz-app.onrender.com/get-key",
        {
          headers: {
            "scee-event-admin-token": token,
          },
        }
      );
      if (response.status == 200) {
        setLockOpenKey(response.data.passCode);
      } else {
        alert("Failed to fetch teams");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setisLoading(false);
    }
  };

  const DeleteTeamHandeller = async () => {
    setisLoading(true);
    try {
      const token = localStorage.getItem("admin-token");
      if (!token) {
        console.error("No admin token found!");
        return;
      }
      const response = await axios.delete(
        `https://think-charge-quiz-app.onrender.com/delete-participants/${deletingTeamDetails.mobile}`,
        {
          headers: {
            "scee-event-admin-token": token,
          },
        }
      );
      if (response.status == 200) {
        setRefresh((val) => !val);
        setDeletingTeam(false);
      }
    } catch (err) {
      alert("Failed to delete the team");
      console.log(err);
    } finally {
      setisLoading(false);
    }
  };

  const DeleteAllTeamHandeller = async () => {
    setisLoading(true);
    try {
      const token = localStorage.getItem("admin-token");
      if (!token) {
        console.error("No admin token found!");
        return;
      }
      const response = await axios.delete(
        `https://think-charge-quiz-app.onrender.com/delete-all-teams`,
        {
          headers: {
            "scee-event-admin-token": token,
          },
        }
      );
      if (response.status == 200) {
        setRefresh((val) => !val);
        setDeletingAllTeams(false);
      }
    } catch (err) {
      alert("Failed to delete the team");
      console.log(err);
    } finally {
      setDeletingAllTeams(false);
      setisLoading(false);
    }
  };

  const DeleteActionHandeller = () => {
    return (
      <div
        className="DeleteActionHandellerBackground"
        onClick={() => {
          setDeletingTeam(false);
        }}
      >
        <div
          className="DeleteActionHandellerBox"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span className="DeleteActionHandellerBoxConfirmText">
            Confirm Delete Team
          </span>
          <span className="DeleteActionHandellerBoxConfirmTeamName">
            {deletingTeamDetails.teamName}
          </span>
          <span className="DeleteActionHandellerBoxConfirmTeamName">
            {deletingTeamDetails.mobile}
          </span>
          <div className="DeleteActionHandellerBoxConfirmButtonSection">
            <button onClick={() => setDeletingTeam(false)}>No</button>
            <button onClick={DeleteTeamHandeller}>Yes</button>
          </div>
        </div>
      </div>
    );
  };

  const DeleteAllActionHandeller = () => {
    return (
      <div
        className="DeleteActionHandellerBackground"
        onClick={() => {
          setDeletingAllTeams(false);
        }}
      >
        <div
          className="DeleteActionHandellerBox"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span className="DeleteActionHandellerBoxConfirmText">
            Confirm Delete
          </span>
          <span className="DeleteActionHandellerBoxConfirmTeamName">
            This can not be reversed
          </span>
          <div className="DeleteActionHandellerBoxConfirmButtonSection">
            <button onClick={() => setDeletingAllTeams(false)}>No</button>
            <button onClick={DeleteAllTeamHandeller}>Yes</button>
          </div>
        </div>
      </div>
    );
  };

  const LockOpenKeyComponent = () => {
    return (
      <div
        className="DeleteActionHandellerBackground"
        onClick={() => {
          setIsViewingLockOpenKey(false);
        }}
      >
        <div
          className="DeleteActionHandellerBox"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span className="DeleteActionHandellerBoxConfirmText">
            LOCK OPEN KEY
          </span>
          <span className="DeleteActionHandellerBoxConfirmTeamName">
            {lockOpenKey}
          </span>
        </div>
      </div>
    );
  };

  const SideControlBar = () => {
    return (
      <div
        className="SideControlBarMainAreaBackgorund"
        onClick={() => setisSideControlBarOpen(false)}
      >
        <div
          className={`SideControlBarMainArea ${
            isSideControlBarOpen ? "open" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="SideControlBarMainHeader">
            Master Admin Controls
          </span>
          <button className="SideControlBarMainControlOptions" onClick={() => {setIsViewingQuizStartingTime(true)
              setisSideControlBarOpen(false)
            }} >
            <FontAwesomeIcon icon={faClock} />
            View Quiz Time
          </button>
          <button className="SideControlBarMainControlOptions" onClick={() => {setIsEditingQuizStartingTime(true)
              setisSideControlBarOpen(false)
            }} >
            <FontAwesomeIcon icon={faClock} />
            Schedule Quiz
          </button>
          <button className="SideControlBarMainControlOptions">
            <FontAwesomeIcon icon={faPen} />
            Edit Quiz Questions
          </button>
          <button 
            className="SideControlBarMainControlOptions"
            onClick={() => {
              setIsScanningQR(true);
              setisSideControlBarOpen(false);
            }}
          >
            <FontAwesomeIcon icon={faQrcode} />
            Ban Team (QR)
          </button>
          <button className="SideControlBarMainControlOptions">
            <FontAwesomeIcon icon={faMedal} />
            View Results
          </button>
          <button
            className="SideControlBarMainControlOptions"
            onClick={() => {
              setIsViewingLockOpenKey(true);
              setisSideControlBarOpen(false);
              GetLockOpenKey();
            }}
          >
            <FontAwesomeIcon icon={faKey} />
            Get Open Key
          </button>
          <button
            className="SideControlBarMainControlOptionsDelete"
            onClick={() => {
              setDeletingAllTeams(true);
              setisSideControlBarOpen(false);
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
            Delete all Teams
          </button>
          <div className="SideControlBarMainControlOptionsLastCapiton">
            Think Charge. 2025
          </div>
        </div>
      </div>
    );
  };
  

  const ViewActionHandeller = () => {
    return (
      <div
        className="ViewActionHandellerBackground"
        onClick={() => setViewingTeam(false)}
      >
        <div
          className="ViewActionHandellerBox"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="team-title">{viewingTeamDetails.teamName}</h2>
          <div className="members-list">
            {viewingTeamDetails.members.map((member) => (
              <div className="member-card" key={member._id}>
                <div className="member-header">
                  <span className="member-name">{member.name}</span>
                  <span className={`member-role ${member.role.toLowerCase()}`}>
                    {member.role}
                  </span>
                </div>
                <div className="member-details">
                  <span>{member.department}</span>
                  <span>Sem: {member.sem}</span>
                  <span>{member.gender}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };


  const QuizScheduleHandeller = () => {
    const [selectedHour, setSelectedHour] = useState('00');
    const [selectedMinute, setSelectedMinute] = useState('00');
    const [selectedPeriod, setSelectedPeriod] = useState('AM');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
    const periods = ['AM', 'PM'];

    const handleTimeChange = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const hour = parseInt(selectedHour);
        const adjustedHour = selectedPeriod === 'PM' && hour !== 12 ? hour + 12 : 
                            selectedPeriod === 'AM' && hour === 12 ? 0 : hour;
        const formattedHour = String(adjustedHour).padStart(2, '0');
        
        // Create a date object for the selected time
        const selectedDate = new Date();
        selectedDate.setHours(adjustedHour);
        selectedDate.setMinutes(parseInt(selectedMinute));
        selectedDate.setSeconds(0);
        selectedDate.setMilliseconds(0);

        const token = localStorage.getItem("admin-token");
        if (!token) {
          throw new Error("No admin token found!");
        }

        const response = await axios.post(
          "https://think-charge-quiz-app.onrender.com/edit-start-time",
          {
            time: selectedDate.toISOString(),
            setNow: false
          },
          {
            headers: {
              "scee-event-admin-token": token,
            },
          }
        );

        if (response.status === 200) {
          setQuizStartingTime(`${formattedHour}:${selectedMinute}`);
          setIsEditingQuizStartingTime(false);
        } else {
          throw new Error(response.data.msg || 'Failed to update quiz time');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const handleSetNow = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("admin-token");
        if (!token) {
          throw new Error("No admin token found!");
        }

        const response = await axios.post(
          "https://think-charge-quiz-app.onrender.com/edit-start-time",
          {
            setNow: true
          },
          {
            headers: {
              "scee-event-admin-token": token,
            },
          }
        );

        if (response.status === 200) {
          // Update the local state with the new time
          const newTime = new Date(response.data.StartQuizOn);
          const hours = String(newTime.getHours()).padStart(2, '0');
          const minutes = String(newTime.getMinutes()).padStart(2, '0');
          setQuizStartingTime(`${hours}:${minutes}`);
          setIsEditingQuizStartingTime(false);
        } else {
          throw new Error(response.data.msg || 'Failed to update quiz time');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    return (
      <div
        className="ViewActionHandellerBackground"
        onClick={() => setIsEditingQuizStartingTime(false)}
      >
        <div
          className="ViewActionHandellerBox quiz-schedule-box"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="quiz-schedule-title">Set Quiz Starting Time</h2>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="time-picker-container">
            <div className="time-column">
              <div className="time-scroll hours">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className={`time-option ${selectedHour === hour ? 'selected' : ''}`}
                    onClick={() => setSelectedHour(hour)}
                  >
                    {hour}
                  </div>
                ))}
              </div>
              <span className="time-label">Hours</span>
            </div>

            <div className="time-separator">:</div>

            <div className="time-column">
              <div className="time-scroll minutes">
                {minutes.map((minute) => (
                  <div
                    key={minute}
                    className={`time-option ${selectedMinute === minute ? 'selected' : ''}`}
                    onClick={() => setSelectedMinute(minute)}
                  >
                    {minute}
                  </div>
                ))}
              </div>
              <span className="time-label">Minutes</span>
            </div>

            <div className="time-column">
              <div className="time-scroll period">
                {periods.map((period) => (
                  <div
                    key={period}
                    className={`time-option ${selectedPeriod === period ? 'selected' : ''}`}
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {period}
                  </div>
                ))}
              </div>
              <span className="time-label">Period</span>
            </div>
          </div>

          <div className="quiz-schedule-actions">
            <button 
              className="set-now-button"
              onClick={handleSetNow}
              disabled={isLoading}
            >
              Set Now
            </button>
            <button 
              className="cancel-button"
              onClick={() => setIsEditingQuizStartingTime(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              className="update-button"
              onClick={handleTimeChange}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    );
  };


  const ViewQuizStartingTimeHandeller = () => {
    const [quizTime, setQuizTime] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchQuizTime = async () => {
        try {
          setIsLoading(true);
          setError(null);
          
          const token = localStorage.getItem("admin-token");
          if (!token) {
            throw new Error("No admin token found!");
          }

          const response = await axios.get(
            "https://think-charge-quiz-app.onrender.com/get-start-time",
            {
              headers: {
                "scee-event-admin-token": token,
              },
            }
          );

          if (response.status === 200) {
            setQuizTime(new Date(response.data.StartQuizOn));
          } else {
            throw new Error(response.data.msg || 'Failed to fetch quiz time');
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchQuizTime();
    }, []);

    const formatTime = (date) => {
      if (!date) return '';
      
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours % 12 === 0 ? 12 : hours % 12;
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      return `${hours12}:${minutes} ${ampm}, ${day}/${month}/${year}`;
    };

    return (
      <div 
        className="ViewActionHandellerBackground"
        onClick={() => setIsViewingQuizStartingTime(false)}
      >
        <div 
          className="ViewActionHandellerBox quiz-time-box"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="quiz-time-title">Quiz Starting Time</h2>
          
          {isLoading ? (
            <div className="quiz-time-loading">Loading...</div>
          ) : error ? (
            <div className="quiz-time-error">{error}</div>
          ) : quizTime ? (
            <div className="quiz-time-value">{formatTime(quizTime)}</div>
          ) : (
            <div className="quiz-time-not-set">No quiz time set</div>
          )}

          <div className="quiz-time-actions">
            <button 
              className="close-button"
              onClick={() => setIsViewingQuizStartingTime(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleQRCodeScan = async (qrData) => {
    try {
      setisLoading(true);
      setScanError(null);

      const mobileNumber = qrData;

      const token = localStorage.getItem("admin-token");
      if (!token) {
        throw new Error("No admin token found!");
      }

      const response = await axios.post(
        `https://think-charge-quiz-app.onrender.com/ban-team/${mobileNumber}`,
        {},
        {
          headers: {
            "scee-event-admin-token": token,
          },
        }
      );

      if (response.status === 200) {
        alert(`Team with mobile number ${mobileNumber} has been banned successfully`);
        stopScanner();
        setIsScanningQR(false);
      } else {
        throw new Error(response.data.msg || 'Failed to ban team');
      }
    } catch (err) {
      setScanError(err.message);
      alert(err.message);
    } finally {
      setisLoading(false);
      setRefresh((val) => !val); // Refresh the team list
    }
  };

  const startScanner = async () => {
    try {
      const videoElement = videoRef.current;
      if (!videoElement) {
        console.log("Video element not found");
        return;
      }

      // Stop any existing scanner
      if (scannerRef.current) {
        await scannerRef.current.stop();
        scannerRef.current = null;
      }

      // Create new scanner instance
      scannerRef.current = new QrScanner(
        videoElement,
        (result) => {
          if (result) {
            handleQRCodeScan(result.data);
          }
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          returnDetailedScanResult: true,
          preferredCamera: 'environment',
        }
      );

      // Start the scanner
      await scannerRef.current.start();
      console.log("Scanner started successfully");
    } catch (err) {
      console.error("Detailed scanner error:", err);
      setScanError("Failed to start camera. Please check camera permissions.");
      // Don't close the popup on error, let user try again
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current = null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeScanner = async () => {
      if (isScanningQR && mounted) {
        try {
          await startScanner();
        } catch (err) {
          console.error("Scanner initialization error:", err);
          if (mounted) {
            setScanError("Failed to initialize camera. Please try again.");
          }
        }
      }
    };

    initializeScanner();

    return () => {
      mounted = false;
      stopScanner();
    };
  }, [isScanningQR]);

  const QRScannerComponent = () => {
    return (
      <div
        className="ViewActionHandellerBackground"
        onClick={(e) => {
          // Only close if clicking the background, not the content
          if (e.target === e.currentTarget) {
            stopScanner();
            setIsScanningQR(false)
            setRefresh((val) => !val); // Refresh the team list
          }
        }}
      >
        <div
          className="ViewActionHandellerBox qr-scanner-box"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="qr-scanner-title">Scan QR Code to Ban Team</h2>
          
          {scanError && (
            <div className="error-message">
              {scanError}
              <button 
                className="retry-button"
                onClick={() => {
                  setScanError(null);
                  startScanner();
                }}
              >
                Retry
              </button>
            </div>
          )}

          <div className="qr-scanner-video-container">
            <video 
              ref={videoRef} 
              className="qr-scanner-video"
              style={{ width: '100%', height: '100%' }}
            ></video>
          </div>

          <div className="qr-scanner-actions">
            <button 
              className="close-button"
              onClick={()=>{stopScanner
                setIsScanningQR(false)
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const BanTag = () => (
    <div className="ban-tag">
      <FontAwesomeIcon icon={faBan} />
      <span>BANNED</span>
    </div>
  );

  return (
    <>
      {isLoading && <Loader />}
      {isScanningQR && <QRScannerComponent />}
      {isViewingQuizStartingTime && <ViewQuizStartingTimeHandeller />}
      {isEditingQuizStartingTime && <QuizScheduleHandeller />}
      {deletingAllTeams && <DeleteAllActionHandeller />}
      {isSideControlBarOpen && <SideControlBar />}
      {viewingTeam && <ViewActionHandeller />}
      {deletingTeam && <DeleteActionHandeller />}
      {isViewingLockOpenKey && <LockOpenKeyComponent />}
      <nav className="master-admin-nav">
        <div className="nav-brand">
          <h1>Master Dashboard</h1>
          <small>Admin Portal</small>
        </div>
        <button
          className="logout-button"
          onClick={() => navigate("/admin-login")}
        >
          Log Out
        </button>
      </nav>

      <div className="MasterAdminCOntrolButtonSection">
        <span className="MasterAddTeamButtonPrimary">
          <button
            onClick={() => navigate("/master-admin/add-team")}
            className="MasterAddTeamButton"
          >
            Add Teams <FontAwesomeIcon icon={faUserGroup} />
          </button>
          <FontAwesomeIcon
            title="Upload the team details in the desired format to read and upload and the team details to server"
            className="MasterAdminCOntrolButtonSectionInfoButton"
            onClick={() => {
              alert(
                "Upload the excel file with details in desired format... Click the ADD TEAM button to know more."
              );
            }}
            icon={faCircleInfo}
          />
        </span>
        <span
          className="MasterMoreControlsBurgerIconSection"
          onClick={() => setisSideControlBarOpen(true)}
        >
          <FontAwesomeIcon icon={faListUl} />
        </span>
      </div>

      <div className="MasterTeamListSectionArea">
        <span className="MasterTeamListSectionAreaHeader">Teams</span>

        <div className="MasterTeamListSection">
          {participantDetails.length == 0 && (
            <span className="NoTeamsFoundText">No Teams Found</span>
          )}
          {participantDetails.map((data, index) => (
            <div className={`MasterTeamListSectionItem ${data.isBanned ? 'banned' : ''}`} key={index}>
              <div className="MasterTeamListSectionItemMataDetailsSection">
                <div className="team-name-container">
                  <span className="MasterTeamListSectionItemTeamName">
                    {data.teamName}
                  </span>
                  {data.isBanned && <BanTag />}
                </div>
                <span>{data.mobile}</span>
                <span>{data.email ? data.email : "No Email"}</span>
              </div>

              <div className="MasterTeamListSectionItemLoginDetailsAndControlSection">
                <span className="MasterTeamListSectionItemLoginDetailsAndControlSectionDates">
                  <span>Joined: </span>
                  <span className="MasterTeamListSectionItemLoginDetailsAndControlSectionDates">
                    {formatDate(data.joined) || "No Data"}
                  </span>
                  <span>Last LogIn: </span>
                  <span className="MasterTeamListSectionItemLoginDetailsAndControlSectionDates">
                    {formatDate(data.LastLogin) || "No Data"}
                  </span>
                </span>
                <div className="MasterTeamListSectionItemLoginDetailsAndControlSectionButtonSection">
                  <button
                    className="viewButton"
                    onClick={() => {
                      setViewingTeamDetails({
                        teamName: data.teamName,
                        members: data.teamMembers,
                      });
                      setViewingTeam(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faEye} />
                    View
                  </button>
                  <button
                    className="deleteButton"
                    onClick={() => {
                      setDeletingTeamDetails({
                        teamName: data.teamName,
                        mobile: data.mobile,
                      });
                      setDeletingTeam(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

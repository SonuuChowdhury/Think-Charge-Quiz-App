import './SetQuizTime.css';

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faClock, faUsers } from "@fortawesome/free-solid-svg-icons";

const SetQuizTime = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [saving, setSaving] = useState(false);

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
    fetchGroupsInfo();
  }, []);

  const fetchGroupsInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("admin-token");

      if (!token) {
        console.error("No admin token found!");
        return;
      }

      const response = await axios.get(
        "https://think-charge-quiz-app.onrender.com/fetch-groups-info",
        {
          headers: {
            "scee-event-admin-token": token,
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        setGroups(response.data.groups);
      } else {
        setError("Failed to fetch groups info");
      }
    } catch (error) {
      console.error("Error fetching groups info:", error);
      setError("Failed to fetch groups info");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return { time: null, date: null };
    const [date, time] = dateTimeString.split("T");
    return {
      time: time ? time.slice(0, 5) : null, // "14:30"
      date: date ? date.split("-").reverse().join("/") : null // "10/06/2024"
    };
  };

  const handleEditTime = (idx) => {
    setEditIndex(idx);
    const group = groups[idx];
    if (group.startTime) {
      // Set the date and time exactly as they come (no conversion)
      const [datePart, timePart] = group.startTime.split("T");
      setEditDate(datePart || "");
      setEditTime(timePart ? timePart.slice(0,5) : "");
    } else {
      setEditDate("");
      setEditTime("");
    }
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditDate("");
    setEditTime("");
  };

  const handleSave = async (groupName) => {
    if (!editDate || !editTime) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("admin-token");
      if (!token) throw new Error("No admin token found!");
      const isoString = `${editDate}T${editTime}`; // Store as local ISO string
      const response = await axios.post(
        "https://think-charge-quiz-app.onrender.com/edit-start-time",
        {
          groupName,
          startTime: isoString,
        },
        {
          headers: {
            "scee-event-admin-token": token,
          },
        }
      );
      if (response.status === 200 && response.data.success) {
        const updatedGroups = [...groups];
        updatedGroups[editIndex].startTime = isoString;
        setGroups(updatedGroups);
        handleCancel();
      } else {
        alert("Failed to update quiz time");
      }
    } catch (err) {
      alert("Failed to update quiz time");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="set-quiz-time-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="set-quiz-time-page">
      <nav className="master-admin-nav">
        <div className="nav-brand">
          <h1>Schedule Quiz</h1>
          <small>Master Admin Portal</small>
        </div>
        <button
          className="logout-button"
          onClick={() => navigate("/master-admin")}
        >
          Dashboard
        </button>
      </nav>

      <div className="content-container">
        <div className="header-section">
          <h2>Quiz Schedule Management</h2>
          <p>Manage quiz times for different groups</p>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchGroupsInfo} className="retry-button">
              Retry
            </button>
          </div>
        )}

        <div className="groups-grid">
          {groups.map((group, index) => (
            <div key={index} className="group-card">
              <div className="group-header">
                <h3 className="group-name">{group.groupName}</h3>
                <div className="group-stats">
                  <div className="stat-item">
                    <FontAwesomeIcon icon={faUsers} className="stat-icon" />
                    <span>{group.teamCount} Teams</span>
                  </div>
                </div>
              </div>
              
              <div className="group-time">
                <div className="time-display">
                  <FontAwesomeIcon icon={faClock} className="time-icon" />
                  <div className="time-info">
                    {editIndex === index ? (
                      <>
                        <input
                          type="date"
                          value={editDate}
                          onChange={e => setEditDate(e.target.value)}
                          className="edit-date-input"
                        />
                        <input
                          type="time"
                          value={editTime}
                          onChange={e => setEditTime(e.target.value)}
                          className="edit-time-input"
                        />
                      </>
                    ) : (
                      formatTime(group.startTime).time == null ? (
                        <span className="time-not-set-text">Not set</span>
                      ) : (
                        <>
                          <span className="time-text">
                            {formatTime(group.startTime).time}
                          </span>
                          <span className="date-text">
                            {formatTime(group.startTime).date}
                          </span>
                        </>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="group-actions">
                {editIndex === index ? (
                  <>
                    <button className="cancel-button" onClick={handleCancel} disabled={saving}>Cancel</button>
                    <button className="save-button" onClick={() => handleSave(group.groupName)} disabled={saving || !editDate || !editTime}>
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </>
                ) : (
                  <button
                    className="edit-button"
                    onClick={() => handleEditTime(index)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Edit Time
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {groups.length === 0 && !isLoading && !error && (
          <div className="empty-state">
            <p>No groups found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetQuizTime;

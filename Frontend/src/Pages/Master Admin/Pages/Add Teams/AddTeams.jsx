/* eslint-disable no-unused-vars */
// AddTeams.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./AddTeams.css";
import { useEffect } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const roleColors = {
  Leader: "badge-leader",
  member: "badge-default",
};

function getRoleColor(role) {
  return roleColors[role] || roleColors.member;
}

export default function AddTeams() {
  const [teams, setTeams] = useState([]);
  const [percentage, setpercentage] = useState(0)
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expanded, setExpanded] = useState({});
  const [teamStatusArray, setTeamStatusArray] = useState([]);
  const [updating, setUpdating] = useState(false); // your condition
  const navigate = useNavigate();

  const updatingRef = useRef(updating);

  // Keep the ref in sync with the latest state
  useEffect(() => {
    updatingRef.current = updating;
  }, [updating]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (updatingRef.current) {
        e.preventDefault();
        e.returnValue = ''; // Chrome-specific
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []); // Listener added only once

  const handleFile = (e) => {
    setError("");
    setSuccess("");
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split(".").pop();
    if (ext !== "xls" && ext !== "xlsx") {
      setError("Invalid file format. Please upload .xls or .xlsx file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      const formattedTeams = transformTeams(jsonData);
  
      // Use mobile number as the unique identifier
      const statusArr = formattedTeams.map((team) => ({
        number: team.mobile, // Use mobile as unique key
        status: "Pending",
        msg:"Still to be Updated..."
      }));
  
      setTeams(formattedTeams);
      setTeamStatusArray(statusArr);
      setSuccess("File uploaded and parsed successfully!");
    };
    reader.readAsArrayBuffer(file);
  };
  

  function transformTeams(rows) {
    const teamsArr = [];
    rows.forEach((row) => {
      for (let i = 1; i <= 2; i++) {
        if (row[`Team${i}_Name`]) {
          const members = [];
          for (let m = 1; m <= 4; m++) {
            if (row[`Team${i}_Member${m}_Name`]) {
              members.push({
                name: row[`Team${i}_Member${m}_Name`],
                department: row[`Team${i}_Member${m}_Department`],
                sem: row[`Team${i}_Member${m}_Sem`],
                gender: row[`Team${i}_Member${m}_Gender`],
                role: row[`Team${i}_Member${m}_Role`],
              });
            }
          }
          teamsArr.push({
            teamName: row[`Team${i}_Name`],
            email: row[`Team${i}_Email`],
            mobile: row[`Team${i}_Mobile`],
            teamMembers: members,
          });
        }
      }
    });
    return teamsArr;
  }

  const toggleExpand = (idx) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // FINAL HandleUpdate function
  const HandleUpdate = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("admin-token");
      if (!token) throw new Error("Admin authentication required");

      // Create mobile->team map for efficient lookup
      const teamMap = new Map(teams.map((team) => [team.mobile, team]));

      // Get all pending entries with their indices
      const pendingEntries = teamStatusArray
        .map((entry, idx) => ({ ...entry, idx }))
        .filter((entry) => entry.status === "Pending");

      if (pendingEntries.length === 0) {
        setUpdating(false);
        return;
      }

      // Set all pending statuses to "Updating"
      setTeamStatusArray((prev) =>
        prev.map((entry) =>
          entry.status === "Pending"
            ? { ...entry, status: "Updating", msg: "Processing..." }
            : entry
        )
      );

      let processedCount = 0;

      await Promise.all(
        pendingEntries.map(async ({ number, idx }) => {
          const team = teamMap.get(number);
          if (!team) {
            setTeamStatusArray((prev) => {
              const arr = [...prev];
              arr[idx] = {
                ...arr[idx],
                status: "Error",
                msg: "No matching team data found",
              };
              return arr;
            });
            console.log(`No matching team for mobile: ${number}`);
          } else {
            try {
              const response = await axios.post(
                "https://think-charge-quiz-app.onrender.com/add-participant",
                team,
                { headers: { "scee-event-admin-token": token } }
              );
              setTeamStatusArray((prev) => {
                const arr = [...prev];
                arr[idx] = {
                  ...arr[idx],
                  status: response.status === 201 ? "Added" : "Error",
                  msg:
                    response.data?.msg ||
                    (response.status === 201 ? "Success" : "Unknown error"),
                };
                return arr;
              });
            } catch (error) {
              setTeamStatusArray((prev) => {
                const arr = [...prev];
                arr[idx] = {
                  ...arr[idx],
                  status: "Error",
                  msg:
                    error.response?.data?.msg ||
                    error.message ||
                    "Request failed",
                };
                return arr;
              });
            }
          }
          processedCount += 1;
          setpercentage(
            Math.round((processedCount / pendingEntries.length) * 100)
          );
        })
      );
    } catch (error) {
      console.error("System error:", error);
    } finally {
      setUpdating(false);
    }
  };
  
  
  

  return (
    <div className="addteams-root">
      {/* Header */}
      <nav className="master-admin-nav">
        <div className="nav-brand">
          <h1>Master Dashboard</h1>
          <small>Admin Portal</small>
        </div>
        <button
          className="logout-button"
          onClick={() => navigate("/master-admin")}
        >
          Dashboard
        </button>
      </nav>

      {/* File Upload */}
      <div className="addteams-upload-row">
        {teams.length==0&& <>
        <input
        type="file"
        accept=".xls,.xlsx"
        id="addteams-file-input"
        onChange={handleFile}
        style={{ display: "none" }}
      />
      <label
        htmlFor="addteams-file-input"
        className="addteams-dashboard-btn"
        style={{ cursor: "pointer" }}
      >
        Upload Excel File
      </label>
      <button onClick={() => navigate("/master-admin/add-team/file-format-info")} className="ViewFormatExcelFileButton">View Format</button>
      </>
        }
        {success && <span className="addteams-success">Data Extracted Succesfully</span>}
        {error && <span className="addteams-error">{error}</span>}
      </div>

      {/* Teams Display */}
      {teams.length === 0 && (
        <div className="addteams-empty">
          No teams to display. Please upload a file.
        </div>
      )}

      {teams.length!=0 && <div className="UpdateButtonAndStatusBarArea">
        <button className="UpdateButtonAddTeamsScection" disabled={updating} onClick={HandleUpdate}>{updating? "Updating..": "Update"}</button>
        <div className="progress-container">
      <div className="progress-header">
        <span>Task Progress</span>
        <span className="percentage-value">{percentage}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
      </div> }

      <div className="addteams-grid">
        {teams.map((team, idx) => {
          const statusObj = teamStatusArray.find(item => item.number === team.mobile) || { status: "Pending" };
          const status = statusObj.status;
          const msg= statusObj.msg;

          return (
            <div key={idx} className="addteams-team-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                <div>
                  <h2 className="addteams-team-name">{team.teamName}</h2>
                  <div className="addteams-team-info">
                    <span>
                      Email: <span className="addteams-bold">{team.email}</span>
                    </span>
                    <span>
                      Mobile:{" "}
                      <span className="addteams-bold">{team.mobile}</span>
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginLeft: "16px",
                    minWidth: "100px",
                    justifyContent: "flex-end",
                  }}
                >
                  <div
                    className={`addteams-status-ring ${status.toLowerCase()}`}
                  />
                  <div className="TeamUpdateStatusArea">
                    <span className="addteams-status-text">{status}</span>
                    <button className="TeamUpdateStatusMsg" onClick={()=>{alert(msg)}}>View</button>
                  </div>
                </div>
              </div>
              <button
                className="addteams-accordion-toggle"
                onClick={() => toggleExpand(idx)}
                aria-expanded={!!expanded[idx]}
                aria-controls={`members-${idx}`}
              >
                {expanded[idx] ? "Hide Members ▲" : "Show Members ▼"}
              </button>
              <div
                id={`members-${idx}`}
                className={`addteams-members-section${
                  expanded[idx] ? " expanded" : ""
                }`}
              >
                <div className="addteams-members-grid">
                  {team.teamMembers.map((member, mIdx) => (
                    <div key={mIdx} className="addteams-member-card">
                      <div className="addteams-member-header">
                        <span className="addteams-member-name">
                          {member.name}
                        </span>
                        <span
                          className={`addteams-badge ${getRoleColor(
                            member.role
                          )}`}
                        >
                          {member.role}
                        </span>
                      </div>
                      <span className="addteams-member-detail">
                        {member.department} | Sem {member.sem}
                      </span>
                      <span className="addteams-member-detail">
                        {member.gender}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

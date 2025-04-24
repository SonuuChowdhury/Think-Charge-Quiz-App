/* eslint-disable no-unused-vars */
// AddTeams.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./AddTeams.css";
import { useNavigate } from "react-router-dom";

const roleColors = {
  Leader: "badge-leader",
  member: "badge-default",
};

function getRoleColor(role) {
  return roleColors[role] || roleColors.member;
}

export default function AddTeams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expanded, setExpanded] = useState({});
  const [teamStatusArray, setTeamStatusArray] = useState([]);

  const navigate = useNavigate();

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

      // Create status array: [{ number: 1, status: "Pending" }, ...]
      const statusArr = formattedTeams.map((team, idx) => ({
        number: idx + 1, // or use a unique identifier if available
        status: "Pending",
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
        {success && <span className="addteams-success">{success}</span>}
        {error && <span className="addteams-error">{error}</span>}
      </div>

      {/* Teams Display */}
      {teams.length === 0 && (
        <div className="addteams-empty">
          No teams to display. Please upload a file.
        </div>
      )}
      <div className="addteams-grid">
      {teams.map((team, idx) => {
  const statusObj = teamStatusArray[idx] || { status: "Pending" }; // fallback if missing
  const status = statusObj.status;

  return (
    <div key={idx} className="addteams-team-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
        <div>
          <h2 className="addteams-team-name">{team.teamName}</h2>
          <div className="addteams-team-info">
            <span>Email: <span className="addteams-bold">{team.email}</span></span>
            <span>Mobile: <span className="addteams-bold">{team.mobile}</span></span>
          </div>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginLeft: '16px',
          minWidth: '100px',
          justifyContent: 'flex-end'
        }}>
          <div className={`addteams-status-ring ${status.toLowerCase()}`} />
          <span className="addteams-status-text">{status}</span>
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
        className={`addteams-members-section${expanded[idx] ? " expanded" : ""}`}
      >
        <div className="addteams-members-grid">
          {team.teamMembers.map((member, mIdx) => (
            <div key={mIdx} className="addteams-member-card">
              <div className="addteams-member-header">
                <span className="addteams-member-name">{member.name}</span>
                <span className={`addteams-badge ${getRoleColor(member.role)}`}>
                  {member.role}
                </span>
              </div>
              <span className="addteams-member-detail">{member.department} | Sem {member.sem}</span>
              <span className="addteams-member-detail">{member.gender}</span>
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

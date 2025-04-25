import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FileFormatInfo.css';

const FileFormatInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="file-format-container">
      <div className="file-format-card">
        <h1 className="file-format-title">Hackathon Team File Format Guide</h1>

        <p className="file-format-subtitle">
          Please ensure your Excel file follows the exact structure shown below. Each row represents one team.
        </p>

        <div className="file-format-table-wrapper">
          <table className="file-format-table">
            <thead>
              <tr>
                <th>Column Name</th>
                <th>Description</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Team1_Name", "Team name", "Tech Titans 1"],
                ["Team1_Email", "Team email (one per team)", "techtitans1@example.com"],
                ["Team1_Mobile", "Team contact mobile (unique)", "9123412345"],
                ["Team1_Member1_Name", "First member's full name", "Aarav"],
                ["Team1_Member1_Department", "Department (CSE, ECE, etc.)", "CSE"],
                ["Team1_Member1_Sem", "Semester (1-8)", "5"],
                ["Team1_Member1_Gender", "Gender (Male/Female)", "Male"],
                ["Team1_Member1_Role", "Role (Leader/Member)", "Leader"],
                ["Team1_Member2_Name", "Second member's name", "Diya"],
                ["Team1_Member2_Department", "Department", "IT"],
                ["Team1_Member2_Sem", "Semester", "6"],
                ["Team1_Member2_Gender", "Gender", "Female"],
                ["Team1_Member2_Role", "Role", "Member"],
                ["Team1_Member3_Name", "Third member's name", "Kiara"],
                ["Team1_Member3_Department", "Department", "MECH"],
                ["Team1_Member3_Sem", "Semester", "3"],
                ["Team1_Member3_Gender", "Gender", "Female"],
                ["Team1_Member3_Role", "Role", "Member"],
                ["Team1_Member4_Name", "Fourth member's name (optional)", "Ishaan"],
                ["Team1_Member4_Department", "Department (optional)", "ECE"],
                ["Team1_Member4_Sem", "Semester (optional)", "7"],
                ["Team1_Member4_Gender", "Gender (optional)", "Male"],
                ["Team1_Member4_Role", "Role (optional)", "Member"]
              ].map(([col, desc, example], idx) => (
                <tr key={idx}>
                  <td>{col}</td>
                  <td>{desc}</td>
                  <td>{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="file-format-notes">
          <li>Each row should represent one complete team.</li>
          <li>Make sure all mobile numbers are <strong>unique</strong>.</li>
          <li>If a team has fewer than 4 members, leave the extra member fields blank.</li>
          <li>Use proper formatting. Avoid merged cells or formulas.</li>
          <li>File must be in <strong>.xlsx (Excel)</strong> format.</li>
        </ul>

        <div className="file-format-button-wrapper">
          <button onClick={() => navigate('/master-admin/add-team')} className="file-format-back-btn">
            ← Back to Add Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileFormatInfo;

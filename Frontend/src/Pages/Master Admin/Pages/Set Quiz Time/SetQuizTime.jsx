import './SetQuizTime.css';

import React from "react";
import { useNavigate } from "react-router-dom";

const SetQuizTime = () => {
  const navigate = useNavigate();

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

      


    </div>
  );
};

export default SetQuizTime;

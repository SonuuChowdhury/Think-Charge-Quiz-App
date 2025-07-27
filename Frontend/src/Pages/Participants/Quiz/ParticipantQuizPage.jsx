/* eslint-disable no-unused-vars */
import "../Instructions/ParticipantInstructionPage.css";
import "./ParticipantQuizPage.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import axios from "axios";
import Loader from "../../../Components/Loader/Loader";
import { useLocation } from "react-router-dom";

export default function ParticipantQuizPage() {
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [startTime, setStartTime] = useState(
    localStorage.getItem("groupStartTime")?.replace("Z", "") || null
  );
  const [groupName, setGroupName] = useState(() => {
    const data = JSON.parse(localStorage.getItem("participantData") || "{}");
    return data.groupName || "-";
  });
  const [teamName, setTeamName] = useState(() => {
    const data = JSON.parse(localStorage.getItem("participantData") || "{}");
    return data.teamName || "-";
  });
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [timer, setTimer] = useState("00:00");
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isFetchingHint, setIsFetchingHint] = useState(false);
  const [hint, setHint] = useState("");
  const [showHintDialog, setShowHintDialog] = useState(false);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const Dtoken = decodeURIComponent(query.get("Dtoken") || "");
  const Ptoken = decodeURIComponent(query.get("Ptoken") || "");

  // Logout logic
  const handleLogout = () => setShowLogoutDialog(true);
  const confirmLogout = () => {
    localStorage.removeItem("participant-token");
    localStorage.removeItem("isAttendanceMarked");
    localStorage.removeItem("groupStartTime");
    localStorage.removeItem("participantData");
    localStorage.removeItem("attendanceDetails");
    navigate("/");
  };

  useEffect(() => {
    if (!Dtoken || !Ptoken) {
      localStorage.removeItem("participant-token");
      localStorage.removeItem("isAttendanceMarked");
      localStorage.removeItem("groupStartTime");
      localStorage.removeItem("participantData");
      localStorage.removeItem("attendanceDetails");
      navigate("/");
    }
  });

  // Timer logic
  useEffect(() => {
    if (!startTime) return;
    const start = new Date(startTime);
    const end = new Date(start.getTime() + 60 * 60000); // 1 hour after startTime
    const updateTimer = () => {
      const now = new Date();
      if (now < start) {
        setTimer("00:00");
        return;
      }
      const diff = end - now;
      if (diff > 0) {
        const mins = String(Math.floor(diff / 60000)).padStart(2, "0");
        const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
        setTimer(`${mins}:${secs}`);
      } else {
        setTimer("00:00");
        setIsQuizCompleted(true);
      }
    };
    updateTimer();

    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  // Start Quiz logic (navigate or trigger quiz start)
  const FetchQuestion = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://think-charge-quiz-app.onrender.com/get-next-question",
        {
          headers: {
            "participant-token": Ptoken,
            "participant-details-token": Dtoken,
          },
        }
      );

      if (response.status === 200) {
        const Question = response.data.question[0];
        setQuestion(Question);
      } else if (
        response.status === 404 ||
        response.status === 403 ||
        response.status === 400
      ) {
        alert(response.data.message);
      } else {
        alert(
          response.data.message ||
            "Failed to start the quiz. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error fetching the quiz Question", error);
      alert("Failed to Fetch The quiz question.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update FetchHints to set hint and isFetchingHint
  const FetchHints = async () => {
    setIsFetchingHint(true);
    try {
      const response = await axios.get(
        "https://think-charge-quiz-app.onrender.com/get-hint",
        {
          headers: {
            "participant-token": Ptoken,
            "participant-details-token": Dtoken,
          },
        }
      );
      if (response.status === 200) {
        setHint(response.data?.hint || "");
        console.log(response)
        setBatteryLevel(Number(response.data?.battery) || batteryLevel);
      } else if (
        response.status === 404 ||
        response.status === 403 ||
        response.status === 400
      ) {
        alert(response.data.message);
      } else {
        alert(
          response.data.message ||
            "Failed to Fetch the quiz hint. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error fetching the quiz Hint", error);
      alert("Failed to Fetch The quiz Hint.");
    } finally {
      setIsFetchingHint(false);
      setShowHintDialog(false);
    }
  };

  useEffect(() => {
    FetchQuestion();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <nav className="participant-instruction-navbar">
        <div className="participant-instruction-navbar-left">
          <FaUsers className="participant-instruction-group-logo" />
          <div className="participant-instruction-group-info">
            <span className="participant-instruction-group-label">Group</span>
            <span className="participant-instruction-group-name">
              {groupName}
            </span>
            <span className="participant-instruction-team-name">
              {teamName}
            </span>
          </div>
        </div>
        <button
          className="participant-instruction-logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>
      <div className="participantQuiz-main-container">
        {/* Left: Question Area */}
        <div className="participantQuiz-question-area">
          <div className="participantQuiz-question-header">
            <div className="participantQuiz-question-header-row">
              <div className="participantQuiz-round-type-row">
                <div className="participantQuiz-round-box">
                  <span className="participantQuiz-round-label">
                    Round Number
                  </span>
                  <span className="participantQuiz-round-value">
                    {question?.roundNumber || "-"}
                  </span>
                </div>
                <div className="participantQuiz-type-box">
                  <span className="participantQuiz-type-label">
                    Question Type
                  </span>
                  <span className="participantQuiz-type-value">
                    {question?.questionType || "-"}
                  </span>
                </div>
              </div>
              <div className="participantQuiz-rounds-progress">
                <div className="participantQuiz-rounds-progress-indicators participantQuiz-rounds-progress-inline">
                  {[1, 2, 3].map((num) => {
                    let state = "";
                    const currentRound = Number(question?.roundNumber);
                    if (currentRound === num) {
                      state = "active";
                    } else if (currentRound > num) {
                      state = "done";
                    } else {
                      state = "locked";
                    }
                    return (
                      <div
                        className={`participantQuiz-round-progress-box participantQuiz-round-progress-${state}`}
                        key={num}
                      >
                        {state === "done" ? (
                          <span
                            className="participantQuiz-round-icon participantQuiz-round-done-icon"
                            title="Completed"
                          >
                            ✔
                          </span>
                        ) : state === "locked" ? (
                          <span
                            className="participantQuiz-round-icon participantQuiz-round-locked-icon"
                            title="Locked"
                          >
                            🔒
                          </span>
                        ) : (
                          <span
                            className="participantQuiz-round-icon participantQuiz-round-active-icon"
                            title="Current Round"
                          >
                            {num}
                          </span>
                        )
                        }
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="participantQuiz-title-box">
            <span className="participantQuiz-title">
              {question?.questionTitle || "Question Title"}
            </span>
          </div>
          <div className="participantQuiz-desc-assets-row">
            <div className="participantQuiz-desc-box">
              <span className="participantQuiz-desc-label">
                Question Description
              </span>
              <span className="participantQuiz-desc">
                {question?.questionDescription || ""}
              </span>
            </div>
            <div className="participantQuiz-assets-box">
              <span className="participantQuiz-assets-label">Assets</span>
              {question?.assets && question.assets.length > 0 ? (
                question.assets.map((asset, idx) => (
                  <img
                    src={asset}
                    alt={`asset-${idx}`}
                    key={idx}
                    className="participantQuiz-asset-img"
                  />
                ))
              ) : (
                <span className="participantQuiz-assets-empty">No Assets</span>
              )}
            </div>
          </div>
          <span className="participantQuiz-hint-heading">Hint</span>
          <div className={`participantQuiz-hint-box${hint ? ' participantQuiz-hint-opened' : ' participantQuiz-hint-locked'}${isFetchingHint ? ' participantQuiz-hint-fetching' : ''}`}
            onClick={() => !hint && !isFetchingHint && setShowHintDialog(true)}
            style={{ cursor: !hint && !isFetchingHint ? 'pointer' : 'default', opacity: isFetchingHint ? 0.7 : 1 }}
          >
            {!hint && <span className="participantQuiz-hint-lock-icon" title="Hint Locked">🔒</span>}
            {hint ? (
              <span className="participantQuiz-hint-value">{hint}</span>
            ) : (
              <span className="participantQuiz-hint-locked-message">
                Tap to expose the hint
                <span className="participantQuiz-hint-battery-warning">
                  (This will depreciate 4% battery)
                </span>
              </span>
            )}
          </div>
          <div className="participantQuiz-options-row">
            <span className="participantQuiz-options-heading">Options</span>
            {question?.options &&
              question.options.map((opt, idx) => (
                <label className="participantQuiz-option-label" key={idx}>
                  <input
                    type="radio"
                    name="participantQuiz-option"
                    className="participantQuiz-option-radio"
                  />
                  <span className="participantQuiz-option-text">{opt}</span>
                </label>
              ))}
          </div>
          <div className="participantQuiz-action-row">
            <button className="participantQuiz-submit-btn">SUBMIT</button>
            <button className="participantQuiz-skip-btn">SKIP</button>
          </div>
        </div>
        {/* Right: Info & Stats Area */}
        <div className="participantQuiz-info-area">
          <div className="participantQuiz-battery-box">
            <span className="participantQuiz-battery-label">
              Battery {batteryLevel}%
            </span>
            <div className="participantQuiz-battery-graphic">
              <div
                className="participantQuiz-battery-level"
                style={{ height: `${batteryLevel}%` }}
              ></div>
            </div>
          </div>
          <div className="participantQuiz-timer-box">
            <span className="participantQuiz-timer-label">Time Left</span>
            <span className="participantQuiz-timer-value">{timer}</span>
          </div>
          <div className="participantQuiz-info-stats">
            <div>
              <span className="participantQuiz-info-label">Started On:</span>
              <span className="participantQuiz-info-value">
                {startTime ? new Date(startTime).toLocaleString() : "--"}
              </span>
            </div>
            <div>
              <span className="participantQuiz-info-label">
                Total Hints Used:
              </span>
              <span className="participantQuiz-info-value">0</span>
            </div>
            <div>
              <span className="participantQuiz-info-label">
                Total Wrong Attempts:
              </span>
              <span className="participantQuiz-info-value">0</span>
            </div>
          </div>
        </div>
      </div>
      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="participant-instruction-dialog-backdrop">
          <div className="participant-instruction-dialog">
            <div className="participant-instruction-dialog-title">
              Confirm Logout
            </div>
            <div className="participant-instruction-dialog-message">
              Logging out now will affect your quiz participation. Are you sure
              you want to logout?
            </div>
            <div className="participant-instruction-dialog-actions">
              <button
                className="participant-instruction-dialog-cancel"
                onClick={() => setShowLogoutDialog(false)}
              >
                Cancel
              </button>
              <button
                className="participant-instruction-dialog-confirm"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Hint Confirmation Dialog */}
      {showHintDialog && (
        <div className="participantQuiz-dialog-backdrop">
          <div className="participantQuiz-dialog">
            <div className="participantQuiz-dialog-title">Reveal Hint?</div>
            <div className="participantQuiz-dialog-message">
              Fetching this hint will depreciate <b>4% battery</b>.<br />Are you sure you want to continue?
            </div>
            <div className="participantQuiz-dialog-actions">
              <button className="participantQuiz-dialog-cancel" onClick={() => setShowHintDialog(false)} disabled={isFetchingHint}>Cancel</button>
              <button className="participantQuiz-dialog-confirm" onClick={FetchHints} disabled={isFetchingHint}>Get Hint</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './Pages/Home Page/HomePage';
// Login Page Routes
import LoginPage from './Pages/Login Page/LoginPage';
import AdminLoginPage from './Pages/Admin Login/AdminLoginPage';
// Game Page Routes
import GamePage from './Pages/Game Page/GamePage';
// Master Admin Page Routes
import AddTeam from './Pages/Master Admin/Pages/Add Teams/AddTeams';
import FileFormatInfo from './Pages/Master Admin/Pages/Add Teams/File Format Info/FileFormatInfo';
import SetQuizTime from './Pages/Master Admin/Pages/Set Quiz Time/SetQuizTime';
import MasterAdminPage from './Pages/Master Admin/MasterAdminPage';
// Attendance Admin Page Routes
import AttendanceAdminPage from './Pages/Attendance Admin/Pages/AttendnaceAdmin';
import AttendanceAdminGroupList from './Pages/Attendance Admin/AttendanceAdminGroupList';
//Participants routes
import ParticipantWaitingPage from './Pages/Participants/Waiting/ParticipantWaitingPage';
import ParticipantInstructionPage from './Pages/Participants/Instructions/ParticipantInstructionPage';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/" element={<HomePage/>} />
        {/* Login Page Routes*/}
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/admin-login" element={<AdminLoginPage/>} />
        {/* Game Page Routes*/}
        <Route path="/playgame" element={<GamePage/>} />
        {/* Master Admin Page Routes*/}
        <Route path="/master-admin" element={<MasterAdminPage/>} />
        <Route path="/master-admin/add-team" element={<AddTeam/>} />
        <Route path="/master-admin/add-team/file-format-info" element={<FileFormatInfo/>} />
        <Route path="/master-admin/edit-quiz-times" element={<SetQuizTime/>} />
        {/* Attendance Admin Page Routes*/}
        <Route path="/attendance-admin" element={<AttendanceAdminGroupList/>} />
        <Route path="/attendance-admin/:groupName" element={<AttendanceAdminPage/>} />
        {/* participants pages  */}
        <Route path="/participant/waiting" element={<ParticipantWaitingPage/>} />
        <Route path="/participant/instructions" element={<ParticipantInstructionPage/>} />
      </Routes>
    </Router>
    </>
  )
}

export default App;

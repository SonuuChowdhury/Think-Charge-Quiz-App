import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/Home Page/HomePage';
import LoginPage from './Pages/Login Page/LoginPage';
import AdminLoginPage from './Pages/Admin Login/AdminLoginPage';
import GamePage from './Pages/Game Page/GamePage';
import MasterAdminPage from './Pages/Master Admin/MasterAdminPage';
import AttendanceAdminPage from './Pages/Attendance Admin/AttendnaceAdmin';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/admin-login" element={<AdminLoginPage/>} />
        <Route path="/playgame" element={<GamePage/>} />
        <Route path="/master-admin" element={<MasterAdminPage/>} />
        <Route path="/attendance-admin" element={<AttendanceAdminPage/>} />
      </Routes>
    </Router>

    </>
  )
}

export default App;

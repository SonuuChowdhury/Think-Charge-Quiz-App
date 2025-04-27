import { Router } from "express";

import getAdminCredentials from "../api/Login/AdminLogin.js";



// Middlewares 
import MasterAdminTokenVerification from "../middlewares/MasterAdminTokenVerification.js";
import AttendaceAdminTokenVerification from "../middlewares/AttendanceAdminTokenVerify.js";

// Master Admin Tasks
import AddParticipant from "../api/Master Admin/AddParticipants.js";
import DeleteParticipant from "../api/Master Admin/DeletePartcipants.js";
import EditQuizStartingTime from "../api/Master Admin/EditQuizStartingTime.js";
import GetLockOpenKey from "../api/Master Admin/GetLockOpenKey.js";
import FetchTeams from "../api/Master Admin/FetchTeams.js";
import DeleteAllTeams from "../api/Master Admin/DeleteAllTeams.js";

// Attendnace Admin Task 
import MarkTeamPresent from "../api/Attendnace Admin/MarkPresent.js";
import DeleteOneAttendance from "../api/Attendnace Admin/DeleteOneAttendance.js";
import ResetAttendance from "../api/Attendnace Admin/ResetAttendance.js";
import GetTeamDetails from "../api/Attendnace Admin/GetTeamDetials.js";
import FetchAllAttendanceDetails from "../api/Attendnace Admin/FetchAllDetails.js";

// Participants Task 
import VerifyLockOpenKey from "../api/Participants/Security/LockOpenKeyVerifcation.js";
import GetPartcipantsCredentials from "../api/Login/PartcipantsLogin.js";


const router = Router();

// Participants Routes
router.get('/verify-key/:key',VerifyLockOpenKey)
router.post('/login/participant', GetPartcipantsCredentials)

// Admin Login 
router.post('/login/admin',getAdminCredentials)

// Master admin Routes
router.post('/add-participant', MasterAdminTokenVerification, AddParticipant)
router.delete('/delete-participants/:mobile',MasterAdminTokenVerification, DeleteParticipant)
router.delete('/delete-all-teams',MasterAdminTokenVerification, DeleteAllTeams)
router.get('/get-key',MasterAdminTokenVerification,GetLockOpenKey)
router.get('/fetch-teams',MasterAdminTokenVerification,FetchTeams)
router.post('/edit-start-time',MasterAdminTokenVerification, EditQuizStartingTime)

// Attendance Admin Routes 
router.post('/mark-present',AttendaceAdminTokenVerification,MarkTeamPresent)
router.get('/fetch-team/:mobile', AttendaceAdminTokenVerification,GetTeamDetails )
router.delete('/delete-one-attendance/:id',AttendaceAdminTokenVerification, DeleteOneAttendance)
router.delete('/delete-all-attendance', AttendaceAdminTokenVerification, ResetAttendance)
router.post('/fetch-attendance', AttendaceAdminTokenVerification,FetchAllAttendanceDetails)

export default router;


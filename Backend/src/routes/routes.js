import { Router } from "express";

import getAdminCredentials from "../api/Login/AdminLogin.js";

// Middlewares 
import MasterAdminTokenVerification from "../middlewares/MasterAdminTokenVerification.js";
import AttendaceAdminTokenVerification from "../middlewares/AttendanceAdminTokenVerify.js";
import ParticipantTokenVerification from "../middlewares/ParticipantTokenVerify.js";
import ParticipantTokenVerificationWithINFOToken from "../middlewares/ParticipantTokenVerificationWithINFOToken.js";

// Master Admin Tasks
import AddParticipant from "../api/Master Admin/AddParticipants.js";
import DeleteParticipant from "../api/Master Admin/DeletePartcipants.js";
import EditQuizStartingTime from "../api/Master Admin/EditQuizStartingTime.js";
import GetLockOpenKey from "../api/Master Admin/GetLockOpenKey.js";
import FetchTeams from "../api/Master Admin/FetchTeams.js";
import DeleteAllTeams from "../api/Master Admin/DeleteAllTeams.js";
import GetQuizStartingTime from "../api/Master Admin/GetQuizeTime.js";
import BanTeam from "../api/Master Admin/BanTeam.js";
import FetchGroupsInfo from "../api/Master Admin/FetchGroupsInfo.js";
import FetchAllGroupsInfo from "../api/Attendnace Admin/FetchAllGroupsInfo.js";


// Attendnace Admin Task 
import MarkTeamPresent from "../api/Attendnace Admin/MarkPresent.js";
import DeleteOneAttendance from "../api/Attendnace Admin/DeleteOneAttendance.js";
import ResetAttendance from "../api/Attendnace Admin/ResetAttendance.js";
import GetTeamDetails from "../api/Attendnace Admin/GetTeamDetials.js";
import FetchAllAttendanceDetails from "../api/Attendnace Admin/FetchAllDetails.js";


// Participants Task 
import VerifyLockOpenKey from "../api/Participants/Security/LockOpenKeyVerifcation.js";
import GetPartcipantsCredentials from "../api/Login/PartcipantsLogin.js";
import GetAttendanceStatus from "../api/Participants/Security/getAttendanceStatus.js";
import StartQuiz from "../api/Participants/Security/StartQuiz.js";
import GetQuestions from "../api/Participants/Quiz/GetQuestions.js";
import GetHint from "../api/Participants/Quiz/GetHint.js";
import CheckAnswer from "../api/Participants/Quiz/CheckAnswer.js";
import GetQuizResultData from "../api/Participants/Quiz/GetQuizResultData.js";


const router = Router();

// Participants Routes
router.get('/verify-key/:key',VerifyLockOpenKey)
router.post('/login/participant', GetPartcipantsCredentials)
router.post('/get-attendance-status',ParticipantTokenVerification, GetAttendanceStatus)
router.post('/start-quiz',ParticipantTokenVerification, StartQuiz)
router.get('/get-next-question', ParticipantTokenVerificationWithINFOToken, GetQuestions )
router.get('/get-result-data', ParticipantTokenVerificationWithINFOToken, GetQuizResultData)
router.get('/get-hint', ParticipantTokenVerificationWithINFOToken, GetHint )
router.put('/check-answer', ParticipantTokenVerificationWithINFOToken, CheckAnswer )




// Admin Login 
router.post('/login/admin',getAdminCredentials)

// Master admin Routes
router.post('/add-participant', MasterAdminTokenVerification, AddParticipant)
router.delete('/delete-participants/:mobile',MasterAdminTokenVerification, DeleteParticipant)
router.delete('/delete-all-teams',MasterAdminTokenVerification, DeleteAllTeams)
router.get('/get-key',MasterAdminTokenVerification,GetLockOpenKey)
router.get('/fetch-teams',MasterAdminTokenVerification,FetchTeams)
router.post('/edit-start-time', MasterAdminTokenVerification, EditQuizStartingTime)
router.get('/get-start-time',MasterAdminTokenVerification, GetQuizStartingTime)
router.post('/ban-team/:mobile', MasterAdminTokenVerification, BanTeam)
router.get('/fetch-groups-info', MasterAdminTokenVerification,FetchGroupsInfo)


//uncomment this when you want to use the quiz questions feature only in development mode

// import FetchAllSet from "../api/Master Admin/Quiz Questions/FetchAllSets.js";
// import AddSet from "../api/Master Admin/Quiz Questions/AddSet.js";
// import AddRound from "../api/Master Admin/Quiz Questions/AddRound.js";
// import DeleteSet from "../api/Master Admin/Quiz Questions/DeleteSet.js";
// import DeleteRound from "../api/Master Admin/Quiz Questions/DeleteRound.js";

// router.post('/add-set', AddSet)
// router.post('/add-round', AddRound)
// router.delete('/delete-set/:setName', DeleteSet)
// router.delete('/delete-round/:setName/:roundName', DeleteRound)
// router.get('/fetch-all-set', FetchAllSet)

// Attendance Admin Routes 
router.post('/fetch-attendance',AttendaceAdminTokenVerification,FetchAllAttendanceDetails)
router.get('/fetch-all-groups-info', AttendaceAdminTokenVerification, FetchAllGroupsInfo)
router.post('/mark-present',AttendaceAdminTokenVerification,MarkTeamPresent)
router.get('/fetch-team/:mobile', AttendaceAdminTokenVerification,GetTeamDetails )
router.delete('/delete-one-attendance/:id',AttendaceAdminTokenVerification, DeleteOneAttendance)
router.delete('/delete-all-attendance', AttendaceAdminTokenVerification, ResetAttendance)
router.get('/fetch-all-groups-info', AttendaceAdminTokenVerification, FetchAllGroupsInfo)


export default router;


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
router.delete('/delete-participants/:id',MasterAdminTokenVerification, DeleteParticipant)
router.get('/get-key',MasterAdminTokenVerification,GetLockOpenKey)
router.post('/edit-start-time',MasterAdminTokenVerification, EditQuizStartingTime)

export default router;


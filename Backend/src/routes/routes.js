import { Router } from "express";

import getAdminCredentials from "../api/Login/AdminLogin.js";


// Middlewares 
import MasterAdminTokenVerification from "../middlewares/MasterAdminTokenVerification.js";
import AttendaceAdminTokenVerification from "../middlewares/AttendanceAdminTokenVerify.js";

// Master Admin Tasks
import AddParticipant from "../api/Master Admin/AddParticipants.js";
import DeleteParticipant from "../api/Master Admin/DeletePartcipants.js";

const router = Router();

// Participants Routes

// Admin Login 
router.post('/login/admin',getAdminCredentials)

// Master admin Routes
router.post('/add-participant', MasterAdminTokenVerification, AddParticipant)
router.delete('/delete-participants/:id',MasterAdminTokenVerification, DeleteParticipant)


export default router;


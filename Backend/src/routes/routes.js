import { Router } from "express";

import getAdminCredentials from "../api/Login/AdminLogin.js";

const router = Router();

router.post('/login/admin',getAdminCredentials)





export default router;


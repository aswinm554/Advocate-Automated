import express from "express";
import { getAdminProfile } from "../../controllers/admin/adminProfile.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import adminMiddleware from "../../middlewares/adminMiddleware.js";
const router = express.Router();

router.get("/profile", authMiddleware, adminMiddleware, getAdminProfile);

export default router;

import express from "express";
import { getActivityLogs } from "../../controllers/admin/activityController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import adminMiddleware from "../../middlewares/adminMiddleware.js"


const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getActivityLogs);

export default router; 
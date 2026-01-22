import express from "express";
import { getAdminStats } from "../../controllers/admin/reportController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import adminMiddleware from "../../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/stats", authMiddleware, adminMiddleware, getAdminStats);

export default router;
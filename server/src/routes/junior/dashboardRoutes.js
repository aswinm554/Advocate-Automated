import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import juniorMiddleware from "../../middlewares/juniorMiddleware.js";
import { getJuniorDashboard } from "../../controllers/junior/dashoardController.js";
const router = express.Router();

router.get("/", authMiddleware, juniorMiddleware, getJuniorDashboard);
export default router;

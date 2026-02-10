import express from "express";
import { advocateDashboard } from "../../controllers/advocate/dashboardController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import advocateMiddleware from "../../middlewares/advocateMiddleware.js";



const router = express.Router();

router.get("/", authMiddleware, advocateMiddleware, advocateDashboard);
  

export default router;
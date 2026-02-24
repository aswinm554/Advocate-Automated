import express from "express";
import { sendMessage, getCaseMessages } from "../controllers/messageController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, sendMessage);
router.get("/:caseId", authMiddleware, getCaseMessages);

export default router;
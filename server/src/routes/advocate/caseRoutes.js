import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { createCase, getAllCase, getCaseById, updateCase, addCaseHistory } from "../../controllers/advocate/caseController.js";
import advocateMiddleware from "../../middlewares/advocateMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, advocateMiddleware, createCase)
router.get("/", authMiddleware, advocateMiddleware, getAllCase)
router.get("/:id", authMiddleware, advocateMiddleware, getCaseById)
router.patch("/:id", authMiddleware, advocateMiddleware, updateCase)
router.post("/:id/history", authMiddleware, advocateMiddleware, addCaseHistory)

export default router; 
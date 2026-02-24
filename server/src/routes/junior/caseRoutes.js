// routes/junior/caseRoutes.js
import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import juniorMiddleware from "../../middlewares/juniorMiddleware.js";
import { getJuniorCases, getJuniorCaseById } from "../../controllers/junior/caseController.js"; 

const router = express.Router();

router.get("/", authMiddleware, juniorMiddleware, getJuniorCases);
router.get("/:id", authMiddleware, juniorMiddleware, getJuniorCaseById);

export default router;
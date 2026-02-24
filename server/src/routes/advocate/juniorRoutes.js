import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import advocateMiddleware from "../../middlewares/advocateMiddleware.js";
import { addJuniorAdvocate, getJuniorAdvocates, getJuniorCases, assignCaseToJunior } from "../../controllers/advocate/juniorAdvocateController.js";

const router = express.Router();

router.post("/", authMiddleware, advocateMiddleware, addJuniorAdvocate);
router.get("/", authMiddleware, advocateMiddleware, getJuniorAdvocates);
router.get("/:id", authMiddleware, advocateMiddleware, getJuniorCases);
router.put("/", authMiddleware, advocateMiddleware, assignCaseToJunior)

export default router;
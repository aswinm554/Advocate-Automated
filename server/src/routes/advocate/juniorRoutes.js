import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import advocateMiddleware from "../../middlewares/advocateMiddleware.js";
import { addJuniorAdvocate, getJuniorAdvocates } from "../../controllers/advocate/juniorAdvocateController.js";

const router = express.Router();

router.post("/", authMiddleware, advocateMiddleware, addJuniorAdvocate);
router.get("/", authMiddleware, advocateMiddleware, getJuniorAdvocates);

export default router;
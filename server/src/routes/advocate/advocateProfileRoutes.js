import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import advocateMiddleware from "../../middlewares/advocateMiddleware.js"
import { getAdvocateProfile } from "../../controllers/advocate/advocateProfile.js";
const router = express.Router();

router.get("/profile", authMiddleware, advocateMiddleware, getAdvocateProfile);

export default router;

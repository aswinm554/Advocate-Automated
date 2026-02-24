import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import clientMiddleware from "../../middlewares/clientMiddleware.js"
import { getClientProfile } from "../../controllers/Client/clientProfile.js";
const router = express.Router();

router.get("/profile", authMiddleware, clientMiddleware, getClientProfile);

export default router;

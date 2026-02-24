import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import juniorMiddleware from "../../middlewares/juniorMiddleware.js";
import { getJuniorProfile } from "../../controllers/junior/juniorProfile.js";

const router = express.Router();

router.get("/", authMiddleware, juniorMiddleware, getJuniorProfile );

export default router;

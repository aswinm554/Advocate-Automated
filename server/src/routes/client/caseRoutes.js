import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import clientMiddleware from "../../middlewares/clientMiddleware.js";
import { getClientCases } from "../../controllers/Client/caseController.js";

const router = express.Router();

router.get("/", authMiddleware, clientMiddleware, getClientCases);
 

export default router;
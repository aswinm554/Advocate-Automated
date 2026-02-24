import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import clientMiddleware from "../../middlewares/clientMiddleware.js";
import { getClientCaseDocuments } from "../../controllers/Client/documentController.js";

const router = express.Router();

router.get("/:caseId", authMiddleware, clientMiddleware, getClientCaseDocuments);
 

export default router;
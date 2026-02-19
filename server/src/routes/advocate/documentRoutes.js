import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import advocateMiddleware from "../../middlewares/advocateMiddleware.js";
import upload from "../../middlewares/documentMiddleware.js";
import { uploadDocument, getCaseDocuments, deleteDocument } from "../../controllers/advocate/documentController.js";


const router = express.Router();

router.post("/", authMiddleware, advocateMiddleware, upload.single("file"), uploadDocument);
router.get("/:caseId", authMiddleware, advocateMiddleware, getCaseDocuments);
router.delete("/:id", authMiddleware, advocateMiddleware, deleteDocument)

export default router;
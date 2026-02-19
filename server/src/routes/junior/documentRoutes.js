import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import juniorMiddleware from "../../middlewares/juniorMiddleware.js";
import { getJuniorCaseDocuments, downloadDocument } from "../../controllers/junior/documentController.js";

const router = express.Router();

router.get("/:caseId", authMiddleware, juniorMiddleware, getJuniorCaseDocuments);
router.get("/download/:id", authMiddleware, juniorMiddleware, downloadDocument);

export default router;

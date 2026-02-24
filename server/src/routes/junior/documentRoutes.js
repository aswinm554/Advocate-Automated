import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import juniorMiddleware from "../../middlewares/juniorMiddleware.js";
import { getJuniorDocuments, downloadDocument } from "../../controllers/junior/documentController.js";

const router = express.Router();

router.get("/", authMiddleware, juniorMiddleware, getJuniorDocuments);
router.get("/download/:id", authMiddleware, juniorMiddleware, downloadDocument);

export default router;

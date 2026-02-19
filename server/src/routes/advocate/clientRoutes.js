import express from "express";
import { getAdvocateClients, getClientById, updateClientNotes } from "../../controllers/advocate/clientController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import advocateMiddleware from "../../middlewares/advocateMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, advocateMiddleware, getAdvocateClients);
router.get("/:id", authMiddleware, advocateMiddleware, getClientById);
router.patch("/:id", authMiddleware, advocateMiddleware, updateClientNotes);

export default router;
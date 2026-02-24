import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import adminMiddleware from "../../middlewares/adminMiddleware.js";
import { getAllClients } from "../../controllers/admin/clientController.js";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getAllClients);


export default router;

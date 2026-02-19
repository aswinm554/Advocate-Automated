import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import clientMiddleware from "../../middlewares/clientMiddleware.js";
import { bookAppointment } from "../../controllers/Client/appointmentController.js";

const router = express.Router();

router.post("/", authMiddleware, clientMiddleware, bookAppointment);

export default router;

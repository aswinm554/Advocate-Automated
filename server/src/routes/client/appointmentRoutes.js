import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import clientMiddleware from "../../middlewares/clientMiddleware.js";
import { bookAppointment, getAllApprovedAdvocates, getClientAppointments } from "../../controllers/Client/appointmentController.js";

const router = express.Router();

router.post("/", authMiddleware, clientMiddleware, bookAppointment);
router.get("/advocates", authMiddleware, clientMiddleware, getAllApprovedAdvocates)
router.get("/", authMiddleware, clientMiddleware, getClientAppointments)

export default router;

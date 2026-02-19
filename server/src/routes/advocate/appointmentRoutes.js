import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import advocateMiddleware from "../../middlewares/advocateMiddleware.js";
import { getAdvocateAppointments, updateAppointmentStatus } from "../../controllers/advocate/appointmentController.js";

const router = express.Router();

router.get("/", authMiddleware, advocateMiddleware, getAdvocateAppointments);
router.patch("/:id", authMiddleware, advocateMiddleware, updateAppointmentStatus);

export default router; 
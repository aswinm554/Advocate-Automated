import Appointment from "../../models/appointmentModel.js";

export const bookAppointment = async (req, res) => {
    try {
        if (req.user.role !== "client") {
            return res.status(403).json({ message: "Client access only" });
        }
        const { advocateId, appointmentDate, reason } = req.body;

        if (!advocateId || !appointmentDate || !reason) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const appointment = await Appointment.create({
            clientUserId: req.user.id,
            advocateId,
            appointmentDate,
            reason
        });

        res.status(201).json(appointment);

    } catch (error) {
        res.status(500).json({
            message: "Failed to book appointment",
            error: error.message
        });
    }
};
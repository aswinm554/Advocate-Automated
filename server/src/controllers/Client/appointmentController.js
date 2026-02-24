import Appointment from "../../models/appointmentModel.js";
import User from "../../models/userModel.js";

export const bookAppointment = async (req, res) => {
    try {
        if (req.user.role !== "client") {
            return res.status(403).json({ message: "Client access only" });
        }

        const { advocateId, appointmentDate, reason } = req.body;

        if (!advocateId || !appointmentDate || !reason) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const appointmentDateObj = new Date(appointmentDate);

        if (appointmentDateObj <= new Date()) {
            return res.status(400).json({
                message: "Appointment must be a future date"
            });
        }

        const advocate = await User.findById(advocateId);

        if (!advocate || advocate.role !== "advocate") {
            return res.status(400).json({
                message: "Invalid advocate selected"
            });
        }

        const existingAppointment = await Appointment.findOne({
            advocateId,
            appointmentDate: appointmentDateObj,
            status: { $in: ["pending", "approved"] }
        });

        if (existingAppointment) {
            return res.status(400).json({
                message: "This time slot is already booked"
            });
        }

        const appointment = await Appointment.create({
            clientUserId: req.user.id,
            advocateId,
            appointmentDate: appointmentDateObj,
            reason,
            status: "pending"
        });

        res.status(201).json({
            message: "Appointment booked successfully",
            appointment
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to book appointment",
            error: error.message
        });
    }
};

export const getAllApprovedAdvocates = async (req, res) => {
    try {
        if (req.user.role !== "client") {
            return res.status(403).json({ message: "Client access only" });
        }

        const advocates = await User.find({
            role: "advocate",
            isVerified: true,
            status: "active"
        }).select("name email specialization");

        res.status(200).json(advocates);

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch advocates" });
    }
};


export const getClientAppointments = async (req, res) => {
    try {
        if (req.user.role !== "client") {
            return res.status(403).json({ message: "Client access only" });
        }

        const appointments = await Appointment.find({
            clientUserId: req.user.id
        })
            .populate("advocateId", "name email")
            .sort({ appointmentDate: -1 });

        res.status(200).json(appointments);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
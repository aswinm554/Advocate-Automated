import Appointment from "../../models/appointmentModel.js";
import Client from "../../models/clientModel.js";


export const getAdvocateAppointments = async (req, res) => {
  try {
    if (req.user.role !== "advocate") {
      return res.status(403).json({ message: "Advocate only" });
    }

    const appointments = await Appointment.find({
      advocateId: req.user.id
    })
      .populate("clientUserId", "name email phone")
      .sort({ appointmentDate: 1 });

    res.status(200).json(appointments);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch appointments",
      error: error.message
    });
  }
};



export const updateAppointmentStatus = async (req, res) => {
  try {
    if (req.user.role !== "advocate") {
      return res.status(403).json({ message: "Advocate only" });
    }

    const { status } = req.body;

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      advocateId: req.user.id
    }).populate("clientUserId", "name email phone");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (
      (appointment.status === "pending" && !["approved", "rejected"].includes(status)) ||
      (appointment.status === "approved" && status !== "completed")
    ) {
      return res.status(400).json({
        message: "Invalid status transition"
      });
    }

    if (["rejected", "completed", "cancelled"].includes(appointment.status)) {
      return res.status(400).json({
        message: "Appointment already finalized"
      });
    }

    appointment.status = status;
    await appointment.save();

    if (status === "approved") {
      const existingClient = await Client.findOne({
        advocateId: req.user.id,
        userId: appointment.clientUserId._id
      });

      if (!existingClient) {
        await Client.create({
          advocateId: req.user.id,
          userId: appointment.clientUserId._id,
          name: appointment.clientUserId.name,
          email: appointment.clientUserId.email,
          phone: appointment.clientUserId.phone
        });
      }
    }

    res.status(200).json(appointment);

  } catch (error) {
    res.status(500).json({
      message: "Failed to update appointment",
      error: error.message
    });
  }
};

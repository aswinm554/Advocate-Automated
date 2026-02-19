import Payment from "../../models/paymentModel.js";
import Case from "../../models/caseModel.js";


export const requestPayment = async (req, res) => {
  try {
    const { clientId, caseId, amount, paymentType } = req.body;

    if (!clientId || !caseId || !amount || !paymentType) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const caseData = await Case.findOne({
      _id: caseId,
      advocateId: req.user.id,
      clientId
    });

    if (!caseData) {
      return res.status(403).json({
        message: "Invalid case or client relationship"
      });
    }

    const payment = await Payment.create({
      clientId,
      advocateId: req.user.id,
      caseId,
      amount,
      paymentType,
      requestedBy: "advocate",
      status: "requested"
    });

    res.status(201).json(payment);

  } catch (error) {
    console.error("Payment Error:", error);   // 👈 ADD THIS
    res.status(500).json({
      message: "Failed to request payment",
      error: error.message
    });
  }
};


export const getAdvocatePayments = async (req, res) => {
  try {
    const { status } = req.query;

    const query = { advocateId: req.user.id };
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate("clientId", "name email")
      .populate("caseId", "title caseNumber")
      .sort({ createdAt: -1 });

    res.status(200).json(payments);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch payments",
      error: error.message
    });
  }
};


export const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const payment = await Payment.findOne({
      _id: req.params.id,
      advocateId: req.user.id
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = status;
    await payment.save();

    res.status(200).json(payment);

  } catch (error) {
    res.status(500).json({
      message: "Failed to update payment",
      error: error.message
    });
  }
};

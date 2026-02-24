import Payment from "../../models/paymentModel.js";
import User from "../../models/userModel.js";
import { generateInvoice } from "../../utils/generateInvoice.js";
import Razorpay from "razorpay"

export const getClientPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      clientId: req.user.id
    })
      .populate("advocateId", "name")
      .populate("caseId", "title caseNumber")
      .sort({ createdAt: -1 });

    res.status(200).json(payments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const payRequestedPayment = async (req, res) => {
  try {
    const { paymentMethod, transactionId } = req.body;

    const payment = await Payment.findOne({
      _id: req.params.id,
      clientId: req.user.id
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status !== "requested") {
      return res.status(400).json({ message: "Payment already processed" });
    }

    payment.status = "paid";
    payment.paymentMethod = paymentMethod;
    payment.transactionId = transactionId;

    await payment.save();

    const client = await User.findById(payment.clientId);
    const advocate = await User.findById(payment.advocateId);

    const invoicePath = generateInvoice(
      payment,
      client.name,
      advocate.name
    );

    payment.invoicePath = invoicePath;
    await payment.save();

    res.status(200).json({
      message: "Payment successful",
      payment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment || !payment.invoicePath) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Allow only client or advocate
    if (
      payment.clientId.toString() !== req.user.id &&
      payment.advocateId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.download(payment.invoicePath);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






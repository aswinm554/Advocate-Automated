import Payment from "../../models/paymentModel.js";
import User from "../../models/userModel.js";
import { generateInvoice } from "../../utils/generateInvoice.js";


export const createPayment = async (req, res) => {
  try {
    const {
      advocateId,
      caseId,
      appointmentId,
      amount,
      paymentType,
      paymentMethod
    } = req.body;

    if (!advocateId || !amount || !paymentType || !paymentMethod) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const payment = await Payment.create({
      clientId: req.user.id,
      advocateId,
      caseId: caseId || null,
      appointmentId: appointmentId || null,
      amount,
      paymentType,
      paymentMethod,
      status: "pending"
    });

    res.status(201).json(payment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getClientPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      clientId: req.user.id
    })
      .populate("advocateId", "name")
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

    // Update payment
    payment.status = "paid";
    payment.paymentMethod = paymentMethod;
    payment.transactionId = transactionId;

    await payment.save();

    // Generate invoice AFTER saving
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

export const fakeRazorpayPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      clientId: req.user.id
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = "paid";
    payment.paymentMethod = "razorpay";
    payment.transactionId = "FAKE_TXN_" + Date.now();

    await payment.save();

    // Generate invoice
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
      message: "Payment successful (Fake Razorpay)",
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






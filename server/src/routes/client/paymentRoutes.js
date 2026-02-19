import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import clientMiddleware from "../../middlewares/clientMiddleware.js";
import { createPayment, getClientPayments, payRequestedPayment, fakeRazorpayPayment, downloadInvoice } from "../../controllers/Client/paymentController.js";

const router = express.Router();

router.post("/", authMiddleware, clientMiddleware, createPayment)
router.get("/", authMiddleware, clientMiddleware, getClientPayments)
router.post("/pay/:id", authMiddleware, clientMiddleware, payRequestedPayment)
router.post("/fake-razorpay/:id", authMiddleware, clientMiddleware, fakeRazorpayPayment)
router.get("/invoice/:id", authMiddleware, clientMiddleware, downloadInvoice)

export default router;

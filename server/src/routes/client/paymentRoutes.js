import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import clientMiddleware from "../../middlewares/clientMiddleware.js";
import { getClientPayments, payRequestedPayment, downloadInvoice } from "../../controllers/Client/paymentController.js";

const router = express.Router();

router.get("/", authMiddleware, clientMiddleware, getClientPayments)
router.post("/pay/:id", authMiddleware, clientMiddleware, payRequestedPayment)
router.get("/invoice/:id", authMiddleware, clientMiddleware, downloadInvoice)

export default router;

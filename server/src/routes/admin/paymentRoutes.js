import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import {getAllPayments, getPaymentStats} from "../../controllers/admin/paymentController.js";
import adminMiddleware from "../../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getAllPayments);

router.get( "/stats", authMiddleware, adminMiddleware, getPaymentStats);

export default router;

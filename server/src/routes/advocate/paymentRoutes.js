import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import {requestPayment, getAdvocatePayments, updatePaymentStatus} from "../../controllers/advocate/paymentController.js";
import advocateMiddleware from "../../middlewares/advocateMiddleware.js";

const router = express.Router();

router.post("/request",authMiddleware, advocateMiddleware, requestPayment);
router.get("/", authMiddleware, advocateMiddleware, getAdvocatePayments);
router.patch("/:id", authMiddleware, advocateMiddleware, updatePaymentStatus);


export default router;
 
import express from "express";
import {getAllAdvocates, getPendingAdvocates, approveAdvocate, rejectAdvocate, getApprovedAdvocate, getApprovedAdvocateById, getRejectedAdvocates, getRejectedAdvocateById } from "../../controllers/admin/advocateController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import adminMiddleware from "../../middlewares/adminMiddleware.js";


const router = express.Router();
// get all advocates
router.get("/all", authMiddleware, adminMiddleware, getAllAdvocates);

// GET pending advocate

router.get("/pending", authMiddleware, adminMiddleware, getPendingAdvocates);


// APPROVE advocate

router.patch("/approve/:id", authMiddleware, adminMiddleware, approveAdvocate);

// GET ALL APPROVED advocate

router.get("/approved", authMiddleware, adminMiddleware, getApprovedAdvocate);

// GET single approved advocate by ID

router.get("/approved/:id", authMiddleware, adminMiddleware, getApprovedAdvocateById);

// REJECT advocate

router.patch("/reject/:id", authMiddleware, adminMiddleware, rejectAdvocate);

// GET all rejected advocates

router.get("/rejected", authMiddleware, adminMiddleware, getRejectedAdvocates);

// GET rejected advocate by ID
router.get("/rejected/:id", authMiddleware, adminMiddleware, getRejectedAdvocateById);


export default router;
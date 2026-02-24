import express from "express";
import { createTask, deleteTask, getAdvocateTasks } from "../../controllers/advocate/taskController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import advocateMiddleware from "../../middlewares/advocateMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, advocateMiddleware, createTask);
router.get("/", authMiddleware, advocateMiddleware, getAdvocateTasks);
router.delete("/:id", authMiddleware, advocateMiddleware, deleteTask)

export default router;
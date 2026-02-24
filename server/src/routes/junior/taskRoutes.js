import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import juniorMiddleware from "../../middlewares/juniorMiddleware.js";
import { getJuniorTasks, markTaskCompleted, updateTaskStatus } from "../../controllers/junior/taskController.js";

const router = express.Router();

router.get("/", authMiddleware, juniorMiddleware, getJuniorTasks);
router.put("/",authMiddleware, juniorMiddleware, updateTaskStatus)
router.patch("/:id", authMiddleware, juniorMiddleware, markTaskCompleted);

export default router;
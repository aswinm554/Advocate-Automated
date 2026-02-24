import Task from "../../models/taskModel.js";
import Case from "../../models/caseModel.js";

export const getJuniorDashboard = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "junior_advocate") {
      return res.status(403).json({ message: "Junior advocate only" });
    }

    const juniorId = req.user._id;

    // Get all tasks
    const tasks = await Task.find({ assignedTo: juniorId });

    // Get all cases (FIXED)
    const cases = await Case.find({
      assignedJuniors: juniorId
    });

    const now = new Date();

    const overdueTasks = tasks.filter(
      t => new Date(t.deadline) < now && t.status !== "completed"
    );

    const stats = {
      totalTasks: tasks.length,
      pendingTasks: tasks.filter(t => t.status === "pending").length,
      completedTasks: tasks.filter(t => t.status === "completed").length,
      overdueTasks: overdueTasks.length,
      totalCases: cases.length,
      activeCases: cases.filter(c => c.status === "active").length
    };

    const recentTasks = await Task.find({ assignedTo: juniorId })
      .populate("caseId", "title caseNumber")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      stats,
      recentTasks
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard",
      error: error.message
    });
  }
};
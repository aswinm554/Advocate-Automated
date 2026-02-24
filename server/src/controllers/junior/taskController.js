import Task from "../../models/taskModel.js";

export const getJuniorTasks = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "junior_advocate") {
      return res.status(403).json({ message: "Junior advocate only" });
    }

    const juniorId = req.user._id;

    const tasks = await Task.find({
      assignedTo: juniorId
    })
      .populate("caseId", "title caseNumber")
      .populate("advocateId", "name")
      .sort({ deadline: 1 });

    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "junior_advocate") {
      return res.status(403).json({ message: "Junior advocate only" });
    }

    const { status } = req.body;
    const juniorId = req.user._id;

    if (!["pending", "in_progress", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      assignedTo: juniorId
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status;
    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update task",
      error: error.message
    });
  }
};

export const markTaskCompleted = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "junior_advocate") {
      return res.status(403).json({ message: "Junior advocate only" });
    }

    const { taskId } = req.params;

    const task = await Task.findOne({
      _id: taskId,
      assignedTo: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = "completed";
    await task.save();

    res.status(200).json({
      message: "Task marked as completed",
      task
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update task",
      error: error.message
    });
  }
};
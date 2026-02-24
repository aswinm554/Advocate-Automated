import Task from "../../models/taskModel.js";
import Case from "../../models/caseModel.js";
import User from "../../models/userModel.js";

export const createTask = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "advocate") {
      return res.status(403).json({ message: "Advocate only" });
    }

    const { caseId, assignedTo, title, description, deadline, priority } = req.body;

    if (!caseId || !assignedTo || !title || !deadline) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (new Date(deadline) <= new Date()) {
      return res.status(400).json({ message: "Deadline must be future date" });
    }

    
    const caseExists = await Case.findOne({
      _id: caseId,
      advocateId: req.user._id
    });

    if (!caseExists) {
      return res.status(404).json({ message: "Case not found" });
    }

    const junior = await User.findOne({
      _id: assignedTo,
      role: "junior_advocate",
      parentAdvocateId: req.user._id
    });

    if (!junior) {
      return res.status(404).json({ message: "Invalid junior advocate" });
    }

    if (!caseExists.juniors.includes(assignedTo)) {
      return res.status(400).json({
        message: "Junior not assigned to this case"
      });
    }

    const task = await Task.create({
      advocateId: req.user._id,
      caseId,
      assignedTo,
      title,
      description,
      deadline,
      priority: priority || "medium",
      status: "pending"
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create task",
      error: error.message
    });
  }
};

export const getAdvocateTasks = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "advocate") {
      return res.status(403).json({ message: "Advocate only" });
    }

    const tasks = await Task.find({
      advocateId: req.user._id
    })
      .populate("caseId", "title caseNumber")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });
      

    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message
    });
  }
};


export const deleteTask = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "advocate") {
      return res.status(403).json({ message: "Advocate only" });
    }

    const { taskId } = req.params;

    const task = await Task.findOneAndDelete({
      _id: taskId,
      advocateId: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete task",
      error: error.message
    });
  }
};
import Task from "../../models/taskModel.js";
import Case from "../../models/caseModel.js";
import User from "../../models/userModel.js";

export const createTask = async (req, res) => {
  try {
    if (req.user.role !== "advocate") {
      return res.status(403).json({ message: "Advocate only" });
    }

    const { caseId, assignedTo, title, description, deadline, priority } = req.body;

    if (!caseId || !assignedTo || !title || !deadline) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Verify case belongs to advocate
    const caseExists = await Case.findOne({
      _id: caseId,
      advocateId: req.user.id
    });

    if (!caseExists) {
      return res.status(404).json({ message: "Case not found" });
    }

    // Verify junior belongs to advocate
    const junior = await User.findOne({
      _id: assignedTo,
      role: "junior_advocate",
      parentAdvocateId: req.user.id
    });

    if (!junior) {
      return res.status(404).json({ message: "Invalid junior advocate" });
    }

    const task = await Task.create({
      advocateId: req.user.id,
      caseId,
      assignedTo,
      title,
      description,
      deadline,
      priority
    });

    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({
      message: "Failed to create task",
      error: error.message
    });
  }
};

export const getAdvocateTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      advocateId: req.user.id
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

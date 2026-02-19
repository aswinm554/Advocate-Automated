import Task from "../../models/taskModel.js";

export const getJuniorTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user.id
    })
      .populate("caseId", "title caseNumber")
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
    const { status } = req.body;

    if (!["pending", "in-progress", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        assignedTo: req.user.id
      },
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);

  } catch (error) {
    res.status(500).json({
      message: "Failed to update task status",
      error: error.message
    });
  }
};

import ActivityLog from "../../models/activitylogModel.js";


export const getActivityLogs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const logs = await ActivityLog.find()
      .populate("actor", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      

    const total = await ActivityLog.countDocuments();

    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      logs
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

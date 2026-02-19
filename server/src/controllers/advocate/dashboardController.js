import Case from "../../models/caseModel.js";
import CaseHistory from "../../models/caseHistoryModel.js";

export const advocateDashboard = async (req, res) => {
  try {
    const advocateId = req.user.id;

    const totalCases = await Case.countDocuments({ advocateId });
    const activeCases = await Case.countDocuments({
      advocateId,
      status: "active"
    });
    const pendingCases = await Case.countDocuments({
      advocateId,
      status: "pending"
    });
    const closedCases = await Case.countDocuments({
      advocateId,
      status: "closed"
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingHearings = await Case.find({
      advocateId,
      hearingDate: { $gte: today }
    })
      .select("title court hearingDate")
      .sort({ hearingDate: 1 })
      .limit(5);

    const recentActivities = await CaseHistory.find()
      .populate({
        path: "caseId",
        match: { advocateId },
        select: "title"
      })
      .sort({ createdAt: -1 })
      .limit(5);

    const filteredActivities = recentActivities.filter(
      activity => activity.caseId !== null
    );

    res.status(200).json({
      cases: {
        total: totalCases,
        active: activeCases,
        pending: pendingCases,
        closed: closedCases
      },
      upcomingHearings,
      recentActivities: filteredActivities
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load dashboard",
      error: error.message
    });
  }
};

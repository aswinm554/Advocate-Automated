import Case from "../../models/caseModel.js";
import CaseHistory from "../../models/caseHistoryModel.js";

export const advocateDashboard = async (req, res) => {
  try {
    const advocateId = req.user.id;

    // 1️⃣ Case counts
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

    // 2️⃣ Upcoming hearings (next 7 days)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingHearings = await Case.find({
      advocateId,
      hearingDate: { $gte: today, $lte: nextWeek }
    })
      .select("title court hearingDate")
      .sort({ hearingDate: 1 });

    // 3️⃣ Recent case activity (last 5 updates)
    const recentActivities = await CaseHistory.find()
      .populate({
        path: "caseId",
        match: { advocateId },
        select: "title"
      })
      .sort({ createdAt: -1 })
      .limit(5);

    // Remove history entries not belonging to this advocate
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

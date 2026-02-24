import Advocate from "../../models/advocateModel.js";
import User from "../../models/userModel.js";
import Case from "../../models/caseModel.js";
import Payment from "../../models/paymentModel.js";

export const getAdminSummaryReport = async (req, res) => {
  try {
    const totalAdvocates = await Advocate.countDocuments();
    const approvedAdvocates = await Advocate.countDocuments({ status: "approved" });
    const pendingAdvocates = await Advocate.countDocuments({ status: "pending" });
    const rejectedAdvocates = await Advocate.countDocuments({ status: "rejected" });

    const totalClients = await User.countDocuments({ role: "client" });

    const totalCases = await Case.countDocuments();

    const totalPayments = await Payment.countDocuments();

    const revenueData = await Payment.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    res.status(200).json({
      totalAdvocates,
      approvedAdvocates,
      pendingAdvocates,
      rejectedAdvocates,
      totalClients,
      totalCases,
      totalPayments,
      totalRevenue
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
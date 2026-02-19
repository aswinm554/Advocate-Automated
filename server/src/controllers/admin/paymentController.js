import Payment from "../../models/paymentModel.js";

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("clientId", "name")
      .populate("advocateId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(payments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentStats = async (req, res) => {
  try {
    const totalRevenue = await Payment.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.status(200).json({
      totalRevenue: totalRevenue[0]?.total || 0
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

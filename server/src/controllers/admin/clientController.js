import Client from "../../models/clientModel.js";
import Case from "../../models/caseModel.js";

export const getAllClients = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const clients = await Client.find()
      .populate("userId", "name email role isVerified")
      .sort({ createdAt: -1 });

    const result = [];

    for (const client of clients) {
      if (!client.userId) continue;

      // ✅ Correct match using Client._id
      const cases = await Case.find({ clientId: client.userId._id })
        .populate("advocateId", "name email")
        .populate("assignedJuniors", "name email");

      result.push({
        clientId: client._id,
        name: client.userId.name,
        email: client.userId.email,
        verified: client.userId.isVerified,
        phone: client.phone,
        address: client.address,
        totalCases: cases.length,
        cases: cases.map(c => ({
          caseId: c._id,
          caseNumber: c.caseNumber,
          title: c.title,
          status: c.status,
          court: c.court,
          advocate: c.advocateId
            ? {
                name: c.advocateId.name,
                email: c.advocateId.email
              }
            : null,
          juniors: c.assignedJuniors?.map(j => ({
            name: j.name,
            email: j.email
          })),
          hearingDate: c.hearingDate
        }))
      });
    }

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch client details",
      error: error.message
    });
  }
};
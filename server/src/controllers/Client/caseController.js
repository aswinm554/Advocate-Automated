import Case from "../../models/caseModel.js";
import Client from "../../models/clientModel.js";


export const getClientCases = async (req, res) => {
  try {
    const client = await Client.findOne({
      userId: req.user._id
    });

    if (!client) {
      return res.status(404).json({
        message: "Client profile not found"
      });
    }

    const cases = await Case.find({
      clientId: client._id
    })
      .populate("advocateId", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(cases);

  } catch (error) {
    console.error("Client cases error:", error); 
    res.status(500).json({
      message: "Failed to fetch cases",
      error: error.message
    });
  }
};
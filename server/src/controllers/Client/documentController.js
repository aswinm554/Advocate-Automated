import Case from "../../models/caseModel.js";
import Client from "../../models/clientModel.js";
import Document from "../../models/documentModel.js";

export const getClientCaseDocuments = async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const caseId = req.params.caseId;

    const caseData = await Case.findById(caseId);

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    const client = await Client.findOne({ userId: req.user._id });

    if (!client) {
      return res.status(404).json({ message: "Client profile not found" });
    }

    if (caseData.clientId.toString() !== client._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const documents = await Document.find({ caseId });

    res.status(200).json(documents);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch documents",
      error: error.message
    });
  }
};
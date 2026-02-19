import Document from "../../models/documentModel.js";
import Case from "../../models/caseModel.js";


export const getClientCaseDocuments = async (req, res) => {
  try {
    const caseData = await Case.findOne({
      _id: req.params.caseId,
      clientId: req.user.id
    });

    if (!caseData) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const documents = await Document.find({
      caseId: req.params.caseId,
      isPrivate: false,
      isDeleted: false
    }).sort({ createdAt: -1 });

    res.status(200).json(documents);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



import Document from "../../models/documentModel.js";
import Case from "../../models/caseModel.js";

export const getJuniorDocuments = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "junior_advocate") {
      return res.status(403).json({ message: "Junior access only" });
    }

    const juniorId = req.user._id;

    // 1️⃣ Find cases assigned to this junior
    const assignedCases = await Case.find({
      assignedJuniors: juniorId
    }).select("_id");

    const caseIds = assignedCases.map(c => c._id);

    // 2️⃣ Fetch documents belonging to those cases
    const documents = await Document.find({
      caseId: { $in: caseIds }
    })
      .populate("uploadedBy", "name email")
      .populate("caseId", "caseNumber title");

    res.status(200).json(documents);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const downloadDocument = async (req, res) => {
  try {
    if (req.user.role !== "junior_advocate") {
      return res.status(403).json({ message: "Junior only" });
    }

    const document = await Document.findById(req.params.id);

    if (!document || document.isDeleted) {
      return res.status(404).json({ message: "Document not found" });
    }

    const caseData = await Case.findById(document.caseId);

    if (!caseData || caseData.assignedJunior?.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.redirect(document.fileUrl);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
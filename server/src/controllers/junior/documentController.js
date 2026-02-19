import Document from "../../models/documentModel.js";
import Task from "../../models/taskModel.js";

export const getJuniorCaseDocuments = async (req, res) => {
  try {
    const task = await Task.findOne({
      caseId: req.params.caseId,
      assignedTo: req.user.id
    });

    if (!task) {
      return res.status(403).json({ message: "Access denied" });
    }

    const documents = await Document.find({
      caseId: req.params.caseId
    }).sort({ createdAt: -1 });

    res.status(200).json(documents);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch documents",
      error: error.message
    });
  }
};


export const downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document || document.isDeleted) {
      return res.status(404).json({ message: "Not found" });
    }

    const caseData = await Case.findById(document.caseId);

    if (!caseData.assignedJuniors.includes(req.user.id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.download(document.filePath);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
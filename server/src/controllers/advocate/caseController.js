import Case from "../../models/caseModel.js";
import CaseHistory from "../../models/caseHistoryModel.js";

export const createCase = async (req, res) => {
  try {
    const newCase = await Case.create({
      ...req.body,
      advocateId: req.user.id
    });

    await CaseHistory.create({
      caseId: newCase._id,
      action: "Case Created",
      description: "New case created",
      updatedBy: req.user.id
    });

    res.status(201).json(newCase);

  } catch (error) {
    res.status(500).json({
      message: "Failed to create case",
      error: error.message
    });
  }
};



export const getAllCase = async (req, res) => {
  try {
    const advocateId = req.user.id;
    const { status, search, sortBy } = req.query;

    const query = { advocateId };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { caseNumber: { $regex: search, $options: "i" } }
      ];
    }

    let sortOptions = { updatedAt: -1 };

    if (sortBy === "hearingDate") {
      sortOptions = { hearingDate: 1 };
    }

    const cases = await Case.find(query)
      .sort(sortOptions)
      .select("title caseNumber court status hearingDate updatedAt");

    res.status(200).json(cases);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cases",
      error: error.message
    });
  }
};


export const getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findOne({
      _id: req.params.id,
      advocateId: req.user.id
    });

    if (!caseData) {
      return res.status(404).json({
        message: "Case not found or access denied"
      });
    }

    res.status(200).json(caseData);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching case",
      error: error.message
    });
  }
};



export const updateCase = async (req, res) => {
  try {
    const caseData = await Case.findOne({
      _id: req.params.id,
      advocateId: req.user.id
    });

    if (!caseData) {
      return res.status(404).json({
        message: "Case not found or access denied"
      });
    }

    if (caseData.status === "closed") {
      return res.status(400).json({
        message: "Closed cases cannot be updated"
      });
    }

    const oldStatus = caseData.status;
    const oldHearingDate = caseData.hearingDate;

    // ✅ ONLY validate if status is actually changing
    if (
      req.body.status &&
      req.body.status !== oldStatus
    ) {
      if (
        (oldStatus === "pending" && req.body.status !== "active") ||
        (oldStatus === "active" && req.body.status !== "closed")
      ) {
        return res.status(400).json({
          message: "Invalid status transition"
        });
      }
    }

    const allowedFields = [
      "title",
      "caseNumber",
      "court",
      "status",
      "hearingDate",
      "description",
      "clientId"
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        caseData[field] = req.body[field];
      }
    });

    await caseData.save();

    // ✅ Add history only if meaningful change
    if (
      oldStatus !== caseData.status ||
      String(oldHearingDate) !== String(caseData.hearingDate)
    ) {
      await CaseHistory.create({
        caseId: caseData._id,
        action: "Case Updated",
        description: "Case status or hearing date updated",
        nextHearingDate: caseData.hearingDate,
        updatedBy: req.user.id
      });
    }

    res.status(200).json(caseData);

  } catch (error) {
    res.status(500).json({
      message: "Failed to update case",
      error: error.message
    });
  }
};



export const addCaseHistory = async (req, res) => {
  try {
    const caseData = await Case.findOne({
      _id: req.params.id,
      advocateId: req.user.id
    });

    if (!caseData) {
      return res.status(404).json({
        message: "Case not found or access denied"
      });
    }

    const history = await CaseHistory.create({
      caseId: req.params.id,
      action: req.body.action,
      description: req.body.description,
      nextHearingDate: req.body.nextHearingDate,
      updatedBy: req.user.id
    });

    res.status(201).json(history);

  } catch (error) {
    res.status(500).json({
      message: "Failed to add case history",
      error: error.message
    });
  }
};

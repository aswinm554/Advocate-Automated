import Case from "../../models/caseModel.js";
import CaseHistory from "../../models/caseHistoryModel.js";


export const createCase = async (req, res) => {
    try {
        const newCase = await Case.create({ ...req.body, advocateId: req.user.id });
        res.status(201).json(newCase);
    } catch (error) {
        res.status(500).json({ message: "Failed to create case", error: error.message })

    }
};

export const getAllCase = async (req, res) => {
  try {
    const advocateId = req.user.id;
    const { status, search, sortBy } = req.query;

    const query = { advocateId };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search by title or case number
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { caseNumber: { $regex: search, $options: "i" } }
      ];
    }

    // Sorting
    let sortOptions = { updatedAt: -1 }; // default
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
        const caseData = await Case.findOne({ _id: req.params.id, advocateId: req.user.id });
        if (!caseData) {
            return res.status(404).json({ message: "Case not found or access denied" });

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
        const caseData = await Case.findOne({ _id: req.params.id, advocateId: req.user.id });
        if (!caseData) {
            return res.status(404).json({ message: "Case not found or access denied" })
        }
        if (caseData.status === "closed") {
            return res.status(400).json({ message: "Closed cases cannot be updated" });
        }
        const oldStatus = caseData.status;
        const oldHearingDate = caseData.hearingDate;

        const updatedCase = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true });

          if (
      oldStatus !== updatedCase.status ||
      String(oldHearingDate) !== String(updatedCase.hearingDate)
    ) {
      await CaseHistory.create({
        caseId: updatedCase._id,
        action: "Case Updated",
        description: "Case status or hearing date updated",
        nextHearingDate: updatedCase.hearingDate,
        updatedBy: req.user.id
      });
    }

        res.status(200).json(updatedCase);
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
            return res.status(404).json({ message: "Case not found or access denied" });
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


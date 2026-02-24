import Case from "../../models/caseModel.js";

export const getJuniorCases = async (req, res) => {
  try {
    const juniorId = req.user._id;

    const cases = await Case.find({
      assignedJuniors: juniorId
    })
      .populate("advocateId", "name email role")   
      .populate({
        path: "clientId",
        populate: {
          path: "userId",
          select: "name email"
        }
      });

    res.status(200).json(cases);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cases",
      error: error.message
    });
  }
};

export const getJuniorCaseById = async (req, res) => {
  try {
    const juniorId = req.user._id;

    const caseData = await Case.findOne({
      _id: req.params.id,
      assignedJuniors: juniorId
    })
      .populate("advocateId", "name email role")   
      .populate({
        path: "clientId",
        populate: {
          path: "userId",
          select: "name email"
        }
      });

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.status(200).json(caseData);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch case",
      error: error.message
    });
  }
};

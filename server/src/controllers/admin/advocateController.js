import User from "../../models/userModel.js";
import Advocate from "../../models/advocateModel.js";
import logActivity from "../../utils/logActivity.js";


//get all advocates
export const  getAllAdvocates = async(req,res) => {
  try{ 
    const advocates = await Advocate.find().populate("userId", "name email role").sort({ createdAt: -1});
     
    res.status(200).json({ success: true, count: advocates.length, data: advocates
    });
  } catch (error) { res.status(500).json({
      success: false,
      message: 'Failed to fetch advocates',
      error: error.message
    });

  } 
}

//GET all pending advocates
export const getPendingAdvocates = async (req, res) => {
  try {
    const advocates = await Advocate.find({ status: "pending" }).populate("userId", "name email");
    res.status(200).json(advocates);
  }
  catch (error) {
    res.status(500).json({ message: error.message });

  }
};

//APPROVE advocate


export const approveAdvocate = async (req, res) => {
  try {

    const advocates = await Advocate.findById(req.params.id);

    if (!advocates) {
      return res.status(404).json({ message: "Advocate not found" });
    }

    const oldStatus = advocates.status;
    advocates.status = "approved";
    advocates.approvedAt = new Date();
    advocates.approvedBy = req.user._id;
    advocates.rejectionReason = undefined;

    await advocates.save();

    // mark user as verified
    await User.findByIdAndUpdate(advocates.userId, {
      isVerified: true,
      role: "advocate",
    });

    //activitylog
    await logActivity({
      actor: req.user._id,          // admin
      actorRole: req.user.role,     // "admin"
      action: "APPROVE_ADVOCATE",
      entityType: "Advocate",
      entityId: advocates._id,
      metadata: {
        oldStatus,
        newStatus: "approved",
        advocateUserId: advocates.userId,
      },
      ipAddress: req.ip,
    })

    res.status(200).json({ message: "Advocate approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }


};

// GET ALL APPROVED advocate

export const getApprovedAdvocate = async (req, res) => {
  try {
    const advocates = await Advocate.find({ status: "approved" }).populate("userId", "name email");
    res.status(200).json(advocates)
  } catch (error) {
    res.status(500).json({ mesaage: "error.message" });

  }
};

// GET single approved advocate by ID

export const getApprovedAdvocateById = async (req, res) => {
  try {
    const advocate = await Advocate.findOne({
      _id: req.params.id,
      status: "approved",
    }).populate("userId", "name email");

    if (!advocate) {
      return res
        .status(404)
        .json({ message: "Approved advocate not found" });
    }

    res.status(200).json(advocate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// REJECT advocate

export const rejectAdvocate = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    const advocate = await Advocate.findById(req.params.id);

    if (!advocate) {
      return res.status(404).json({ message: "Advocate not found" });
    }
    const oldStatus = advocate.status;
    advocate.status = "rejected";
    advocate.rejectionReason = reason;
    advocate.approvedAt = undefined;
    advocate.approvedBy = req.user._id;

    await advocate.save();

    //activitylog
    await logActivity({
      actor: req.user._id,          // admin
      actorRole: req.user.role,     // "admin"
      action: "REJECT_ADVOCATE",
      entityType: "Advocate",
      entityId: advocate._id,
      metadata: {
        oldStatus,
        newStatus: "rejected",
        reason,
        advocateUserId: advocate.userId,
      },
      ipAddress: req.ip,
    });
    res.status(200).json({ message: "Advocate rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET all rejected advocates

export const getRejectedAdvocates = async (req, res) => {
  try {
    const advocates = await Advocate.find({ status: "rejected" })
      .populate("userId", "name email");

    res.status(200).json(advocates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET rejected advocate by ID

export const getRejectedAdvocateById = async (req, res) => {
  try {
    const advocate = await Advocate.findOne({
      _id: req.params.id,
      status: "rejected",
    }).populate("userId", "name email");

    if (!advocate) {
      return res
        .status(404)
        .json({ message: "Rejected advocate not found" });
    }

    res.status(200).json(advocate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
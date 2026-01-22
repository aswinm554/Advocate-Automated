import Advocate from "../../models/advocateModel.js";
import User from "../../models/userModel.js";


export const getAdminStats = async (req, res) => {
    try {

        const totalUsers = await User.countDocuments();

        const totalAdvocates = await Advocate.countDocuments();

        const pendingAdvocates = await Advocate.countDocuments({
            status: "pending",
        });

        const approvedAdvocates = await Advocate.countDocuments({
            status: "approved",
        });

        const rejectedAdvocates = await Advocate.countDocuments({
            status: "rejected",
        });

        res.status(200).json({
            totalUsers,
            totalAdvocates,
            pendingAdvocates,
            approvedAdvocates,
            rejectedAdvocates,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
import User from "../../models/userModel.js";


export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select(
      "-password"
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

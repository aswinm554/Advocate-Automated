import User from "../../models/userModel.js";


export const getAdvocateProfile = async (req, res) => {
  try {
    const advocate = await User.findById(req.user.id).select(
      "-password"
    );

    if (!advocate) {
      return res.status(404).json({ message: "Advocate not found" });
    }

    res.status(200).json({
      success: true,
      advocate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

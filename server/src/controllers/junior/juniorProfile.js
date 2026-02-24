import User from "../../models/userModel.js";


export const getJuniorProfile = async (req, res) => {
  try {
    const junior = await User.findById(req.user.id).select(
      "-password"
    );

    if (!junior) {
      return res.status(404).json({ message: "Junior Advocate not found" });
    }

    res.status(200).json({
      success: true,
      junior,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

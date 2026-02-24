import User from "../../models/userModel.js";


export const getClientProfile = async (req, res) => {
  try {
    const client = await User.findById(req.user.id).select(
      "-password"
    );

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({
      success: true,
      client,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

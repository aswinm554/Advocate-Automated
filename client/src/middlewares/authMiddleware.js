import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
  try {
   const token = req.cookies.token;

    // 2. If no token
    if (!token) {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.SECRET);

    // 4. Get user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    // 5. Attach user to request
    req.user = user;

    // 6. Move to next middleware/controller
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token invalid",
    });
  }
};

export default authMiddleware;

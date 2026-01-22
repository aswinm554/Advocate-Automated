import express from "express";
import { login, logout, registerAdvocate, registerClient } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", authMiddleware, logout)
router.post("/register/advocate", registerAdvocate);
router.post("/register/client", registerClient)

router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    name: req.user.name
  });
});


export default router;

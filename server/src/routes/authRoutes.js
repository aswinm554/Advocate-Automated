import express from "express";
import { login, logout, registerAdvocate, registerClient } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();


// Configure file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/licenses/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post("/login", login);
router.post("/logout", authMiddleware, logout)
router.post("/register/advocate", upload.single('licenseDocument'), registerAdvocate);
router.post("/register/client", registerClient)

router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    name: req.user.name
  });
});


export default router;

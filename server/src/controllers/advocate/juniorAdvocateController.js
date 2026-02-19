import User from "../../models/userModel.js";
import bcrypt from "bcryptjs";

export const addJuniorAdvocate = async (req, res) => {
    try {
        if (req.user.role !== "advocate") {
            return res.status(403).json({ message: "Advocate only" });
        }
        const { name, email, password, phone, address } = req.body;
        if (!name || !email || !password || !phone || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const junior = await User.create({
            name, email, password: hashedPassword, phone, address, role: "junior_advocate", parentAdvocateId: req.user.id,
            isVerified: true
        })
        res.status(201).json({
            message: "Junior advocate added successfully",
            juniorId: junior._id
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add junior",
            error: error.message
        });
    }
}

export const getJuniorAdvocates = async (req, res) => {
    try {
        const juniors = await User.find({
            role: "junior_advocate",
            parentAdvocateId: req.user.id
        }).select("name email phone status createdAt");

        res.status(200).json(juniors);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch juniors",
            error: error.message
        });
    }
};

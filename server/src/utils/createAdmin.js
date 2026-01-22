import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
  const existingAdmin = await User.findOne({ email: "admin@legal.com" });

  if (existingAdmin) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Super Admin",
    email: "admin@legal.com",
    password: hashedPassword,
    role: "admin",
    isVerified: true,
    status: "active",
  });

  console.log("Admin created successfully");
  process.exit();
};

createAdmin();

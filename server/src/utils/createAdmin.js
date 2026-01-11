import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import connectDB from "../config/db.js";

dotenv.config();
await connectDB();

const createAdmin = async () => {
  const existingAdmin = await User.findOne({ role: "admin" });

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
  });

  console.log("Admin created successfully");
  process.exit();
};

createAdmin();

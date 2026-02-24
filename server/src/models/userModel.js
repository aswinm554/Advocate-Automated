import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "advocate", "junior_advocate", "client"],
      default: "client",
    },
    parentAdvocateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.role === "junior_advocate";
      }
    },

    phone: {
      type: String,
      required: function () {
        return this.role === 'client';
      }
    },
    address: {
      type: String,
      required: function () {
        return this.role === 'client';
      }
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
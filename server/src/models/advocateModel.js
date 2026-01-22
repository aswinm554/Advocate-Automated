import mongoose from "mongoose";

const advocateSchema = new mongoose.Schema(

    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        licenseNumber: {
            type: String,
            required: true,
            unique: true,
        },

        experience: {
            type: Number,
            required: true,
        },

        specialization: {
            type: String,
            required: true,
        },

        licenseDocument: {
            type: String, // URL / path to uploaded PDF/image
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        rejectionReason: {
            type: String,
        },

        approvedAt: {
            type: Date,
        },

        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // admin id
        },
    },
    { timestamps: true }
);

export default mongoose.model("Advocate", advocateSchema);

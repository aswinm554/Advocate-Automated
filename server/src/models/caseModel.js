import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    caseNumber: { type: String, unique: true },
    court: String,

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true
    },

    advocateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    assignedJuniors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    status: {
      type: String,
      enum: ["pending", "active", "closed"],
      default: "pending"
    },

    hearingDate: {
      type: Date
    }

  },
  { timestamps: true }
);

export default mongoose.model("Case", caseSchema);

import mongoose from "mongoose";

const caseHistorySchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true
    },
    action: String, // filed, hearing, judgement
    description: String,
    date: Date
  },
  { timestamps: true })
  
export default mongoose.model("CaseHistory", caseHistorySchema);

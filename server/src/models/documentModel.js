import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    advocateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true
    },
    caseNumber:{
      type: String
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true
    },

    fileUrl: {
      type: String,
      required: true
    },
    publicId:{
      type: String,
      require: true
    },

    category: {
  type: String,
  enum: [
    "general",
    "petition",
    "evidence",
    "contract",
    "court_order",
    "correspondence",
    "affidavit",
    "other"
  ],
  default: "general"
},

    isPrivate: {
      type: Boolean,
      default: true
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);

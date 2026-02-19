import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    advocateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case"
    },

    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment"
    },
    invoicePath: {
      type: String
    },


    amount: {
      type: Number,
      required: true
    },

    paymentType: {
      type: String,
      enum: [
        "consultation",
        "hearing",
        "retainer",
        "documentation",
        "case_fee"
      ],
      required: true
    }

    ,
    requestedBy: {
      type: String,
      enum: ["client", "advocate"],
      required: true
    },


    status: {
      type: String,
      enum: ["pending", "requested", "paid", "rejected", "failed"],
      default: "requested"
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "upi", "card", "razorpay"],
      default: null
    }
    ,

    transactionId: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);

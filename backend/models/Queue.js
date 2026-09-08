import mongoose from "mongoose";

const queueSchema = new mongoose.Schema(
  {
    queueNumber: {
      type: String,
      required: true,
      unique: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    service: {
      type: String,
      required: true,
      enum: [
        "Account Opening",
        "Deposit",
        "Withdrawal",
        "Mobile Banking",
        "Account Harmonization",
        "Customer Support",
      ],
    },

    status: {
      type: String,
      enum: [
        "Waiting",
        "Serving",
        "Completed",
        "Cancelled",
      ],
      default: "Waiting",
    },
  },
  {
    timestamps: true,
  }
);

const Queue = mongoose.model("Queue", queueSchema);

export default Queue;
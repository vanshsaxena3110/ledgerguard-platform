import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({ company: 1, createdAt: -1 });
transactionSchema.index({ company: 1, type: 1, status: 1, createdAt: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;

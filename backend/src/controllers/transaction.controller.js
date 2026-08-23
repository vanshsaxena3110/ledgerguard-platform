import Transaction from "../models/Transaction.js";
import { generateTransactionId } from "../utils/generateTransactionId.js";

import { getIO } from "../socket/socket.js";

export const createTransaction = async (req, res) => {
  try {
    const { type, amount, description } = req.body;

    if (!type || !amount) {
      return res.status(400).json({
        message: "Type and amount are required",
      });
    }

    const transaction = await Transaction.create({
      transactionId: generateTransactionId(),
      company: req.companyId,
      type,
      amount,
      description,
      status: "completed",
    });

  getIO()
  .to(`company:${req.companyId}`)
  .emit("transactionCreated", {
    transaction,
  });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    console.error("Create transaction error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      company: req.companyId,
    }).sort({ createdAt: -1 });

    res.json({
      transactions,
    });
  } catch (error) {
    console.error("Get transactions error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      company: req.companyId,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }
   getIO()
  .to(`company:${req.companyId}`)
  .emit("transactionDeleted", {
    transactionId: req.params.id,
  });

    res.json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Delete transaction error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};
export const updateTransaction = async (req, res) => {
  try {
    const { type, amount, description, status } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        company: req.companyId,
      },
      {
        type,
        amount,
        description,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }
   getIO()
  .to(`company:${req.companyId}`)
  .emit("transactionUpdated", {
    transaction,
  });

    res.json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    console.error("Update transaction error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};
import Transaction from "../models/Transaction.js";
import { generateTransactionId } from "../utils/generateTransactionId.js";

import { getIO } from "../socket/socket.js";

export const createTransaction = async (req, res) => {
  try {
    const { type, amount, description, status } = req.body;

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
      status,
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
    const { search, q, type, status, startDate, endDate, minAmount, maxAmount } = req.query;
    const filters = {
      company: req.companyId,
    };

    const searchTerm = String(search ?? q ?? "").trim();
    if (searchTerm) {
      const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filters.$or = [
        { transactionId: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    if (type && ["credit", "debit"].includes(type)) filters.type = type;
    if (status && ["pending", "completed", "failed"].includes(status)) filters.status = status;

    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) {
        const start = new Date(`${startDate}T00:00:00.000Z`);
        if (Number.isNaN(start.getTime())) return res.status(400).json({ message: "Invalid start date" });
        filters.createdAt.$gte = start;
      }
      if (endDate) {
        const end = new Date(`${endDate}T00:00:00.000Z`);
        if (Number.isNaN(end.getTime())) return res.status(400).json({ message: "Invalid end date" });
        end.setUTCDate(end.getUTCDate() + 1);
        filters.createdAt.$lt = end;
      }
      if (filters.createdAt.$gte && filters.createdAt.$lt && filters.createdAt.$gte >= filters.createdAt.$lt) {
        return res.status(400).json({ message: "Start date must be on or before end date" });
      }
    }

    if (minAmount !== undefined && minAmount !== "") {
      const minimum = Number(minAmount);
      if (!Number.isFinite(minimum) || minimum < 0) return res.status(400).json({ message: "Invalid minimum amount" });
      filters.amount = { $gte: minimum };
    }
    if (maxAmount !== undefined && maxAmount !== "") {
      const maximum = Number(maxAmount);
      if (!Number.isFinite(maximum) || maximum < 0) return res.status(400).json({ message: "Invalid maximum amount" });
      filters.amount = { ...(filters.amount || {}), $lte: maximum };
    }
    if (filters.amount?.$gte !== undefined && filters.amount?.$lte !== undefined && filters.amount.$gte > filters.amount.$lte) {
      return res.status(400).json({ message: "Minimum amount must be less than or equal to maximum amount" });
    }

    const transactions = await Transaction.find(filters).sort({ createdAt: -1 });

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

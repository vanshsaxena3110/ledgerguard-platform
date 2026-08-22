import Transaction from "../models/Transaction.js";

export const getBilling = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      company: req.companyId,
    });

    const totalTransactions = transactions.length;

    const totalCredit = transactions
      .filter((transaction) => transaction.type === "credit")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalDebit = transactions
      .filter((transaction) => transaction.type === "debit")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const balance = totalCredit - totalDebit;
    res.json({
      billing: {
        totalTransactions,
        totalCredit,
        totalDebit,
        balance,
      },
    });
  } catch (error) {
    console.error("Billing error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};
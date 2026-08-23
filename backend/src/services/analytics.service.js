import Transaction from "../models/Transaction.js";

export const getCompanyAnalytics = async (companyId) => {
  const transactions = await Transaction.find({
    company: companyId,
  });

  const totalTransactions = transactions.length;

  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

    const creditCount = transactions.filter(
  (t) => t.type === "credit"
).length;

const debitCount = transactions.filter(
  (t) => t.type === "debit"
).length;

  const balance = totalCredit - totalDebit;

  const monthlyData = {};

transactions.forEach((transaction) => {
  const date = new Date(transaction.createdAt);

  const month = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;

  if (!monthlyData[month]) {
    monthlyData[month] = {
      credit: 0,
      debit: 0,
    };
  }

  if (transaction.type === "credit") {
    monthlyData[month].credit += transaction.amount;
  }

  if (transaction.type === "debit") {
    monthlyData[month].debit += transaction.amount;
  }
});

  return {
    totalTransactions,
    totalCredit,
    totalDebit,
    balance,
    creditCount,
    debitCount,
    monthlyData,
  };
};
import React, { useEffect, useState } from 'react';
import AnalyticsStats from '../components/AnalyticsStats.jsx';
import CashFlowChart from '../components/CashFlowChart.jsx';
import CategoryDistribution from '../components/CategoryDistribution.jsx';
import { fetchTransactions, getAuthToken } from '../services/api.js';
import socket from '../socket/socket.js';

const getCompanyId = () => {
  try {
    const token = getAuthToken();
    const payload = token && JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload?.companyId;
  } catch {
    return null;
  }
};

const getAmount = (transaction) => {
  const amount = Number(transaction?.amount ?? 0);
  return Number.isFinite(amount) ? amount : 0;
};

const normalizeTransactions = (transactions) => Array.isArray(transactions)
  ? transactions.filter((transaction) => transaction && typeof transaction === 'object')
  : [];

const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
const formatDateTime = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};

const buildMonthlyData = (transactions) => {
  const validTransactions = normalizeTransactions(transactions);
  const validDates = validTransactions
    .map((transaction) => new Date(transaction.createdAt))
    .filter((date) => !Number.isNaN(date.getTime()));
  const endDate = validDates.length ? new Date(Math.max(...validDates.map((date) => date.getTime()))) : new Date();
  const months = new Map();

  for (let offset = 9; offset >= 0; offset -= 1) {
    const date = new Date(endDate.getFullYear(), endDate.getMonth() - offset, 1);
    months.set(`${date.getFullYear()}-${date.getMonth()}`, { date, revenue: 0, expenses: 0 });
  }

  validTransactions.forEach((transaction) => {
    const date = new Date(transaction.createdAt);
    if (Number.isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const current = months.get(key);
    if (!current) return;
    current[transaction.type === 'credit' ? 'revenue' : 'expenses'] += getAmount(transaction);
  });

  return [...months.values()]
    .sort((a, b) => a.date - b.date)
    .slice(-10)
    .map((month) => ({
      label: month.date.toLocaleDateString('en-US', { month: 'short' }),
      revenue: month.revenue,
      expenses: month.expenses,
    }));
};

export default function Analytics() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions().then((data) => setTransactions(normalizeTransactions(data))).catch((error) => console.error('Failed to load analytics transactions:', error));

    const joinCompany = () => {
      const companyId = getCompanyId();
      if (companyId) socket.emit('joinCompany', companyId);
    };
    const handleCreated = ({ transaction }) => {
      if (transaction && typeof transaction === 'object') setTransactions((current) => [transaction, ...normalizeTransactions(current).filter((item) => item._id !== transaction._id)]);
    };
    const handleUpdated = ({ transaction }) => {
      if (transaction && typeof transaction === 'object') setTransactions((current) => normalizeTransactions(current).map((item) => item._id === transaction._id ? transaction : item));
    };
    const handleDeleted = ({ transactionId }) => {
      setTransactions((current) => normalizeTransactions(current).filter((item) => item._id !== transactionId && item.transactionId !== transactionId));
    };

    socket.on('connect', joinCompany);
    socket.on('transactionCreated', handleCreated);
    socket.on('transactionUpdated', handleUpdated);
    socket.on('transactionDeleted', handleDeleted);
    if (!socket.connected) socket.connect();

    return () => {
      socket.off('connect', joinCompany);
      socket.off('transactionCreated', handleCreated);
      socket.off('transactionUpdated', handleUpdated);
      socket.off('transactionDeleted', handleDeleted);
    };
  }, []);

  const validTransactions = normalizeTransactions(transactions);
  const totalRevenue = validTransactions.reduce((total, transaction) => transaction.type === 'credit' ? total + getAmount(transaction) : total, 0);
  const totalExpenses = validTransactions.reduce((total, transaction) => transaction.type === 'debit' ? total + getAmount(transaction) : total, 0);
  const monthlyData = buildMonthlyData(validTransactions);
  const completedCount = validTransactions.filter((transaction) => transaction.status === 'completed').length;
  const pendingCount = validTransactions.filter((transaction) => transaction.status === 'pending').length;
  const failedCount = validTransactions.filter((transaction) => transaction.status === 'failed').length;
  const largestCredit = validTransactions.filter((transaction) => transaction.type === 'credit').reduce((largest, transaction) => getAmount(transaction) > getAmount(largest) ? transaction : largest, null);
  const largestDebit = validTransactions.filter((transaction) => transaction.type === 'debit').reduce((largest, transaction) => getAmount(transaction) > getAmount(largest) ? transaction : largest, null);
  const averageAmount = validTransactions.length ? validTransactions.reduce((total, transaction) => total + getAmount(transaction), 0) / validTransactions.length : 0;
  const latestTransaction = validTransactions.reduce((latest, transaction) => new Date(transaction.createdAt) > new Date(latest?.createdAt || 0) ? transaction : latest, null);
  const insightItems = [
    ['Total Transactions', validTransactions.length.toLocaleString('en-IN')],
    ['Completed Transactions', completedCount.toLocaleString('en-IN')],
    ['Pending Transactions', pendingCount.toLocaleString('en-IN')],
    ['Failed Transactions', failedCount.toLocaleString('en-IN')],
    ['Largest Credit Transaction', largestCredit ? `${largestCredit.description || 'External Transfer'} · ${formatINR(getAmount(largestCredit))}` : formatINR(0)],
    ['Largest Debit Transaction', largestDebit ? `${largestDebit.description || 'External Transfer'} · ${formatINR(getAmount(largestDebit))}` : formatINR(0)],
    ['Average Transaction Amount', formatINR(averageAmount)],
    ['Latest Transaction', latestTransaction ? formatDateTime(latestTransaction.createdAt) : '—'],
  ];

  const exportAnalytics = () => {
    const blob = new Blob([`Metric,Value\nTotal Revenue,${totalRevenue}\nTotal Expenses,${totalExpenses}`], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'analytics.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="analytics-page">
      <div className="analytics-title-row">
        <div><h1 className="dash-heading">Analytics &amp; Insights</h1><p className="dash-subtitle">Real-time financial performance and trends.</p></div>
        <div className="dash-title-actions"><button className="dash-filter-btn" onClick={exportAnalytics}>↓ &nbsp;Export</button></div>
      </div>
      <div className="analytics-grid">
        <div className="analytics-main-column">
          <section className="analytics-card analytics-cash-card"><div className="analytics-card-heading"><h2>Cash Flow Trends</h2><span className="analytics-toggle">CREDIT VS DEBIT</span></div><CashFlowChart data={monthlyData} /></section>
          <section className="analytics-card"><div className="analytics-card-heading"><h2>Transaction Insights</h2><span className="analytics-more">⋮</span></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>{insightItems.map(([label, value]) => <div className="analytics-stat-card" key={label}><span className="analytics-stat-label">{label}</span><strong style={{ fontSize: label.includes('Largest') ? '1rem' : undefined }}>{value}</strong></div>)}</div></section>
        </div>
        <div className="analytics-side-column"><section className="analytics-card analytics-category-card"><div className="analytics-card-heading"><h2>Category Distribution</h2><span className="analytics-more">⋮</span></div><CategoryDistribution /></section><AnalyticsStats totalRevenue={totalRevenue} totalExpenses={totalExpenses} /></div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '../services/api.js';
import socket from '../socket/socket.js';

function Icon({ name, size = 18 }) {
  const s = { width: size, height: size };
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const icons = {
    bank: <><path d="M3 21h18" /><path d="M3 10h18" /><path d="M5 6l7-3 7 3" /><line x1="4" y1="10" x2="4" y2="21" /><line x1="20" y1="10" x2="20" y2="21" /><line x1="8" y1="14" x2="8" y2="17" /><line x1="12" y1="14" x2="12" y2="17" /><line x1="16" y1="14" x2="16" y2="17" /></>,
    'arrow-down': <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>,
    'arrow-up': <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
    'more-horizontal': <><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></>,
  };
  return <svg viewBox="0 0 24 24" style={s} {...p}>{icons[name] || null}</svg>;
}

const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
const formatSignedINR = (amount) => `${amount >= 0 ? '+' : '-'}${formatINR(Math.abs(amount))}`;
const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toISOString().slice(0, 10);
};

function toBillingRow(transaction) {
  const amount = Number(transaction.amount);
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const type = transaction.type === 'credit' ? 'Credit' : 'Debit';
  const status = transaction.status ? transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) : 'Completed';
  return {
    id: transaction._id || transaction.transactionId,
    date: formatDate(transaction.createdAt),
    refId: transaction.transactionId || transaction._id || '—',
    desc: transaction.description || 'External Transfer',
    type,
    amount: `${type === 'Credit' ? '+' : '-'}${formatINR(safeAmount)}`,
    status,
  };
}

export default function Billing() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions().then(setTransactions).catch((error) => console.error('Failed to load billing transactions:', error));

    const handleCreated = ({ transaction }) => {
      if (transaction) setTransactions((current) => [transaction, ...current.filter((item) => item._id !== transaction._id)]);
    };
    const handleUpdated = ({ transaction }) => {
      if (transaction) setTransactions((current) => current.map((item) => item._id === transaction._id ? transaction : item));
    };
    const handleDeleted = ({ transactionId }) => {
      setTransactions((current) => current.filter((item) => item._id !== transactionId && item.transactionId !== transactionId));
    };

    socket.on('transactionCreated', handleCreated);
    socket.on('transactionUpdated', handleUpdated);
    socket.on('transactionDeleted', handleDeleted);

    return () => {
      socket.off('transactionCreated', handleCreated);
      socket.off('transactionUpdated', handleUpdated);
      socket.off('transactionDeleted', handleDeleted);
    };
  }, []);

  const totalCredit = transactions.reduce((total, transaction) => transaction.type === 'credit' ? total + (Number(transaction.amount) || 0) : total, 0);
  const totalDebit = transactions.reduce((total, transaction) => transaction.type === 'debit' ? total + (Number(transaction.amount) || 0) : total, 0);
  const netCashFlow = totalCredit - totalDebit;
  const billingRows = transactions.map(toBillingRow);
  const recentRows = billingRows.slice(0, 5);
  const creditRatio = totalCredit + totalDebit ? totalCredit / (totalCredit + totalDebit) : 0;
  const circumference = 339.29;

  const exportBillingCSV = () => {
    const header = 'Date,Transaction ID / Reference ID,Description,Type,Amount,Status';
    const rows = billingRows.map((row) => `${row.date},${row.refId},"${row.desc}",${row.type},${row.amount},${row.status}`);
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'billing_records.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="dash-billing-container">
      <div className="dash-title-row">
        <div>
          <h1 className="dash-heading">Billing Summary</h1>
          <p className="dash-subtitle">Overview of transaction volume and settlement status for the current period.</p>
        </div>
      </div>

      <div className="dash-stats-grid billing-stats-grid">
        <div className="dash-stat-card"><div className="dash-stat-header"><span className="dash-stat-title">Total Credit</span><span className="dash-stat-icon green"><Icon name="arrow-down" size={16} /></span></div><div className="dash-stat-value">{formatINR(totalCredit)}</div><div className="dash-stat-sub"><span className="dash-badge-trend green">↑ 1.1%</span> vs last month</div></div>
        <div className="dash-stat-card"><div className="dash-stat-header"><span className="dash-stat-title">Total Debit</span><span className="dash-stat-icon red"><Icon name="arrow-up" size={16} /></span></div><div className="dash-stat-value">{formatINR(totalDebit)}</div><div className="dash-stat-sub"><span className="dash-badge-trend red">↓ 8.5%</span> vs last month</div></div>
        <div className="dash-stat-card"><div className="dash-stat-header"><span className="dash-stat-title">Net Cash Flow</span><span className="dash-stat-icon blue"><Icon name="bank" size={16} /></span></div><div className="dash-stat-value">{formatSignedINR(netCashFlow)}</div><div className="dash-stat-sub"><span className="dash-badge-trend green">↑ 4.2%</span> vs last month</div></div>
      </div>

      <div className="dash-charts-row billing-charts-row">
        <div className="dash-table-card">
          <div className="dash-table-header"><div><span className="dash-table-title">Billing Records</span><p className="dash-subtitle">All your credit and debit transactions in one place.</p></div><button className="dash-filter-btn" onClick={exportBillingCSV}><Icon name="download" size={14} /> Export CSV</button></div>
          <table className="dash-table">
            <thead><tr><th>Date</th><th>Transaction ID / Reference ID</th><th>Description</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>{billingRows.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>No billing records found.</td></tr> : billingRows.map((row) => <tr key={row.id}><td style={{ color: '#64748b', fontWeight: '500' }}>{row.date}</td><td className="dash-tx-id" style={{ fontSize: '12px' }}>{row.refId}</td><td style={{ fontWeight: '600', color: '#0f172a' }}>{row.desc}</td><td><span className={`dash-badge ${row.type.toLowerCase() === 'credit' ? 'completed' : 'pending'}`} style={{ textTransform: 'capitalize' }}>{row.type}</span></td><td className={row.type === 'Credit' ? 'dash-amount-green' : 'dash-amount-red'}>{row.amount}</td><td><span className={`dash-badge ${row.status.toLowerCase()}`}>{row.status}</span></td></tr>)}</tbody>
          </table>
        </div>

        <div className="dash-chart-card donut-chart-card">
          <div className="dash-chart-header"><span className="dash-chart-title">Credit vs Debit</span><button className="dash-more-btn"><Icon name="more-horizontal" size={16} /></button></div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 220 }}>
            <div style={{ position: 'relative', width: 140, height: 140 }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="54" fill="transparent" stroke="#f1f5f9" strokeWidth="18" />
                <circle cx="70" cy="70" r="54" fill="transparent" stroke="#0f172a" strokeWidth="18" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - creditRatio)} transform="rotate(-90 70 70)" strokeLinecap="round" />
                <circle cx="70" cy="70" r="54" fill="transparent" stroke="#e2e8f0" strokeWidth="18" strokeDasharray={circumference} strokeDashoffset={circumference * creditRatio} transform="rotate(155 70 70)" strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}><span style={{ fontSize: 11, color: '#94a3b8', fontWeight: '500' }}>Net</span><span style={{ fontSize: 16, color: '#0f172a', fontWeight: '800', marginTop: 2 }}>{formatSignedINR(netCashFlow)}</span></div>
            </div>
            <div style={{ display: 'flex', gap: 15, marginTop: 15 }}><div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b', fontWeight: '500' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0f172a', display: 'inline-block' }}></span>Credit ({Math.round(creditRatio * 100)}%)<span>{formatINR(totalCredit)}</span></div><div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b', fontWeight: '500' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#e2e8f0', display: 'inline-block' }}></span>Debit ({Math.round((1 - creditRatio) * 100)}%)<span>{formatINR(totalDebit)}</span></div></div>
          </div>
        </div>
      </div>

      <div className="dash-table-card">
        <div className="dash-table-header"><span className="dash-table-title">Recent Billing Activity</span><button className="dash-filter-btn" style={{ padding: '6px 12px', fontSize: '11px' }}>View All</button></div>
        <table className="dash-table"><thead><tr><th>Date</th><th>Description</th><th>Reference ID</th><th>Type</th><th>Amount</th></tr></thead><tbody>{recentRows.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>No recent billing activity.</td></tr> : recentRows.map((row) => <tr key={row.id}><td style={{ color: '#64748b', fontWeight: '500' }}>{row.date}</td><td style={{ fontWeight: '600', color: '#0f172a' }}>{row.desc}</td><td className="dash-tx-id" style={{ fontSize: '12px' }}>{row.refId}</td><td><span className={`dash-badge ${row.type.toLowerCase() === 'credit' ? 'completed' : 'pending'}`} style={{ textTransform: 'capitalize' }}>{row.type}</span></td><td className={row.type === 'Credit' ? 'dash-amount-green' : 'dash-amount-red'}>{row.amount}</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}

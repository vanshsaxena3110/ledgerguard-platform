import React, { useEffect, useState } from 'react';
import { fetchTransactionById } from '../services/api.js';

function I({ name, size = 16 }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', width: size, height: size };
  const map = {
    'arrow-left': <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>,
    printer: <><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></>,
    share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
    'file-text': <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>,
    flag: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></>,
    'sort-desc': <><path d="M11 5h10" /><path d="M11 9h7" /><path d="M11 13h4" /><path d="M3 17l3 3 3-3" /><path d="M6 18V4" /></>,
  };
  return <svg viewBox="0 0 24 24" style={{ width: size, height: size }} {...p}>{map[name]}</svg>;
}

const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not available' : date.toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', timeZoneName: 'short' });
};

const downloadTextFile = (filename, content) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

export default function TransactionDetails({ txId, onBack }) {
  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    fetchTransactionById(txId)
      .then((transaction) => {
        if (!mounted) return;
        if (!transaction) setError('Transaction not found');
        else setTx(transaction);
      })
      .catch((requestError) => mounted && setError(requestError.message || 'Unable to load transaction'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [txId]);

  if (loading || error || !tx) {
    return <div className="txd-page">
      <div className="txd-topbar"><div><span className="txd-connected-badge">Connected</span><button className="txd-back-link" onClick={onBack}><I name="arrow-left" size={14} /> Back to Ledger</button></div></div>
      <div className="txd-card"><h2 className="txd-card-title">{loading ? 'Loading transaction…' : error}</h2></div>
    </div>;
  }

  const amount = Number(tx.amount);
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const isCredit = tx.type === 'credit';
  const type = isCredit ? 'Credit' : 'Debit';
  const status = tx.status ? tx.status.charAt(0).toUpperCase() + tx.status.slice(1) : 'Not available';
  const transactionId = tx.transactionId || tx._id || 'Not available';
  const date = formatDate(tx.createdAt);
  const signedAmount = `${isCredit ? '+' : '-'}${formatINR(safeAmount)}`;
  const timeline = [{ label: status, desc: 'Current transaction status', time: date, active: true }];
  const downloadReceipt = () => downloadTextFile(`receipt-${transactionId}.txt`, [
    'LedgerGuard Official Receipt',
    `Transaction ID: ${transactionId}`,
    `Type: ${type}`,
    `Amount: ${signedAmount}`,
    `Status: ${status}`,
    `Date: ${date}`,
    `Description: ${tx.description || 'Not available'}`,
  ].join('\n'));
  const downloadAuditReport = () => downloadTextFile(`audit-report-${transactionId}.txt`, [
    'LedgerGuard Audit Report',
    `Transaction ID: ${transactionId}`,
    `Recorded: ${date}`,
    `Status: ${status}`,
    'Audit history: Not available from the current backend',
  ].join('\n'));

  return (
    <div className="txd-page">
      <div className="txd-topbar"><div><span className="txd-connected-badge">Connected</span><button className="txd-back-link" onClick={onBack}><I name="arrow-left" size={14} /> Back to Ledger</button></div><div className="txd-topbar-actions"><button className="txd-outline-btn"><I name="printer" size={14} /> Print</button><button className="txd-outline-btn"><I name="share" size={14} /> Share</button></div></div>

      <div className="txd-title-row"><div><h1 className="txd-title">{type}<span className={`txd-status-badge ${String(tx.status || '').toLowerCase()}`}>{status}</span></h1><p className="txd-ref">Ref: {transactionId} · {date}</p></div><div className="txd-amount-block"><span className="txd-amount-label">Transaction Amount</span><span className={`txd-amount ${isCredit ? 'credit' : 'debit'}`}>{signedAmount}</span></div></div>

      <div className="txd-body"><div className="txd-left">
        <div className="txd-card"><h2 className="txd-card-title">Execution Details</h2><div className="txd-detail-grid"><div><span className="txd-label">Counterparty</span><span className="txd-value-bold">Not available</span><span className="txd-value-sub">Account details not available</span></div><div><span className="txd-label">Originating Entity</span><span className="txd-value-bold">Not available</span><span className="txd-value-sub">Account details not available</span></div></div><div className="txd-detail-grid" style={{ marginTop: 16 }}><div><span className="txd-label">SWIFT / BIC</span><code className="txd-code">Not available</code></div><div><span className="txd-label">Purpose Code</span><span className="txd-value-mono">Not available</span></div></div><div style={{ marginTop: 16 }}><span className="txd-label">Memo / Notes</span><div className="txd-memo">{tx.description || 'Not available'}</div></div></div>

        <div className="txd-card"><div className="txd-card-title-row"><h2 className="txd-card-title">System Audit Log</h2><I name="sort-desc" size={15} /></div><table className="txd-audit-table"><thead><tr><th>Timestamp (UTC)</th><th>Event / Action</th><th>Actor / System</th><th>Signature ID</th></tr></thead><tbody><tr><td className="txd-mono">{date}</td><td><span className="txd-audit-event"><I name="lock" size={13} /> Transaction record</span></td><td>Not available</td><td className="txd-mono txd-sig">Not available</td></tr></tbody></table></div>
      </div><div className="txd-right">
        <div className="txd-card"><h2 className="txd-card-title">Processing Status</h2><div className="txd-timeline">{timeline.map((step, i) => <div className={`txd-timeline-item${step.active ? ' active' : ''}`} key={i}><div className="txd-timeline-dot-col"><div className={`txd-dot${step.active ? ' active' : ''}`}></div></div><div className="txd-timeline-content"><span className="txd-timeline-label">{step.label}</span><span className="txd-timeline-desc">{step.desc}</span><span className="txd-timeline-time">{step.time}</span></div></div>)}</div></div>
        <div className="txd-card"><h2 className="txd-card-title">Controls</h2><button className="txd-primary-btn" onClick={downloadReceipt}><I name="download" size={15} /> Download Official Receipt</button><button className="txd-secondary-btn" onClick={downloadAuditReport}><I name="file-text" size={15} /> Generate Audit Report</button></div>
      </div></div>
    </div>
  );
}

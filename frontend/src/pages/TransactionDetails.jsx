import React from 'react';

/* Static detail data — easy to replace with API response later */
const TX_DETAILS = {
  'TX-992384A': {
    type: 'Wire Transfer Out', refId: 'TRN-2023-88924A',
    date: 'Oct 24, 2023 · 14:32:01 UTC', status: 'Settled',
    amount: '-$1,250,000.00', amountLabel: 'Settlement Amount',
    counterparty: { name: 'Acme Global Holdings LLP', acct: '••4V2' },
    originator: { name: 'LedgerGuard Corp (US Main)', acct: '••1109' },
    swift: 'CHASUS33XXX', purposeCode: 'INVS (Investment/Capital)',
    memo: 'Q4 Capital injection for European subsidiary expansion as per board resolution #B82.',
    timeline: [
      { label: 'Settled', desc: 'Funds available to recipient', time: 'Oct 24, 14:32 UTC', active: true },
      { label: 'Processing', desc: 'Dispatched to clearing network', time: 'Oct 24, 14:20 UTC', active: false },
      { label: 'Approved', desc: 'Required signatures collected', time: 'Oct 24, 13:55 UTC', active: false },
      { label: 'Initiated', desc: 'Draft created by controller', time: 'Oct 24, 13:45 UTC', active: false },
    ],
    auditLog: [
      { time: '14:32:01', event: 'Final Settlement', actor: 'Federal Reserve ACH', sig: 'fed-sys-099' },
      { time: '14:15:22', event: 'Network Broadcast', actor: 'Treasury Core', sig: 'SVS-batch-22' },
      { time: '13:45:08', event: 'Multi-Sig Approval', actor: 'Sarah Jenkins (CFO)', sig: 'auth-key-8a2' },
    ],
  },
  'TX-881275B': {
    type: 'Wire Transfer In', refId: 'TRN-2023-81275B',
    date: 'Oct 23, 2023 · 09:15:44 UTC', status: 'Pending',
    amount: '-$42,300.00', amountLabel: 'Transfer Amount',
    counterparty: { name: 'GlobalTech Inc', acct: '••7K1' },
    originator: { name: 'LedgerGuard Corp (US Main)', acct: '••1109' },
    swift: 'DEUTDEFF', purposeCode: 'CORT (Trade Settlement)',
    memo: 'Monthly SaaS platform licensing fee — Invoice #GT-10234.',
    timeline: [
      { label: 'Settled', desc: 'Funds available to recipient', time: '—', active: false },
      { label: 'Processing', desc: 'Dispatched to clearing network', time: 'Oct 23, 09:20 UTC', active: true },
      { label: 'Approved', desc: 'Required signatures collected', time: 'Oct 23, 09:10 UTC', active: false },
      { label: 'Initiated', desc: 'Draft created by controller', time: 'Oct 23, 09:00 UTC', active: false },
    ],
    auditLog: [
      { time: '09:15:44', event: 'Network Broadcast', actor: 'Treasury Core', sig: 'SVS-batch-19' },
      { time: '09:10:12', event: 'Approval Granted', actor: 'Mark Chen (VP Finance)', sig: 'auth-key-3f1' },
    ],
  },
  'TX-770166C': {
    type: 'Wire Transfer In', refId: 'TRN-2023-70166C',
    date: 'Oct 22, 2023 · 16:48:33 UTC', status: 'Settled',
    amount: '+$89,450.25', amountLabel: 'Settlement Amount',
    counterparty: { name: 'Nexus Holdings', acct: '••9R3' },
    originator: { name: 'LedgerGuard Corp (US Main)', acct: '••1109' },
    swift: 'BOFAUS3N', purposeCode: 'GDDS (Goods Purchase)',
    memo: 'Payment received for Q3 consulting deliverables — PO #NX-4401.',
    timeline: [
      { label: 'Settled', desc: 'Funds available to recipient', time: 'Oct 22, 16:48 UTC', active: true },
      { label: 'Processing', desc: 'Dispatched to clearing network', time: 'Oct 22, 16:30 UTC', active: false },
      { label: 'Approved', desc: 'Auto-approved (below threshold)', time: 'Oct 22, 16:25 UTC', active: false },
      { label: 'Initiated', desc: 'Inbound wire received', time: 'Oct 22, 16:20 UTC', active: false },
    ],
    auditLog: [
      { time: '16:48:33', event: 'Final Settlement', actor: 'Federal Reserve ACH', sig: 'fed-sys-077' },
      { time: '16:30:10', event: 'Network Broadcast', actor: 'Treasury Core', sig: 'SVS-batch-18' },
      { time: '16:25:01', event: 'Auto-Approval', actor: 'System (Policy Engine)', sig: 'sys-auto-44' },
    ],
  },
};

/* Fallback for unknown IDs */
const DEFAULT_TX = TX_DETAILS['TX-992384A'];

/* ── Icon (tiny reusable) ── */
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

export default function TransactionDetails({ txId, onBack }) {
  const tx = TX_DETAILS[txId] || DEFAULT_TX;

  return (
    <div className="txd-page">
      {/* Top bar */}
      <div className="txd-topbar">
        <div>
          <span className="txd-connected-badge">Connected</span>
          <button className="txd-back-link" onClick={onBack}>
            <I name="arrow-left" size={14} /> Back to Ledger
          </button>
        </div>
        <div className="txd-topbar-actions">
          <button className="txd-outline-btn"><I name="printer" size={14} /> Print</button>
          <button className="txd-outline-btn"><I name="share" size={14} /> Share</button>
        </div>
      </div>

      {/* Title + Amount */}
      <div className="txd-title-row">
        <div>
          <h1 className="txd-title">
            {tx.type}
            <span className={`txd-status-badge ${tx.status.toLowerCase()}`}>{tx.status}</span>
          </h1>
          <p className="txd-ref">Ref: {tx.refId} · {tx.date}</p>
        </div>
        <div className="txd-amount-block">
          <span className="txd-amount-label">{tx.amountLabel}</span>
          <span className={`txd-amount ${tx.amount.startsWith('-') ? 'debit' : 'credit'}`}>{tx.amount}</span>
        </div>
      </div>

      {/* Two-column body */}
      <div className="txd-body">
        {/* Left Column */}
        <div className="txd-left">
          {/* Execution Details */}
          <div className="txd-card">
            <h2 className="txd-card-title">Execution Details</h2>
            <div className="txd-detail-grid">
              <div>
                <span className="txd-label">Counterparty</span>
                <span className="txd-value-bold">{tx.counterparty.name}</span>
                <span className="txd-value-sub">Acct: ending in {tx.counterparty.acct}</span>
              </div>
              <div>
                <span className="txd-label">Originating Entity</span>
                <span className="txd-value-bold">{tx.originator.name}</span>
                <span className="txd-value-sub">Acct: ending in {tx.originator.acct}</span>
              </div>
            </div>
            <div className="txd-detail-grid" style={{ marginTop: 16 }}>
              <div>
                <span className="txd-label">SWIFT / BIC</span>
                <code className="txd-code">{tx.swift}</code>
              </div>
              <div>
                <span className="txd-label">Purpose Code</span>
                <span className="txd-value-mono">{tx.purposeCode}</span>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <span className="txd-label">Memo / Notes</span>
              <div className="txd-memo">{tx.memo}</div>
            </div>
          </div>

          {/* System Audit Log */}
          <div className="txd-card">
            <div className="txd-card-title-row">
              <h2 className="txd-card-title">System Audit Log</h2>
              <I name="sort-desc" size={15} />
            </div>
            <table className="txd-audit-table">
              <thead>
                <tr>
                  <th>Timestamp (UTC)</th>
                  <th>Event / Action</th>
                  <th>Actor / System</th>
                  <th>Signature ID</th>
                </tr>
              </thead>
              <tbody>
                {tx.auditLog.map((row, i) => (
                  <tr key={i}>
                    <td className="txd-mono">{row.time}</td>
                    <td>
                      <span className="txd-audit-event">
                        <I name="lock" size={13} /> {row.event}
                      </span>
                    </td>
                    <td>{row.actor}</td>
                    <td className="txd-mono txd-sig">{row.sig}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="txd-right">
          {/* Processing Status */}
          <div className="txd-card">
            <h2 className="txd-card-title">Processing Status</h2>
            <div className="txd-timeline">
              {tx.timeline.map((step, i) => (
                <div className={`txd-timeline-item${step.active ? ' active' : ''}`} key={i}>
                  <div className="txd-timeline-dot-col">
                    <div className={`txd-dot${step.active ? ' active' : ''}`}></div>
                    {i < tx.timeline.length - 1 && <div className="txd-timeline-line"></div>}
                  </div>
                  <div className="txd-timeline-content">
                    <span className="txd-timeline-label">{step.label}</span>
                    <span className="txd-timeline-desc">{step.desc}</span>
                    <span className="txd-timeline-time">{step.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="txd-card">
            <h2 className="txd-card-title">Controls</h2>
            <button className="txd-primary-btn">
              <I name="download" size={15} /> Download Official Receipt
            </button>
            <button className="txd-secondary-btn">
              <I name="file-text" size={15} /> Generate Audit Report
            </button>
            <button className="txd-link-btn">
              <I name="flag" size={14} /> Flag / Dispute Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

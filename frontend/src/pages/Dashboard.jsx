import React, { useState, useRef, useEffect } from 'react';
import TransactionDetails from './TransactionDetails.jsx';
import Billing from './Billing.jsx';
import NewTransaction from './NewTransaction.jsx';
import Analytics from './Analytics.jsx';
import Settings from './Settings.jsx';
import { fetchTransactions, getAuthToken } from '../services/api.js';
import socket from '../socket/socket.js';


const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'transactions', label: 'Transactions', icon: 'repeat' },
  { id: 'billing', label: 'Billing', icon: 'credit-card' },
  { id: 'analytics', label: 'Analytics', icon: 'bar-chart' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const STATS = [
  { title: 'Total Balance', value: '₹12,450,', icon: 'bank', color: '#6b7280', sub: '↗ +2.4% vs last month' },
  { title: 'Total Credit', value: '₹3,240,500.0', icon: 'arrow-down', color: '#10b981', sub: 'Inbound volume (MTD)', arrow: '↓' },
  { title: 'Total Debit', value: '₹1,890,200.0', icon: 'arrow-up', color: '#ef4444', sub: 'Outbound volume (MTD)', arrow: '↑' },
  { title: 'Volume', value: '14,239', icon: 'file', color: '#3b82f6', sub: 'Processed transactions' },
];

const TRANSACTIONS = [
  { id: 'TX-992384A', date: 'Oct 24, 14:32 EST', party: 'Acme Corp', amount: '+₹125,888.90', status: 'Completed' },
  { id: 'TX-881275B', date: 'Oct 23, 09:15 EST', party: 'GlobalTech Inc', amount: '-₹42,300.00', status: 'Pending' },
  { id: 'TX-770166C', date: 'Oct 22, 16:48 EST', party: 'Nexus Holdings', amount: '+₹89,450.25', status: 'Completed' },
];

const TREND_DATA = [
  { label: 'Jan', value: 320 }, { label: 'Feb', value: 480 },
  { label: 'Mar', value: 420 }, { label: 'Apr', value: 610 },
  { label: 'May', value: 540 }, { label: 'Jun', value: 720 },
  { label: 'Jul', value: 680 }, { label: 'Aug', value: 890 },
  { label: 'Sep', value: 760 }, { label: 'Oct', value: 940 },
  { label: 'Nov', value: 870 }, { label: 'Dec', value: 1020 },
];

const FILTER_OPTIONS = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year', 'All Time'];
const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

/* ── Icon helper ── */
function Icon({ name, size = 18 }) {
  const s = { width: size, height: size };
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const icons = {
    grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>,
    repeat: <><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></>,
    'credit-card': <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></>,
    'bar-chart': <><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
    'help-circle': <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    'log-out': <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
    wifi: <><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
    bank: <><path d="M3 21h18" /><path d="M3 10h18" /><path d="M5 6l7-3 7 3" /><line x1="4" y1="10" x2="4" y2="21" /><line x1="20" y1="10" x2="20" y2="21" /><line x1="8" y1="14" x2="8" y2="17" /><line x1="12" y1="14" x2="12" y2="17" /><line x1="16" y1="14" x2="16" y2="17" /></>,
    'arrow-down': <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>,
    'arrow-up': <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>,
    'more-horizontal': <><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></>,
    'chevron-down': <><polyline points="6 9 12 15 18 9" /></>,
    'arrow-right': <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
  };
  return <svg viewBox="0 0 24 24" style={s} {...p}>{icons[name]}</svg>;
}

/* ── Dropdown ── */
function Dropdown({ options, selected, onSelect, open, onToggle }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onToggle(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onToggle]);
  return (
    <div className="dash-dropdown" ref={ref}>
      <button className="dash-filter-btn" onClick={() => onToggle(!open)}>
        <Icon name="calendar" size={14} /> {selected} <Icon name="chevron-down" size={12} />
      </button>
      {open && (
        <div className="dash-dropdown-menu">
          {options.map(o => (
            <button key={o} className={`dash-dropdown-item${o === selected ? ' active' : ''}`} onClick={() => { onSelect(o); onToggle(false); }}>{o}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Line Chart (SVG) ── */
function LineChart() {
  const [hovered, setHovered] = useState(null);
  const data = TREND_DATA;
  const w = 700, h = 200, padL = 45, padR = 15, padT = 20, padB = 30;
  const maxV = Math.max(...data.map(d => d.value));
  const minV = 0;
  const chartW = w - padL - padR, chartH = h - padT - padB;
  const sx = (i) => padL + (i / (data.length - 1)) * chartW;
  const sy = (v) => padT + (1 - (v - minV) / (maxV - minV)) * chartH;

  // Grid lines
  const gridSteps = 5;
  const gridLines = Array.from({ length: gridSteps + 1 }, (_, i) => minV + (maxV - minV) * (i / gridSteps));

  // Smooth bezier path
  const linePath = data.reduce((acc, d, i) => {
    const x = sx(i), y = sy(d.value);
    if (i === 0) return `M${x},${y}`;
    const px = sx(i - 1), py = sy(data[i - 1].value);
    const cp = (x - px) * 0.35;
    return `${acc} C${px + cp},${py} ${x - cp},${y} ${x},${y}`;
  }, '');
  const fillPath = `${linePath} L${sx(data.length - 1)},${padT + chartH} L${sx(0)},${padT + chartH} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {/* Grid */}
      {gridLines.map((v, i) => (
        <g key={i}>
          <line x1={padL} y1={sy(v)} x2={w - padR} y2={sy(v)} stroke="#f1f5f9" strokeWidth="1" />
          <text x={padL - 8} y={sy(v) + 4} textAnchor="end" fontSize="10" fill="#94a3b8">₹{Math.round(v / 1000)}k</text>
        </g>
      ))}
      {/* Area + Line */}
      <path d={fillPath} fill="url(#trendGrad)" />
      <path d={linePath} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots + Labels */}
      {data.map((d, i) => (
        <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
          <circle cx={sx(i)} cy={sy(d.value)} r={hovered === i ? 6 : 3.5} fill={hovered === i ? '#4f46e5' : '#fff'} stroke="#4f46e5" strokeWidth="2" />
          {hovered === i && (
            <>
              <line x1={sx(i)} y1={sy(d.value) + 6} x2={sx(i)} y2={padT + chartH} stroke="#4f46e5" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
              <rect x={sx(i) - 30} y={sy(d.value) - 28} width="60" height="22" rx="5" fill="#0f172a" />
              <text x={sx(i)} y={sy(d.value) - 13} textAnchor="middle" fontSize="11" fill="#fff" fontWeight="600">₹{d.value}k</text>
            </>
          )}
          <text x={sx(i)} y={h - 4} textAnchor="middle" fontSize="10" fill="#64748b">{d.label}</text>
        </g>
      ))}
    </svg>
  );
}

/* ════════════════ DASHBOARD ════════════════ */
/* ── Export CSV helper ── */
function exportCSV() {
  const header = 'Transaction ID,Date & Time,Counterparty,Amount,Status';
  const rows = TRANSACTIONS.map(t => `${t.id},${t.date},${t.party},${t.amount},${t.status}`);
  const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'transactions.csv'; a.click();
}

export default function Dashboard({ onLogout }) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [filter, setFilter] = useState('Last 30 Days');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  const [dbTransactions, setDbTransactions] = useState([]);
  const [loadingTxs, setLoadingTxs] = useState(false);

  const loadTransactions = async () => {
    setLoadingTxs(true);
    try {
      const data = await fetchTransactions();
      setDbTransactions(data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoadingTxs(false);
    }
  };

  useEffect(() => {
    loadTransactions();

    const getCompanyId = () => {
      try {
        const token = getAuthToken();
        const payload = token && JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        return payload?.companyId;
      } catch {
        return null;
      }
    };
    const joinCompany = () => {
      const companyId = getCompanyId();
      if (companyId) socket.emit('joinCompany', companyId);
    };
    const handleCreated = ({ transaction }) => {
      if (transaction) setDbTransactions((current) => [transaction, ...current.filter((tx) => tx._id !== transaction._id)]);
    };
    const handleUpdated = ({ transaction }) => {
      if (transaction) setDbTransactions((current) => current.map((tx) => tx._id === transaction._id ? transaction : tx));
    };
    const handleDeleted = ({ transactionId }) => {
      setDbTransactions((current) => current.filter((tx) => tx._id !== transactionId && tx.transactionId !== transactionId));
    };

    socket.on('connect', joinCompany);
    socket.on('transactionCreated', handleCreated);
    socket.on('transactionUpdated', handleUpdated);
    socket.on('transactionDeleted', handleDeleted);
    socket.connect();

    return () => {
      socket.off('connect', joinCompany);
      socket.off('transactionCreated', handleCreated);
      socket.off('transactionUpdated', handleUpdated);
      socket.off('transactionDeleted', handleDeleted);
      socket.disconnect();
    };
  }, []);

  const mapTx = (tx) => {
    const dateObj = new Date(tx.createdAt);
    const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
    const day = dateObj.toLocaleDateString('en-US', { day: 'numeric' });
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const formattedDate = `${month} ${day}, ${hours}:${minutes} EST`;

    const amountStr = tx.type === 'credit'
      ? `+${formatINR(tx.amount)}`
      : `-${formatINR(tx.amount)}`;

    const capStatus = tx.status ? tx.status.charAt(0).toUpperCase() + tx.status.slice(1) : 'Completed';

    return {
      id: tx.transactionId,
      date: formattedDate,
      party: tx.description || 'External Transfer',
      amount: amountStr,
      status: capStatus,
      _id: tx._id
    };
  };

  const transactionsToRender = dbTransactions.map(mapTx);

  const totalCredit = dbTransactions.reduce((total, tx) => {
    const amount = Number(tx.amount);
    return tx.type === 'credit' && Number.isFinite(amount) ? total + amount : total;
  }, 0);
  const totalDebit = dbTransactions.reduce((total, tx) => {
    const amount = Number(tx.amount);
    return tx.type === 'debit' && Number.isFinite(amount) ? total + amount : total;
  }, 0);
  const summaryValues = {
    'Total Balance': formatINR(totalCredit - totalDebit),
    'Total Credit': formatINR(totalCredit),
    'Total Debit': formatINR(totalDebit),
    Volume: dbTransactions.length.toLocaleString('en-US'),
  };

  const exportCSV = () => {
    const header = 'Transaction ID,Date & Time,Counterparty,Amount,Status';
    const rows = transactionsToRender.map(t => `${t.id},${t.date},${t.party},${t.amount},${t.status}`);
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'transactions.csv'; a.click();
  };

  return (
    <div className="dash-layout">
      {/* ── SIDEBAR ── */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-top">
          <div className="dash-logo">
            <div className="dash-logo-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <div>
              <div className="dash-logo-name">LedgerGuard</div>
              <div className="dash-logo-sub">Enterprise Finance</div>
            </div>
          </div>

          <button className="dash-new-btn" onClick={() => { setActiveNav('new-transaction'); setSelectedTx(null); }}>
            <Icon name="plus" size={15} /> New Transaction
          </button>


          <nav className="dash-nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                className={`dash-nav-item${activeNav === item.id ? ' active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                <Icon name={item.icon} size={17} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="dash-sidebar-bottom">
          <button className="dash-nav-item">
            <Icon name="help-circle" size={17} /><span>Support</span>
          </button>
          <button className="dash-nav-item" onClick={onLogout}>
            <Icon name="log-out" size={17} /><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="dash-main">
        {/* Navbar */}
        <header className="dash-navbar">
          <div className="dash-navbar-left">
            {activeNav !== 'billing' && (
              <>
                <span className={`dash-tab${!selectedTx ? ' active' : ''}`} onClick={() => setSelectedTx(null)}>Overview</span>
                {selectedTx && <span className="dash-tab active">History</span>}
              </>
            )}
          </div>
          <div className="dash-navbar-right">
            <span className="dash-system-live">
              <span className="dash-live-dot"></span> SYSTEM LIVE
            </span>
            <Icon name="wifi" size={17} />
            <div className="dash-bell-wrap">
              <Icon name="bell" size={17} />
            </div>
            <div className="dash-avatar-wrap">
              <div className="dash-avatar">A</div>
              <span className="dash-avatar-name">Admin</span>
              <Icon name="chevron-down" size={14} />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="dash-content">
          {selectedTx ? (
            <TransactionDetails txId={selectedTx} onBack={() => setSelectedTx(null)} />
          ) : activeNav === 'new-transaction' ? (
            <NewTransaction
              onCancel={() => setActiveNav('transactions')}
              onSuccess={() => {
                loadTransactions();
                setActiveNav('transactions');
              }}
            />
          ) : activeNav === 'billing' ? (
            <Billing />
          ) : activeNav === 'analytics' ? (
            <Analytics />
          ) : activeNav === 'settings' ? (
            <Settings />
          ) : activeNav === 'transactions' ? (
            /* ── Transactions Page ── */
            <>
              <div className="dash-title-row">
                <div>
                  <h1 className="dash-heading">Transactions</h1>
                  <p className="dash-subtitle">View and manage all transaction records.</p>
                </div>
                <div className="dash-title-actions">
                  <Dropdown options={FILTER_OPTIONS} selected={filter} onSelect={setFilter} open={filterOpen} onToggle={setFilterOpen} />
                  <button className="dash-filter-btn" onClick={exportCSV}>
                    <Icon name="download" size={14} /> Export
                  </button>
                </div>
              </div>
              <div className="dash-table-card">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Date &amp; Time</th>
                      <th>Counterparty</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionsToRender.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                          No transactions found. Click "+ New Transaction" to create one.
                        </td>
                      </tr>
                    ) : (
                      transactionsToRender.map((t, i) => (
                        <tr key={i}>
                          <td className="dash-tx-id">{t.id}</td>
                          <td>{t.date}</td>
                          <td>
                            <span className="dash-party">
                              <span className="dash-party-dot"></span>
                              {t.party}
                            </span>
                          </td>
                          <td className={t.amount.startsWith('+') ? 'dash-amount-green' : 'dash-amount-red'}>{t.amount}</td>
                          <td><span className={`dash-badge ${t.status.toLowerCase()}`}>{t.status}</span></td>
                          <td>
                            <button className="dash-action-btn" onClick={() => setSelectedTx(t.id)}>
                              <Icon name="eye" size={15} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            /* ── Dashboard Overview ── */
            <>
              {/* Title Row */}
              <div className="dash-title-row">
                <div>
                  <h1 className="dash-heading">Financial Overview</h1>
                  <p className="dash-subtitle">Real-time enterprise liquidity and transaction volume.</p>
                </div>
                <div className="dash-title-actions">
                  <Dropdown options={FILTER_OPTIONS} selected={filter} onSelect={setFilter} open={filterOpen} onToggle={setFilterOpen} />
                  <button className="dash-filter-btn" onClick={exportCSV}>
                    <Icon name="download" size={14} /> Export
                  </button>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="dash-stats-grid">
                {STATS.map((s, i) => (
                  <div className="dash-stat-card" key={i}>
                    <div className="dash-stat-header">
                      <span className="dash-stat-title">{s.title}</span>
                      <span className={`dash-stat-icon ${s.arrow === '↓' ? 'green' : s.arrow === '↑' ? 'red' : ''}`}>
                        <Icon name={s.icon} size={16} />
                      </span>
                    </div>
                    <div className="dash-stat-value">{summaryValues[s.title]}</div>
                    <div className="dash-stat-sub">{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="dash-chart-card dash-chart-full">
                <div className="dash-chart-header">
                  <div>
                    <span className="dash-chart-title">Monthly Trend</span>
                    <span className="dash-chart-subtitle">Transaction volume over the past 12 months (in thousands)</span>
                  </div>
                  <button className="dash-more-btn"><Icon name="more-horizontal" size={16} /></button>
                </div>
                <LineChart />
              </div>

              {/* Recent Transactions */}
              <div className="dash-table-card">
                <div className="dash-table-header">
                  <span className="dash-table-title">Recent Transactions</span>
                  <a className="dash-view-all" href="#" onClick={(e) => { e.preventDefault(); setActiveNav('transactions'); }}>View All →</a>
                </div>
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Date &amp; Time</th>
                      <th>Counterparty</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionsToRender.slice(0, 3).map((t, i) => (
                      <tr key={i}>
                        <td className="dash-tx-id">{t.id}</td>
                        <td>{t.date}</td>
                        <td>
                          <span className="dash-party">
                            <span className="dash-party-dot"></span>
                            {t.party}
                          </span>
                        </td>
                        <td className={t.amount.startsWith('+') ? 'dash-amount-green' : 'dash-amount-red'}>{t.amount}</td>
                        <td><span className={`dash-badge ${t.status.toLowerCase()}`}>{t.status}</span></td>
                        <td>
                          <button className="dash-action-btn" onClick={() => setSelectedTx(t.id)}>
                            <Icon name="eye" size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

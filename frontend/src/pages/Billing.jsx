import React, { useState } from 'react';

// Icons mapping for consistency
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

const BILLING_DATA = [
  { date: '2023-10-24', desc: 'Settlement Batch Payment', refId: 'SET-88924A', type: 'Credit', amount: '+$12,450.00' },
  { date: '2023-10-23', desc: 'SaaS Platform Fee', refId: 'FE-10234', type: 'Debit', amount: '-$150.00' },
  { date: '2023-10-22', desc: 'API Usage Overage', refId: 'FE-99401', type: 'Debit', amount: '-$45.20' },
  { date: '2023-10-20', desc: 'ACH Settlement Recipient', refId: 'SET-70166C', type: 'Credit', amount: '+$89,450.25' },
  { date: '2023-10-18', desc: 'Corporate Account Verification', refId: 'VER-44012', type: 'Credit', amount: '+$10.00' },
];

export default function Billing() {
  const [hoveredBar, setHoveredBar] = useState(null);

  const exportBillingCSV = () => {
    const header = 'Date,Description,Reference ID,Type,Amount';
    const rows = BILLING_DATA.map(r => `${r.date},"${r.desc}",${r.refId},${r.type},${r.amount}`);
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'billing_activity.csv';
    a.click();
  };

  // Monthly Transaction Activity data (matching screenshot's pattern)
  const barChartData = [
    { label: 'Oct 1', credit: 100, debit: 35 },
    { label: 'Oct 5', credit: 130, debit: 45 },
    { label: 'Oct 10', credit: 90, debit: 60 },
    { label: 'Oct 15', credit: 170, debit: 55 },
    { label: 'Oct 20', credit: 120, debit: 40 },
    { label: 'Oct 24', credit: 140, debit: 70 },
  ];

  return (
    <div className="dash-billing-container">
      {/* Heading Section */}
      <div className="dash-title-row">
        <div>
          <h1 className="dash-heading">Billing Summary</h1>
          <p className="dash-subtitle">Overview of transaction volume and settlement status for the current period.</p>
        </div>
      </div>

      {/* 3 Summary Cards */}
      <div className="dash-stats-grid billing-stats-grid">
        {/* Total Credit */}
        <div className="dash-stat-card">
          <div className="dash-stat-header">
            <span className="dash-stat-title">Total Credit</span>
            <span className="dash-stat-icon green">
              <Icon name="arrow-down" size={16} />
            </span>
          </div>
          <div className="dash-stat-value">$850,200.50</div>
          <div className="dash-stat-sub">
            <span className="dash-badge-trend green">↑ 1.1%</span> vs last month
          </div>
        </div>

        {/* Total Debit */}
        <div className="dash-stat-card">
          <div className="dash-stat-header">
            <span className="dash-stat-title">Total Debit</span>
            <span className="dash-stat-icon red">
              <Icon name="arrow-up" size={16} />
            </span>
          </div>
          <div className="dash-stat-value">$394,800.50</div>
          <div className="dash-stat-sub">
            <span className="dash-badge-trend red">↓ 8.5%</span> vs last month
          </div>
        </div>

        {/* Net Cash Flow */}
        <div className="dash-stat-card">
          <div className="dash-stat-header">
            <span className="dash-stat-title">Net Cash Flow</span>
            <span className="dash-stat-icon blue">
              <Icon name="bank" size={16} />
            </span>
          </div>
          <div className="dash-stat-value">+$455,400.00</div>
          <div className="dash-stat-sub">
            <span className="dash-badge-trend green">↑ 4.2%</span> vs last month
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="dash-charts-row billing-charts-row">
        {/* Monthly Transaction Activity (Bar Chart) */}
        <div className="dash-chart-card">
          <div className="dash-chart-header">
            <span className="dash-chart-title">Monthly Transaction Activity</span>
            <button className="dash-more-btn">
              <Icon name="more-horizontal" size={16} />
            </button>
          </div>

          <div style={{ height: 220, position: 'relative', marginTop: 15 }}>
            <svg width="100%" height="100%" viewBox="0 0 420 200" style={{ overflow: 'visible' }}>
              {/* Y Axis Grid lines */}
              {[0, 50, 100, 150, 200].map((val, idx) => {
                const y = 170 - (val / 200) * 140;
                return (
                  <g key={idx}>
                    <line x1="45" y1={y} x2="400" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                    <text x="35" y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">${val}k</text>
                  </g>
                );
              })}

              {/* Bars */}
              {barChartData.map((data, idx) => {
                const xBase = 65 + idx * 56;
                const creditHeight = (data.credit / 200) * 140;
                const debitHeight = (data.debit / 200) * 140;
                const yCredit = 170 - creditHeight;
                const yDebit = 170 - debitHeight;

                return (
                  <g key={idx} 
                     onMouseEnter={() => setHoveredBar({ idx, type: 'credit', data })} 
                     onMouseLeave={() => setHoveredBar(null)}>
                    {/* Credit Bar */}
                    <rect 
                      x={xBase} 
                      y={yCredit} 
                      width="16" 
                      height={creditHeight} 
                      rx="3" 
                      fill="#0f172a" 
                      style={{ transition: 'opacity 0.15s', opacity: hoveredBar?.idx === idx && hoveredBar?.type === 'debit' ? 0.4 : 1 }}
                    />
                    {/* Debit Bar */}
                    <rect 
                      x={xBase + 19} 
                      y={yDebit} 
                      width="16" 
                      height={debitHeight} 
                      rx="3" 
                      fill="#e2e8f0" 
                      style={{ transition: 'opacity 0.15s', opacity: hoveredBar?.idx === idx && hoveredBar?.type === 'credit' ? 0.4 : 1 }}
                    />
                    
                    {/* Labels */}
                    <text x={xBase + 17} y="185" textAnchor="middle" fontSize="10" fill="#64748b">{data.label}</text>
                  </g>
                );
              })}
            </svg>

            {/* Tooltip */}
            {hoveredBar && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 65 + hoveredBar.idx * 56,
                transform: 'translate(-30%, -110%)',
                background: '#0f172a',
                color: '#fff',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                pointerEvents: 'none',
                zIndex: 10,
              }}>
                <div style={{ fontWeight: 'bold' }}>{hoveredBar.data.label}</div>
                <div>Credit: ${hoveredBar.data.credit}k</div>
                <div>Debit: ${hoveredBar.data.debit}k</div>
              </div>
            )}
          </div>
        </div>

        {/* Credit vs Debit (Donut Chart) */}
        <div className="dash-chart-card donut-chart-card">
          <div className="dash-chart-header">
            <span className="dash-chart-title">Credit vs Debit</span>
            <button className="dash-more-btn">
              <Icon name="more-horizontal" size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 220 }}>
            <div style={{ position: 'relative', width: 140, height: 140 }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                {/* Background circle */}
                <circle cx="70" cy="70" r="54" fill="transparent" stroke="#f1f5f9" strokeWidth="18" />
                {/* Credit stroke: 68% representation */}
                <circle 
                  cx="70" 
                  cy="70" 
                  r="54" 
                  fill="transparent" 
                  stroke="#0f172a" 
                  strokeWidth="18" 
                  strokeDasharray="339.29" 
                  strokeDashoffset="108.57" 
                  transform="rotate(-90 70 70)"
                  strokeLinecap="round"
                />
                {/* Debit stroke: 32% representation */}
                <circle 
                  cx="70" 
                  cy="70" 
                  r="54" 
                  fill="transparent" 
                  stroke="#e2e8f0" 
                  strokeWidth="18" 
                  strokeDasharray="339.29" 
                  strokeDashoffset="230.72" 
                  transform="rotate(155 70 70)"
                  strokeLinecap="round"
                />
              </svg>
              {/* Inner Text */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                pointerEvents: 'none',
              }}>
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: '500' }}>Net</span>
                <span style={{ fontSize: 16, color: '#0f172a', fontWeight: '800', marginTop: 2 }}>+$455k</span>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 15, marginTop: 15 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b', fontWeight: '500' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0f172a', display: 'inline-block' }}></span>
                Credit (68%)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b', fontWeight: '500' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#e2e8f0', display: 'inline-block' }}></span>
                Debit (32%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Billing Activity Table */}
      <div className="dash-table-card">
        <div className="dash-table-header">
          <span className="dash-table-title">Recent Billing Activity</span>
          <button className="dash-filter-btn" onClick={exportBillingCSV} style={{ padding: '6px 12px', fontSize: '11px' }}>
            Export CSV
          </button>
        </div>
        <table className="dash-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Reference ID</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {BILLING_DATA.map((row, idx) => (
              <tr key={idx}>
                <td style={{ color: '#64748b', fontWeight: '500' }}>{row.date}</td>
                <td style={{ fontWeight: '600', color: '#0f172a' }}>{row.desc}</td>
                <td className="dash-tx-id" style={{ fontSize: '12px' }}>{row.refId}</td>
                <td>
                  <span className={`dash-badge ${row.type.toLowerCase() === 'credit' ? 'completed' : 'pending'}`} style={{ textTransform: 'capitalize' }}>
                    {row.type}
                  </span>
                </td>
                <td className={row.type.toLowerCase() === 'credit' ? 'dash-amount-green' : 'dash-amount-red'}>
                  {row.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

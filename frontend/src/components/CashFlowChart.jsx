import React from 'react';

const revenue = [76, 92, 60, 124, 146, 134, 186, 174, 202, 262];
const expenses = [35, 46, 40, 42, 65, 52, 78, 70, 82, 95];
const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

export default function CashFlowChart() {
  const x = (i) => 48 + i * 58;
  const y = (value) => 188 - (value / 300) * 150;
  const line = (values) => values.map((value, i) => `${i ? 'L' : 'M'} ${x(i)} ${y(value)}`).join(' ');
  const area = `${line(revenue)} L ${x(revenue.length - 1)} 188 L ${x(0)} 188 Z`;

  return (
    <div className="analytics-chart-wrap cash-flow-chart">
      <svg viewBox="0 0 590 220" role="img" aria-label="Cash flow trends line chart">
        <defs><linearGradient id="cashFlowFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#334155" stopOpacity=".16" /><stop offset="1" stopColor="#334155" stopOpacity=".02" /></linearGradient></defs>
        {[0, 60, 120, 180, 240, 300].map((value) => <g key={value}><line x1="48" x2="570" y1={y(value)} y2={y(value)} className="analytics-grid-line" /><text x="40" y={y(value) + 4} textAnchor="end">${value}k</text></g>)}
        <path d={area} fill="url(#cashFlowFill)" />
        <path d={line(revenue)} className="analytics-revenue-line" />
        <path d={line(expenses)} className="analytics-expense-line" />
        {labels.map((label, i) => <text key={label} x={x(i)} y="210" textAnchor="middle">{label}</text>)}
      </svg>
      <div className="analytics-chart-legend"><span><i className="legend-revenue" /> Revenue</span><span><i className="legend-expenses" /> Expenses</span></div>
    </div>
  );
}

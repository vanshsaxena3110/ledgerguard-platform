import React from 'react';

export default function CashFlowChart({ data = [] }) {
  const labels = data.map((item) => item.label);
  const revenue = data.map((item) => Number.isFinite(Number(item.revenue)) ? Number(item.revenue) : 0);
  const expenses = data.map((item) => Number.isFinite(Number(item.expenses)) ? Number(item.expenses) : 0);
  const maxAmount = Math.max(...revenue, ...expenses, 0);
  const axisStep = maxAmount ? Math.max(5000, Math.ceil(maxAmount / 25000) * 5000) : 5000;
  const axisMax = axisStep * 5;
  const axisValues = Array.from({ length: 6 }, (_, i) => i * axisStep);
  const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  const x = (i) => labels.length > 1 ? 48 + i * (522 / (labels.length - 1)) : 48;
  const y = (value) => 188 - (value / axisMax) * 150;
  const line = (values) => values.map((value, i) => `${i ? 'L' : 'M'} ${x(i)} ${y(value)}`).join(' ');
  const area = data.length ? `${line(revenue)} L ${x(revenue.length - 1)} 188 L ${x(0)} 188 Z` : '';

  return (
    <div className="analytics-chart-wrap cash-flow-chart">
      <svg viewBox="0 0 590 220" role="img" aria-label="Cash flow trends line chart">
        <defs><linearGradient id="cashFlowFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#334155" stopOpacity=".16" /><stop offset="1" stopColor="#334155" stopOpacity=".02" /></linearGradient></defs>
        {axisValues.map((value) => <g key={value}><line x1="48" x2="570" y1={y(value)} y2={y(value)} className="analytics-grid-line" /><text x="40" y={y(value) + 4} textAnchor="end">{formatINR(value)}</text></g>)}
        <path d={area} fill="url(#cashFlowFill)" />
        <path d={line(revenue)} className="analytics-revenue-line" />
        <path d={line(expenses)} className="analytics-expense-line" />
        {labels.map((label, i) => <text key={`${label}-${i}`} x={x(i)} y="210" textAnchor="middle">{label}</text>)}
      </svg>
      <div className="analytics-chart-legend"><span><i className="legend-revenue" /> Revenue</span><span><i className="legend-expenses" /> Expenses</span></div>
    </div>
  );
}

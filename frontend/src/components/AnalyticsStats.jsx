import React from 'react';

const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

export default function AnalyticsStats({ totalRevenue = 0, totalExpenses = 0 }) {
  const stats = [
    { label: 'TOTAL REVENUE', value: formatINR(totalRevenue), change: '+12.5% vs last month', positive: true },
    { label: 'TOTAL EXPENSES', value: formatINR(totalExpenses), change: '-3.2% vs last month', positive: false },
  ];

  return (
    <div className="analytics-stats">
      {stats.map((stat) => (
        <div className="analytics-stat-card" key={stat.label}>
          <span className="analytics-stat-label">{stat.label}</span>
          <strong>{stat.value}</strong>
          <span className={`analytics-stat-change ${stat.positive ? 'positive' : 'negative'}`}>
            {stat.change}
          </span>
        </div>
      ))}
    </div>
  );
}

import React from 'react';

const stats = [
  { label: 'TOTAL REVENUE', value: '$1.24M', change: '+12.5% vs last month', positive: true },
  { label: 'TOTAL EXPENSES', value: '$842K', change: '-3.2% vs last month', positive: false },
];

export default function AnalyticsStats() {
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

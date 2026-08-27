import React from 'react';
import AnalyticsStats from '../components/AnalyticsStats.jsx';
import CashFlowChart from '../components/CashFlowChart.jsx';
import TransactionVolumeChart from '../components/TransactionVolumeChart.jsx';
import CategoryDistribution from '../components/CategoryDistribution.jsx';

export default function Analytics() {
  const exportAnalytics = () => {
    const blob = new Blob(['Metric,Value\nTotal Revenue,$1.24M\nTotal Expenses,$842K'], { type: 'text/csv' });
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
        <div className="dash-title-actions"><button className="dash-filter-btn">Last 30 Days</button><button className="dash-filter-btn" onClick={exportAnalytics}>↓ &nbsp;Export</button></div>
      </div>
      <div className="analytics-grid">
        <div className="analytics-main-column">
          <section className="analytics-card analytics-cash-card"><div className="analytics-card-heading"><h2>Cash Flow Trends</h2><span className="analytics-toggle">CREDIT VS DEBIT</span></div><CashFlowChart /></section>
          <section className="analytics-card"><div className="analytics-card-heading"><h2>Daily Transaction Volume</h2><span className="analytics-period"><b>7D</b><strong>30D</strong></span></div><TransactionVolumeChart /></section>
        </div>
        <div className="analytics-side-column"><section className="analytics-card analytics-category-card"><div className="analytics-card-heading"><h2>Category Distribution</h2><span className="analytics-more">⋮</span></div><CategoryDistribution /></section><AnalyticsStats /></div>
      </div>
    </div>
  );
}

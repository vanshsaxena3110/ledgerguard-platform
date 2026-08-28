import React from 'react';

export default function TransactionVolumeChart({ data = [] }) {
  const maxValue = 35;

  return (
    <div className="analytics-volume-chart">
      <div className="analytics-volume-axis">{[35, 30, 25, 20, 15, 10, 5, 0].map((n) => <span key={n}>{n}</span>)}</div>
      <div className="analytics-volume-bars">{data.map((item, i) => <span key={`${item.label}-${i}`} style={{ height: `${(Math.min(item.value, maxValue) / maxValue) * 100}%` }} title={`${item.value} transactions`} />)}</div>
      <div className="analytics-volume-labels">{data.length ? [0, 6, 13, 20, 27].map((index) => data[index] && <span key={index}>{data[index].label}</span>) : null}</div>
    </div>
  );
}

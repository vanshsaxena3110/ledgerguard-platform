import React from 'react';

const values = [13, 9, 16, 12, 20, 17, 15, 18, 23, 27, 24, 19, 15, 12, 16, 25, 29, 26, 23, 20, 17, 14, 12, 18, 23, 28, 25, 30, 26, 22];

export default function TransactionVolumeChart() {
  return (
    <div className="analytics-volume-chart">
      <div className="analytics-volume-axis">{[35, 30, 25, 20, 15, 10, 5, 0].map((n) => <span key={n}>{n}</span>)}</div>
      <div className="analytics-volume-bars">{values.map((value, i) => <span key={i} style={{ height: `${(value / 35) * 100}%` }} title={`${value} transactions`} />)}</div>
      <div className="analytics-volume-labels"><span>1</span><span>7</span><span>14</span><span>21</span><span>28</span></div>
    </div>
  );
}

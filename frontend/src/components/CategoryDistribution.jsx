import React from 'react';

const categories = [
  { name: 'Software', value: '45%', color: '#0f172a' },
  { name: 'Hardware', value: '30%', color: '#64748b' },
  { name: 'Services', value: '25%', color: '#cbd5e1' },
];

export default function CategoryDistribution() {
  return (
    <div className="category-distribution">
      <div className="analytics-donut" />
      <div className="category-legend">{categories.map((category) => <div key={category.name}><i style={{ background: category.color }} /> <span>{category.name}</span><b>{category.value}</b></div>)}</div>
    </div>
  );
}

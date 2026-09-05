'use client';

import React from 'react';

export default function Sparkline({ data = [], isPositive = true, width = 75, height = 24 }) {
  if (!data || data.length < 2) {
    // Generate gentle realistic wave if no data
    data = isPositive ? [10, 11, 10.5, 12, 11.8, 13, 12.5, 14] : [14, 13.5, 14, 12.8, 13, 11.5, 12, 10.5];
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 3;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const strokeColor = isPositive ? '#a3e635' : '#ef4444';

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible"
      viewBox={`0 0 ${width} ${height}`}
    >
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points.join(' ')}
      />
    </svg>
  );
}

import React from 'react';
import { Panel } from './ui.jsx';
import { C } from '../styles.js';
import { depthProfile, impactFunction } from '../math.js';

export default function DepthProfile({ alpha = 0.6, currentDelta = 0 }) {
  const W = 900, H = 220;
  const pad = 36;
  const dMin = -5, dMax = 5;
  const sx = (d) => pad + ((d - dMin) / (dMax - dMin)) * (W - pad - 10);
  const cy = H - pad;

  const N = 120;
  const depthPts = [];
  const impactPts = [];
  for (let i = 0; i <= N; i++) {
    const d = dMin + (i / N) * (dMax - dMin);
    const D = depthProfile(alpha, d);
    const lam = Math.min(impactFunction(alpha, d), 8);
    depthPts.push([sx(d), cy - D * (H - pad - 10)]);
    impactPts.push([sx(d), cy - (lam / 8) * (H - pad - 10)]);
  }

  // split bids/asks at 0
  const bidsArea = [`M${sx(dMin)},${cy}`, ...depthPts.filter(p => p[0] <= sx(0)).map(p => `L${p[0]},${p[1]}`), `L${sx(0)},${cy} Z`].join(' ');
  const asksArea = [`M${sx(0)},${cy}`, ...depthPts.filter(p => p[0] >= sx(0)).map(p => `L${p[0]},${p[1]}`), `L${sx(dMax)},${cy} Z`].join(' ');
  const impactPath = 'M' + impactPts.map(p => `${p[0]},${p[1]}`).join(' L');

  const cdClamped = Math.max(dMin, Math.min(dMax, currentDelta));

  return (
    <Panel title="Depth Profile  ·  D(δ) = e^(−α|δ|)   ·   Impact λ(δ) = α / D(δ)">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ background: '#05050a', border: `1px solid ${C.border}`, borderRadius: 4 }}>
        <line x1={pad} y1={cy} x2={W - 4} y2={cy} stroke={C.border} />
        <line x1={sx(0)} y1={4} x2={sx(0)} y2={cy} stroke={C.dim} strokeDasharray="2 3" />
        <text x={sx(0) + 4} y={14} fill={C.dim} fontSize={10}>consensus φ*</text>
        <path d={bidsArea} fill={C.long} fillOpacity={0.35} stroke={C.long} />
        <path d={asksArea} fill={C.short} fillOpacity={0.35} stroke={C.short} />
        <path d={impactPath} fill="none" stroke={C.gold} strokeWidth={1.5} strokeDasharray="3 2" />
        {/* current delta marker */}
        <line x1={sx(cdClamped)} y1={4} x2={sx(cdClamped)} y2={cy} stroke={C.pink} strokeWidth={1.5} />
        <text x={sx(cdClamped) + 4} y={cy - 6} fill={C.pink} fontSize={10}>δ = {currentDelta.toFixed(2)}</text>

        <text x={pad} y={H - 8} fill={C.long} fontSize={10}>BIDS</text>
        <text x={W - 12} y={H - 8} fill={C.short} fontSize={10} textAnchor="end">ASKS</text>
        <text x={W - 12} y={20} fill={C.gold} fontSize={10} textAnchor="end">— λ(δ) impact</text>
      </svg>
    </Panel>
  );
}

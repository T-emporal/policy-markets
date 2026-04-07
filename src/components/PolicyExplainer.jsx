import React, { useState } from 'react';
import { Panel, Slider } from './ui.jsx';
import { C } from '../styles.js';

export default function PolicyExplainer() {
  const [phi, setPhi] = useState(0.3);
  const [w, setW] = useState(1.5);
  const [q, setQ] = useState(2);

  const W = 560, H = 220;
  const cx = W / 2, cy = H / 2;
  // drift line: tilted by phi
  const slope = Math.tan(phi * 0.6);
  const x1 = 20, x2 = W - 20;
  const y1 = cy - slope * (x1 - cx);
  const y2 = cy - slope * (x2 - cx);

  // sensitivity zones: bands above/below
  const band = 40 * w;
  const intensity = Math.min(0.8, 0.15 + w * 0.18);

  return (
    <Panel title="What is a Policy?">
      <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
        A policy is a committed rebalancing program: <span style={{ color: C.accent }}>(φ, w, q)</span> — drift angle, sensitivity, size.
        BTC itself is the trivial policy <span style={{ color: C.gold }}>(φ*, 1, 1)</span>: consensus drift, unit sensitivity, unit size.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 18 }}>
        <div>
          <Slider label="φ  drift angle" min={-2} max={2} step={0.01} val={phi} onChange={setPhi} color={C.accent} />
          <Slider label="w  sensitivity" min={0.1} max={3} step={0.01} val={w} onChange={setW} color={C.gold} />
          <Slider label="q  size (units)" min={0.1} max={5} step={0.01} val={q} onChange={setQ} color={C.cyan} />
        </div>
        <div>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ background: '#05050a', border: `1px solid ${C.border}`, borderRadius: 4 }}>
            {/* sell zone (above) */}
            <path d={`M${x1},${y1 - band} L${x2},${y2 - band} L${x2},${y2} L${x1},${y1} Z`} fill={C.short} fillOpacity={intensity} />
            {/* buy zone (below) */}
            <path d={`M${x1},${y1} L${x2},${y2} L${x2},${y2 + band} L${x1},${y1 + band} Z`} fill={C.long} fillOpacity={intensity} />
            {/* drift path */}
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.gold} strokeWidth={2} strokeDasharray="4 3" />
            {/* size markers */}
            {Array.from({ length: Math.round(q * 2) }).map((_, i) => {
              const t = (i + 0.5) / Math.round(q * 2);
              const x = x1 + t * (x2 - x1);
              const y = y1 + t * (y2 - y1);
              return <circle key={i} cx={x} cy={y} r={3} fill={C.gold} />;
            })}
            <text x={W - 8} y={14} fill={C.dim} fontSize={10} textAnchor="end">SELL ZONE</text>
            <text x={W - 8} y={H - 6} fill={C.dim} fontSize={10} textAnchor="end">BUY ZONE</text>
          </svg>
          <div style={{ fontSize: 11, color: C.dim, marginTop: 8, lineHeight: 1.5 }}>
            <span style={{ color: C.text }}>w = 1</span> means just holding. <span style={{ color: C.text }}>w &gt; 1</span> means actively buying dips and selling rallies around your drift. The further your drift <span style={{ color: C.accent }}>φ</span> from consensus, the stronger your conviction.
          </div>
        </div>
      </div>
    </Panel>
  );
}

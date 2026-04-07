import React from 'react';
import { Panel, Row } from './ui.jsx';
import { C } from '../styles.js';
import { marginalPrice, tilt, fmt } from '../math.js';

export default function PoolState({ pool, preview }) {
  const W = 420, H = 320;
  const pad = 36;
  // axis range based on K
  const maxAxis = Math.max(4, Math.sqrt(pool.K) * 3);
  const sx = (l) => pad + (l / maxAxis) * (W - pad - 10);
  const sy = (s) => H - pad - (s / maxAxis) * (H - pad - 10);

  // hyperbola path
  const pts = [];
  const N = 80;
  const lMin = pool.K / maxAxis;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const l = lMin + t * (maxAxis - lMin);
    const s = pool.K / l;
    pts.push(`${sx(l)},${sy(s)}`);
  }

  return (
    <Panel title="Pool State  ·  L · S = K">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ background: '#05050a', border: `1px solid ${C.border}`, borderRadius: 4 }}>
        {/* axes */}
        <line x1={pad} y1={H - pad} x2={W - 4} y2={H - pad} stroke={C.border} />
        <line x1={pad} y1={4} x2={pad} y2={H - pad} stroke={C.border} />
        <text x={W - 6} y={H - pad - 6} fill={C.dim} fontSize={10} textAnchor="end">L</text>
        <text x={pad + 6} y={12} fill={C.dim} fontSize={10}>S</text>

        {/* invariant curve */}
        <polyline points={pts.join(' ')} fill="none" stroke={C.accent} strokeWidth={1.5} strokeOpacity={0.7} />

        {/* preview */}
        {preview && (
          <>
            <line x1={sx(pool.L)} y1={sy(pool.S)} x2={sx(preview.newPool.L)} y2={sy(preview.newPool.S)} stroke={C.pink} strokeDasharray="3 3" />
            <line x1={sx(preview.newPool.L)} y1={sy(preview.newPool.S)} x2={sx(preview.newPool.L)} y2={H - pad} stroke={C.pink} strokeOpacity={0.4} strokeDasharray="2 2" />
            <line x1={sx(preview.newPool.L)} y1={sy(preview.newPool.S)} x2={pad} y2={sy(preview.newPool.S)} stroke={C.pink} strokeOpacity={0.4} strokeDasharray="2 2" />
            <circle cx={sx(preview.newPool.L)} cy={sy(preview.newPool.S)} r={5} fill="none" stroke={C.pink} strokeWidth={2} />
          </>
        )}

        {/* current */}
        <circle cx={sx(pool.L)} cy={sy(pool.S)} r={6} fill={C.gold} style={{ transition: 'cx 300ms, cy 300ms' }} />
      </svg>

      <div style={{ marginTop: 12 }}>
        <Row k="Φ_L" v={fmt(pool.phiL)} />
        <Row k="Φ_S" v={fmt(pool.phiS)} />
        <Row k="L = sinh(Φ_L)" v={fmt(pool.L)} />
        <Row k="S = sinh(Φ_S)" v={fmt(pool.S)} />
        <Row k="K = L · S" v={fmt(pool.K)} color={C.accent} />
        <Row k="P = S / L" v={fmt(marginalPrice(pool))} color={C.gold} />
        <Row k="tilt" v={fmt(tilt(pool))} />
      </div>
    </Panel>
  );
}

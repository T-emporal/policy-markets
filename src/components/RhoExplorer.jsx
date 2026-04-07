import React from 'react';
import { Panel } from './ui.jsx';
import { C } from '../styles.js';
import { sinh } from '../math.js';

export default function RhoExplorer({ pool, currentDphi, currentRho }) {
  const W = 900, H = 320;
  const pad = 40;
  const xMin = 0, xMax = 3;
  const yMin = 0, yMax = 1;
  const sx = (x) => pad + ((x - xMin) / (xMax - xMin)) * (W - pad - 10);
  const sy = (y) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - pad - 10);

  // ρ as fn of Δφ at fixed wIn=1, for several K
  const Ks = [
    { K: 1, color: '#5b6378' },
    { K: 4, color: '#6f7aa3' },
    { K: pool.K, color: C.accent, label: 'current K' },
    { K: 25, color: '#a78bfa' },
    { K: 100, color: '#c4b5fd' },
  ];
  const wIn = 1;
  // For balanced pool L=S=sqrt(K): ρ = sqrt(K) / (sqrt(K) + sinh(Δφ))
  const curve = (K) => {
    const root = Math.sqrt(K);
    const pts = [];
    const N = 80;
    for (let i = 0; i <= N; i++) {
      const dphi = xMin + (i / N) * (xMax - xMin);
      const delta = wIn * sinh(dphi);
      const rho = root / (root + delta);
      pts.push(`${sx(dphi)},${sy(rho)}`);
    }
    return pts.join(' ');
  };

  return (
    <Panel title="Sensitivity Ratio Explorer  ·  ρ = S / (L + δ)">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ background: '#05050a', border: `1px solid ${C.border}`, borderRadius: 4 }}>
        <line x1={pad} y1={H - pad} x2={W - 4} y2={H - pad} stroke={C.border} />
        <line x1={pad} y1={4} x2={pad} y2={H - pad} stroke={C.border} />
        <text x={W - 6} y={H - pad - 6} fill={C.dim} fontSize={10} textAnchor="end">Δφ  drift gap</text>
        <text x={pad + 6} y={14} fill={C.dim} fontSize={10}>ρ</text>
        {/* y ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map((y) => (
          <g key={y}>
            <line x1={pad} y1={sy(y)} x2={W - 4} y2={sy(y)} stroke={C.border} strokeOpacity={0.4} />
            <text x={pad - 6} y={sy(y) + 3} fill={C.dim} fontSize={9} textAnchor="end">{y}</text>
          </g>
        ))}
        {[0, 1, 2, 3].map((x) => (
          <text key={x} x={sx(x)} y={H - pad + 14} fill={C.dim} fontSize={9} textAnchor="middle">{x}</text>
        ))}

        {Ks.map((k, i) => (
          <polyline key={i} points={curve(k.K)} fill="none" stroke={k.color} strokeWidth={i === 2 ? 2.2 : 1} strokeOpacity={i === 2 ? 1 : 0.6} />
        ))}

        {/* labels */}
        {Ks.map((k, i) => (
          <text key={i} x={W - 14} y={20 + i * 14} fill={k.color} fontSize={10} textAnchor="end">
            K = {k.K.toFixed(2)}{i === 2 ? '  ◀ current' : ''}
          </text>
        ))}

        {/* current point */}
        {currentDphi != null && currentRho != null && currentDphi >= 0 && currentDphi <= xMax && (
          <>
            <circle cx={sx(currentDphi)} cy={sy(currentRho)} r={6} fill={C.pink} />
            <text x={sx(currentDphi) + 10} y={sy(currentRho) - 6} fill={C.pink} fontSize={10}>
              Δφ = {currentDphi.toFixed(2)}, ρ = {currentRho.toFixed(4)}
            </text>
          </>
        )}
      </svg>
      <div style={{ marginTop: 10, color: C.text, fontSize: 12, lineHeight: 1.6 }}>
        <span style={{ color: C.gold }}>ρ is not a fee.</span> It is a permanent execution quality. Every future rebalance you make against this commitment fills at this ratio. Deeper pools (higher K) and smaller drift gaps yield ρ closer to 1.
      </div>
    </Panel>
  );
}

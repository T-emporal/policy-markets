import React, { useMemo, useState } from 'react';
import PolicyExplainer from './components/PolicyExplainer.jsx';
import PoolState from './components/PoolState.jsx';
import TradePanel from './components/TradePanel.jsx';
import DepthProfile from './components/DepthProfile.jsx';
import RhoExplorer from './components/RhoExplorer.jsx';
import { Pill } from './components/ui.jsx';
import { C } from './styles.js';
import { poolFromAngles, previewTrade } from './math.js';

const INITIAL = () => poolFromAngles(1.5, 1.5);

export default function App() {
  const [pool, setPool] = useState(INITIAL);
  const [side, setSide] = useState('long');
  const [phi, setPhi] = useState(0.6);
  const [wIn, setWIn] = useState(1.0);
  const [q, setQ] = useState(1.0);
  const [log, setLog] = useState([]);

  const preview = useMemo(() => previewTrade(pool, phi, wIn, side), [pool, phi, wIn, side]);

  const execute = () => {
    setPool(preview.newPool);
    setLog((l) => [...l, { side, phi, wIn, q, delta: preview.delta, rho: preview.rho, cost: preview.cost }]);
  };

  const reset = () => { setPool(INITIAL()); setLog([]); };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, padding: '32px 36px 80px' }}>
      <header style={{ marginBottom: 28, borderBottom: `1px solid ${C.border}`, paddingBottom: 18 }}>
        <div style={{ fontSize: 11, color: C.dim, letterSpacing: 2, textTransform: 'uppercase' }}>Working Paper · 2026</div>
        <h1 style={{ margin: '6px 0 4px', color: C.bright, fontSize: 26, fontWeight: 700, letterSpacing: 0.5 }}>
          Policy Markets <span style={{ color: C.accent }}>·</span> <span style={{ color: C.dim, fontSize: 16 }}>Interactive AMM</span>
        </h1>
        <div style={{ color: C.text, fontSize: 12, maxWidth: 820, lineHeight: 1.6, marginTop: 6 }}>
          A market where the traded instrument is a <span style={{ color: C.accent }}>policy</span> — a committed rebalancing program (φ, w, q).
          The AMM prices policies via a <span style={{ color: C.gold }}>sinh-product invariant</span>. The sensitivity ratio ρ is the permanent execution quality
          locked into every future rebalance.
        </div>
      </header>

      <section style={{ marginBottom: 24 }}>
        <PolicyExplainer />
      </section>

      <section style={{ marginBottom: 24, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 18 }}>
        <PoolState pool={pool} preview={preview} />
        <TradePanel
          side={side} setSide={setSide}
          phi={phi} setPhi={setPhi}
          wIn={wIn} setWIn={setWIn}
          q={q} setQ={setQ}
          preview={preview}
          onExecute={execute}
          onReset={reset}
          log={log}
        />
      </section>

      <section style={{ marginBottom: 24 }}>
        <DepthProfile alpha={0.6} currentDelta={(side === 'long' ? 1 : -1) * preview.delta} />
      </section>

      <section style={{ marginBottom: 24 }}>
        <RhoExplorer pool={pool} currentDphi={preview.dphi} currentRho={preview.rho} />
      </section>

      <footer style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18, color: C.dim, fontSize: 11 }}>
        <div style={{ marginBottom: 8 }}>
          <Pill color={C.accent}>sinh(Φ_L) · sinh(Φ_S) = K</Pill>
          <Pill color={C.gold}>ρ = S / (L + δ)</Pill>
          <Pill color={C.cyan}>BTC ≡ (φ*, 1, 1)</Pill>
          <Pill color={C.pink}>δ = w · sinh(Δφ)</Pill>
        </div>
        Policy Markets — Working Paper 2026
      </footer>
    </div>
  );
}

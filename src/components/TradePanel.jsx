import React from 'react';
import { Panel, Slider, Row } from './ui.jsx';
import { C } from '../styles.js';
import { fmt } from '../math.js';

export default function TradePanel({ side, setSide, phi, setPhi, wIn, setWIn, q, setQ, preview, onExecute, log, onReset }) {
  const sideColor = side === 'long' ? C.long : C.short;
  return (
    <Panel title="Trade  ·  Commit a Policy">
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {['long', 'short'].map((s) => (
          <button key={s} onClick={() => setSide(s)} style={{
            flex: 1,
            padding: '8px 10px',
            background: side === s ? (s === 'long' ? `${C.long}22` : `${C.short}22`) : 'transparent',
            color: side === s ? (s === 'long' ? C.long : C.short) : C.dim,
            border: `1px solid ${side === s ? (s === 'long' ? C.long : C.short) : C.border}`,
            borderRadius: 4,
            textTransform: 'uppercase',
            fontSize: 11,
            letterSpacing: 1.5,
          }}>{s}</button>
        ))}
      </div>

      <Slider label="φ  drift angle" min={-2} max={2} step={0.01} val={phi} onChange={setPhi} color={C.accent} />
      <Slider label="w_in  sensitivity" min={0.1} max={5} step={0.01} val={wIn} onChange={setWIn} color={C.gold} />
      <Slider label="q  units" min={0.1} max={5} step={0.01} val={q} onChange={setQ} color={C.cyan} />

      <div style={{ marginTop: 14, marginBottom: 14 }}>
        <Row k="Δφ  drift gap" v={fmt(preview.dphi)} />
        <Row k="δ  effective size" v={fmt(preview.delta)} color={C.pink} />
        <Row k="ρ  sensitivity ratio" v={fmt(preview.rho)} color={C.gold} />
        <Row k="w_out  received" v={fmt(preview.wOut)} />
        <Row k="w_net  net exposure" v={fmt(preview.wNet)} />
        <Row k="cost (BTC)" v={fmt(preview.cost)} color={C.cyan} />
        <Row k="slippage" v={(preview.slippage * 100).toFixed(2) + '%'} />
        <Row k="price after" v={fmt(preview.priceAfter)} color={C.gold} />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onExecute} style={{
          flex: 1,
          padding: '10px 14px',
          background: `${sideColor}22`,
          color: sideColor,
          border: `1px solid ${sideColor}`,
          borderRadius: 4,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          fontSize: 12,
          fontWeight: 700,
        }}>Execute</button>
        <button onClick={onReset} style={{
          padding: '10px 14px',
          background: 'transparent',
          color: C.dim,
          border: `1px solid ${C.border}`,
          borderRadius: 4,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          fontSize: 12,
        }}>Reset</button>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 11, color: C.dim, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Transaction log</div>
        <div style={{ maxHeight: 140, overflowY: 'auto', border: `1px solid ${C.border}`, borderRadius: 4 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ color: C.dim, background: '#05050a' }}>
                <th style={th}>#</th><th style={th}>side</th><th style={th}>φ</th><th style={th}>w_in</th><th style={th}>δ</th><th style={th}>ρ</th><th style={th}>cost</th>
              </tr>
            </thead>
            <tbody>
              {log.length === 0 && <tr><td colSpan={7} style={{ ...td, color: C.dim, textAlign: 'center' }}>no trades yet</td></tr>}
              {log.map((t, i) => (
                <tr key={i}>
                  <td style={td}>{i + 1}</td>
                  <td style={{ ...td, color: t.side === 'long' ? C.long : C.short }}>{t.side}</td>
                  <td style={td}>{fmt(t.phi, 2)}</td>
                  <td style={td}>{fmt(t.wIn, 2)}</td>
                  <td style={td}>{fmt(t.delta, 3)}</td>
                  <td style={{ ...td, color: C.gold }}>{fmt(t.rho)}</td>
                  <td style={{ ...td, color: C.cyan }}>{fmt(t.cost, 3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Panel>
  );
}

const th = { padding: '6px 8px', textAlign: 'left', fontWeight: 400, borderBottom: `1px solid ${C.border}` };
const td = { padding: '5px 8px', color: C.text, borderBottom: `1px dashed ${C.border}` };

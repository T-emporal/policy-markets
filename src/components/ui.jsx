import React from 'react';
import { C, panel, h2, label, value } from '../styles.js';

export function Panel({ title, children, style }) {
  return (
    <div style={{ ...panel, ...style }}>
      {title && <div style={h2}>{title}</div>}
      {children}
    </div>
  );
}

export function Row({ k, v, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: `1px dashed ${C.border}` }}>
      <span style={label}>{k}</span>
      <span style={{ ...value, color: color || C.bright }}>{v}</span>
    </div>
  );
}

export function Slider({ label: lab, min, max, step, val, onChange, color }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={label}>{lab}</span>
        <span style={{ ...value, color: color || C.bright }}>{(+val).toFixed(2)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={val} onChange={(e) => onChange(parseFloat(e.target.value))} style={{ accentColor: color || C.accent }} />
    </div>
  );
}

export function Pill({ children, color }) {
  const col = color || C.accent;
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      margin: '4px 6px 4px 0',
      border: `1px solid ${col}55`,
      background: `${col}11`,
      color: col,
      borderRadius: 4,
      fontSize: 11,
    }}>{children}</span>
  );
}

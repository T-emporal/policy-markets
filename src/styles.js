export const C = {
  bg: '#07070c',
  panel: '#0d0d14',
  border: '#1c1d30',
  text: '#b8bac4',
  dim: '#555770',
  bright: '#e4e6ee',
  long: '#22c55e',
  short: '#ef4444',
  accent: '#818cf8',
  gold: '#fbbf24',
  cyan: '#22d3ee',
  pink: '#f472b6',
};

export const panel = {
  background: C.panel,
  border: `1px solid ${C.border}`,
  borderRadius: 6,
  padding: 18,
};

export const h2 = {
  color: C.bright,
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: 1.5,
  textTransform: 'uppercase',
  margin: '0 0 14px 0',
};

export const label = { color: C.dim, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 };
export const value = { color: C.bright, fontSize: 13 };

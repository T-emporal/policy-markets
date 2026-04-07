export const sinh = Math.sinh;
export const cosh = Math.cosh;
export const asinh = Math.asinh;

export function poolFromAngles(phiL, phiS) {
  const L = sinh(phiL);
  const S = sinh(phiS);
  return { phiL, phiS, L, S, K: L * S };
}

export function poolFromLS(L, S) {
  return { phiL: asinh(L), phiS: asinh(S), L, S, K: L * S };
}

export function marginalPrice(pool) {
  return pool.S / pool.L;
}

export function tilt(pool) {
  return (pool.L - pool.S) / (pool.L + pool.S);
}

// consensus simplified to 0
export const CONSENSUS = 0;

export function effectiveDelta(phiTrader, wIn) {
  const dphi = Math.abs(phiTrader - CONSENSUS);
  return { dphi, delta: wIn * sinh(dphi) };
}

export function previewTrade(pool, phiTrader, wIn, side) {
  const { dphi, delta } = effectiveDelta(phiTrader, wIn);
  const isLong = side === 'long';
  let L1, S1, rho, cost;
  if (isLong) {
    // trader pushes L up, receives S out
    L1 = pool.L + delta;
    S1 = pool.K / L1;
    rho = pool.S / L1; // S / (L + delta)
    cost = (pool.S * delta) / L1; // BTC out
  } else {
    S1 = pool.S + delta;
    L1 = pool.K / S1;
    rho = pool.L / S1;
    cost = (pool.L * delta) / S1;
  }
  const wOut = wIn * rho;
  const wNet = wIn * (1 - rho);
  const newPool = poolFromLS(L1, S1);
  const priceBefore = marginalPrice(pool);
  const priceAfter = marginalPrice(newPool);
  const slippage = Math.abs(priceAfter - priceBefore) / priceBefore;
  return { dphi, delta, rho, wOut, wNet, cost, newPool, priceBefore, priceAfter, slippage };
}

export function executeTrade(pool, phiTrader, wIn, side) {
  return previewTrade(pool, phiTrader, wIn, side);
}

export function sensitivityRatio(pool, delta) {
  return pool.S / (pool.L + delta);
}

export function depthProfile(alpha, delta) {
  return Math.exp(-alpha * Math.abs(delta));
}

export function impactFunction(alpha, delta) {
  return alpha / depthProfile(alpha, delta);
}

export function executionCost(pool, delta) {
  return (pool.S * delta) / (pool.L + delta);
}

export function fmt(x, n = 4) {
  if (!isFinite(x)) return '—';
  return x.toFixed(n);
}

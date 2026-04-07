# Policy Markets

An automated market maker for committed rebalancing programs.

**[→ Interactive Explorer](https://t-emporal.github.io/policy-markets/)**

## The idea

A policy is a committed rebalancing program: (φ, w, q) — drift angle, sensitivity, size.
The AMM prices policies via a sinh-product invariant. The sensitivity ratio ρ is the
permanent execution quality locked into every future rebalance.

The underlying asset is the trivial policy at consensus drift with unit sensitivity.

## Paper

See [policy-markets-paper.pdf](./policy-markets-paper.pdf) for the full formalism.

## Develop

```
npm install
npm run dev
```

Built with React + Vite. Deployed to GitHub Pages via Actions.

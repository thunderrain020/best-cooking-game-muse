// Ember & Tide — render/heatBar.js
// HARBOUR HEAT: the rush escalation as a 3-tier bar — SIMMER, then
// WOK FLARE ×4, then STORM BOIL ×8. The tier comes from the live rush:
// a storm rush lights all three (the top tier gold on crimson), any
// other rush lights the first two. Flat solid fills only, so the bar
// stays crisp and cheap in the PNG. Split out of render/canvas.js so
// both stay under the 6 KB module cap.

import { roundRectPath } from '../core/util.js';

export function heatTier(g) {
  if (!g.rush) return 0;
  return g.rush.name.includes('STORM') ? 3 : 2;
}

const HEAT_SEGS = [
  { label: 'SIMMER', lit: '#b98a2e' },
  { label: 'WOK FLARE ×4', lit: '#e8703f' },
  { label: 'STORM BOIL ×8', lit: '#c0272d' },
];

export function drawHeatBar(ctx, g) {
  const tier = heatTier(g);
  const x0 = 440, y = 162, w = 400, h = 26, sw = w / 3;
  ctx.fillStyle = '#241a2e';
  roundRectPath(ctx, x0, y, w, h, 12); ctx.fill();
  ctx.strokeStyle = '#1a120b';
  ctx.lineWidth = 2.5;
  roundRectPath(ctx, x0, y, w, h, 12); ctx.stroke();
  ctx.save();
  // Clip the lit fills to the rounded bar so no corner pokes out.
  roundRectPath(ctx, x0, y, w, h, 12); ctx.clip();
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i < tier ? HEAT_SEGS[i].lit : '#3d2b4d';
    ctx.fillRect(x0 + i * sw, y, sw + 1, h);
    if (i) {
      ctx.fillStyle = '#ffd94d';
      ctx.fillRect(x0 + i * sw - 1, y, 2, h);
    }
  }
  ctx.restore();
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < 3; i++) {
    const lit = i < tier;
    ctx.fillStyle = lit ? (i === 2 ? '#ffd94d' : '#fff6e5') : '#9a8ab0';
    ctx.fillText(HEAT_SEGS[i].label, x0 + (i + 0.5) * sw, y + h / 2);
  }
  ctx.textBaseline = 'alphabetic';
}

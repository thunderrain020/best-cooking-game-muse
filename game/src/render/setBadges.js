// Ember & Tide — render/setBadges.js
// Set-bonus badges: the full "EMBER 3/6: +$4 Sear" pills for the
// Victory card, and the compact "EMBER 3/6 +$4" pills for the top bar.
// Only sets with 2+ pieces owned are shown — the bonus is live.

import { activeSetBonuses } from '../systems/upgrades.js';
import { roundRectPath } from '../core/util.js';

function drawBadge(ctx, x, y, w, h, text) {
  ctx.fillStyle = '#7a3b10';
  roundRectPath(ctx, x, y, w, h, h / 2); ctx.fill();
  ctx.strokeStyle = '#ffd94d'; ctx.lineWidth = 1.5;
  roundRectPath(ctx, x, y, w, h, h / 2); ctx.stroke();
  ctx.fillStyle = '#ffd94d';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + w / 2, y + h / 2);
  ctx.textBaseline = 'alphabetic';
}

// Victory card: full badges, centred on cx at y.
export function drawSetBadges(ctx, g, cx, y) {
  const sets = activeSetBonuses(g);
  if (!sets.length) return;
  ctx.save();
  ctx.font = 'bold 12px system-ui, sans-serif';
  const widths = sets.map((s) => ctx.measureText(s.set + ' ' + s.owned + '/' + s.total + ': ' + s.bonus).width + 24);
  const total = widths.reduce((a, b) => a + b, 0) + (sets.length - 1) * 8;
  let x = cx - total / 2;
  sets.forEach((s, i) => {
    drawBadge(ctx, x, y, widths[i], 20, s.set + ' ' + s.owned + '/' + s.total + ': ' + s.bonus);
    x += widths[i] + 8;
  });
  ctx.restore();
}

// Top bar: compact badges laid out left to right from x0, stopping
// before maxX so the shift timer stays clear. Returns the end x.
export function drawHudSetBadges(ctx, g, x0, y, maxX) {
  const sets = activeSetBonuses(g);
  ctx.save();
  ctx.font = 'bold 10px system-ui, sans-serif';
  let x = x0;
  for (const s of sets) {
    const t = s.set + ' ' + s.owned + '/' + s.total + ' ' + s.bonus.split(' ')[0];
    const w = ctx.measureText(t).width + 18;
    if (x + w > maxX) break;
    drawBadge(ctx, x, y, w, 22, t);
    x += w + 6;
  }
  ctx.restore();
  return x;
}

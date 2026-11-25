// Ember & Tide — ui/summaryOverlay.js
// End-of-run summary: win or lose, full run stats, the persistent best,
// and a button to cook again. Shown when the Critic is served, the
// Shift 5 target is missed, or 3 tickets walk out.

import { fmtCoins, roundRectPath } from '../core/util.js';
import { ownedBadges } from '../systems/upgrades.js';
import { dim, panel } from './titleOverlay.js';

export function drawSummary(ctx, g) {
  dim(ctx);
  panel(ctx, 280, 90, 720, 540);
  ctx.textAlign = 'center';
  const won = g.result && g.result.won;
  ctx.fillStyle = won ? '#2e7d32' : '#b03a2e';
  ctx.font = 'bold 44px Georgia, serif';
  ctx.fillText(won ? 'THE CRITIC IS WON OVER!' : 'SERVICE IS OVER', 640, 178);
  ctx.fillStyle = '#2a1a12';
  ctx.font = '18px Georgia, serif';
  ctx.fillText(g.result ? g.result.reason : '', 640, 214);
  const rows = [
    ['Dishes served', String(g.served)],
    ['Coins earned', fmtCoins(g.earned)],
    ['Best combo', 'x' + g.bestCombo],
    ['PERFECT pulls', String(g.stats.perfects)],
    ['VIP dishes served', String(g.stats.vipServed)],
    ['Tickets lost', String(g.failed) + ' / 3'],
    ['Shift reached', String(g.shift) + ' / 5'],
  ];
  ctx.font = '17px system-ui, sans-serif';
  rows.forEach(([label, value], i) => {
    const y = 258 + i * 30;
    ctx.fillStyle = '#7a5a34';
    ctx.textAlign = 'right';
    ctx.fillText(label, 600, y);
    ctx.fillStyle = '#2a1a12';
    ctx.font = 'bold 17px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(value, 660, y);
    ctx.font = '17px system-ui, sans-serif';
  });
  const badges = ownedBadges(g);
  ctx.fillStyle = '#7a5a34';
  ctx.font = '14px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(badges.length ? 'Perks this run: ' + badges.map((b) => b.name).join(' · ') : 'No perks picked up this run.', 640, 486);
  ctx.fillStyle = '#b8860b';
  ctx.font = 'bold 17px system-ui, sans-serif';
  ctx.fillText('BEST RUN: ' + fmtCoins(g.best.score) + ' earned · reached Shift ' + g.best.shift, 640, 516);
  ctx.fillStyle = '#e8703f';
  roundRectPath(ctx, 500, 540, 280, 56, 12);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText('COOK AGAIN', 640, 576);
}

export function summaryButtons() {
  return { again: { x: 500, y: 540, w: 280, h: 56 } };
}

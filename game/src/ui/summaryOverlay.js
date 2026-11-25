// Ember & Tide — ui/summaryOverlay.js
// End-of-run summary: win or lose, a Grade, shift-by-shift breakdown,
// full run stats, the persistent best, and buttons to cook again or start
// a fresh seed. Shown when the Critic is served, the Shift 5 target is
// missed, or 3 tickets walk out.

import { fmtCoins, roundRectPath } from '../core/util.js';
import { ownedBadges } from '../systems/upgrades.js';
import { dim, panel } from './titleOverlay.js';

export function gradeRun(g) {
  if (g.result && g.result.won) return g.failed === 0 ? 'S' : 'A';
  if (g.served >= 20) return 'B';
  if (g.served >= 12) return 'C';
  return 'D';
}

export function drawSummary(ctx, g) {
  dim(ctx);
  // Footer text must never show through the overlay: opaque cover.
  ctx.fillStyle = 'rgba(10,8,16,1)';
  ctx.fillRect(0, 660, 1280, 60);
  panel(ctx, 280, 90, 720, 540);
  ctx.textAlign = 'center';
  const won = g.result && g.result.won;
  ctx.fillStyle = won ? '#2e7d32' : '#b03a2e';
  ctx.font = 'bold 32px Georgia, serif';
  ctx.fillText(won ? 'THE CRITIC IS WON OVER!' : 'SERVICE IS OVER', 640, 168);
  ctx.fillStyle = '#2a1a12';
  ctx.font = '18px Georgia, serif';
  ctx.fillText(g.result ? g.result.reason : '', 640, 200);
  // Grade medallion, top-right of the panel, clear of the title text.
  const grade = gradeRun(g);
  ctx.fillStyle = '#d4a017';
  ctx.beginPath(); ctx.arc(940, 148, 32, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b';
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(940, 148, 32, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#1a120b';
  ctx.font = 'bold 32px Georgia, serif';
  ctx.fillText(grade, 940, 159);
  ctx.fillStyle = '#7a5a34';
  ctx.font = 'bold 10px system-ui, sans-serif';
  ctx.fillText('GRADE', 940, 192);
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
    const y = 244 + i * 28;
    ctx.fillStyle = '#7a5a34';
    ctx.textAlign = 'right';
    ctx.fillText(label, 600, y);
    ctx.fillStyle = '#2a1a12';
    ctx.font = 'bold 17px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(value, 660, y);
    ctx.font = '17px system-ui, sans-serif';
  });
  // 5-bar shift score chart: dishes served per shift, Critic in plum.
  const scores = g.shiftScores || [0, 0, 0, 0, 0];
  const maxS = Math.max(1, ...scores);
  ctx.fillStyle = '#7a3b5e';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DISHES PER SHIFT', 640, 428);
  scores.forEach((s, i) => {
    const bx = 462 + i * 76, bh = 8 + (s / maxS) * 30;
    ctx.fillStyle = i === 4 ? '#7a3b9e' : '#2e7d32';
    roundRectPath(ctx, bx, 468 - bh, 52, bh, 6); ctx.fill();
    ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
    roundRectPath(ctx, bx, 468 - bh, 52, bh, 6); ctx.stroke();
    // Value inside the bar, never colliding with the chart title above.
    if (bh >= 18) {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillText(String(s), bx + 26, 468 - bh + 16);
    }
    ctx.fillStyle = '#7a5a34';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillText(i === 4 ? 'CRITIC' : 'S' + (i + 1), bx + 26, 482);
  });
  const badges = ownedBadges(g);
  ctx.fillStyle = '#7a5a34';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText(badges.length ? 'Perks this run: ' + badges.map((b) => b.short).join(' · ') : 'No perks picked up this run.', 640, 500);
  ctx.fillStyle = '#b8860b';
  ctx.font = 'bold 17px system-ui, sans-serif';
  ctx.fillText('BEST RUN: ' + fmtCoins(g.best.score) + ' earned · reached Shift ' + g.best.shift, 640, 520);
  ctx.fillStyle = '#e8703f';
  roundRectPath(ctx, 400, 532, 220, 56, 12);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText('COOK AGAIN', 510, 568);
  ctx.fillStyle = '#2e7d32';
  roundRectPath(ctx, 660, 532, 220, 56, 12);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillText('NEW SEED', 770, 568);
  ctx.fillStyle = '#7a5a34';
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillText('or press Enter to cook again', 640, 612);
}

export function summaryButtons() {
  return {
    again: { x: 400, y: 532, w: 220, h: 56 },
    seed: { x: 660, y: 532, w: 220, h: 56 },
  };
}

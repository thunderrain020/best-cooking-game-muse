// Ember & Tide — ui/summaryOverlay.js
// End-of-run summary, V5: dark-navy & gold victory card. Header: chef
// mascot, gold stars, Grade medallion. Body: stats, 7-bar shift chart
// (S1..S6 + CRITIC), FEATS badge, Perks & Relics icons, DISHES SERVED
// plates. Footer: BEST RUN + COOK AGAIN / NEW SEED / ENDLESS buttons.

import { fmtCoins, roundRectPath } from '../core/util.js';
import { dishById } from '../data/recipes.js';
import { ownedBadges } from '../systems/upgrades.js';
import { drawDishPlate } from '../render/foodDishes.js';
import { drawIconBadge, drawChefMascot, drawStars } from '../render/iconBadges.js';
import { darkPanel } from '../render/palette.js';
import { TOTAL_SHIFTS } from '../core/state.js';
import { drawShiftChart, drawFeatsBadge, drawVictoryQuote } from './summaryChart.js';
import { drawSetBadges } from '../render/setBadges.js';
import { dim } from './titleOverlay.js';

export function gradeRun(g) {
  if (g.result && g.result.won) return g.failed === 0 ? 'S' : 'A';
  if (g.served >= 20) return 'B';
  if (g.served >= 12) return 'C';
  return 'D';
}

function statRows(ctx, rows, lx, vx, y0) {
  rows.forEach(([label, value], i) => {
    const y = y0 + i * 22;
    ctx.fillStyle = '#b8a67c';
    ctx.font = '14px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(label, lx, y);
    ctx.fillStyle = '#fff6e5';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(value, vx, y);
  });
}

export function drawSummary(ctx, g) {
  dim(ctx);
  ctx.fillStyle = 'rgba(8,6,12,0.92)';
  ctx.fillRect(0, 660, 1280, 60);
  darkPanel(ctx, 240, 40, 800, 640);
  const won = g.result && g.result.won;
  drawChefMascot(ctx, 330, 128, 0.85);
  ctx.textAlign = 'center';
  ctx.fillStyle = won ? '#a8d94a' : '#ff8a5c';
  ctx.font = 'bold 28px Georgia, serif';
  ctx.fillText(won ? 'THE CRITIC IS WON OVER!' : 'SERVICE IS OVER', 640, 108);
  ctx.fillStyle = '#d8cdb4';
  ctx.font = 'italic 15px Georgia, serif';
  ctx.fillText(g.result ? g.result.reason : '', 640, 134);
  drawStars(ctx, 640, 162, 3, won ? 3 : 1);
  drawVictoryQuote(ctx, g, won);
  const grade = gradeRun(g);
  const mg = ctx.createRadialGradient(940, 108, 4, 950, 118, 36);
  mg.addColorStop(0, '#ffe9a8');
  mg.addColorStop(1, '#d4a017');
  ctx.fillStyle = mg;
  ctx.beginPath(); ctx.arc(950, 118, 34, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b';
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(950, 118, 34, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#1a120b';
  ctx.font = 'bold 30px Georgia, serif';
  ctx.fillText(grade, 950, 129);
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 10px system-ui, sans-serif';
  ctx.fillText('GRADE', 950, 168);
  // FEATS badge: unlocked feats this run, out of 16.
  drawFeatsBadge(ctx, g);
  // Two-column stats.
  statRows(ctx, [
    ['Dishes served', String(g.served)],
    ['Coins earned', fmtCoins(g.earned)],
    ['Best combo', 'x' + g.bestCombo],
    ['PERFECT pulls', String(g.stats.perfects)],
  ], 560, 578, 210);
  statRows(ctx, [
    ['VIP dishes served', String(g.stats.vipServed)],
    ['Tickets lost', String(g.failed) + ' / 3'],
    ['Shift reached', String(g.shift) + ' / ' + TOTAL_SHIFTS],
    ['Critic served', g.stats.criticServed ? 'Yes' : 'No'],
  ], 920, 938, 210);
  drawShiftChart(ctx, g);
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.fillText('PERKS & RELICS THIS RUN', 640, 424);
  const badges = ownedBadges(g);
  if (badges.length) {
    const start = 640 - ((badges.length - 1) * 44) / 2;
    badges.forEach((b, i) => drawIconBadge(ctx, b.id, start + i * 44, 446, 17));
  } else {
    ctx.fillStyle = '#d8cdb4';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText('No perks picked up this run.', 640, 450);
  }
  // V8: live set-bonus badges under the perks strip.
  drawSetBadges(ctx, g, 640, 464);
  // DISHES SERVED: miniature illustrated plates.
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.fillText('DISHES SERVED', 640, 494);
  const served = (g.servedDishes || []).slice(0, 6);
  if (served.length) {
    const start = 640 - ((served.length - 1) * 108) / 2;
    served.forEach((id, i) => {
      const d = dishById(id);
      if (!d) return;
      const x = start + i * 108;
      drawDishPlate(ctx, d, x, 522, 18, 0);
      ctx.fillStyle = '#d8cdb4';
      ctx.font = '10px system-ui, sans-serif';
      ctx.fillText(d.name, x, 552);
    });
  } else {
    ctx.fillStyle = '#d8cdb4';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText('—', 640, 524);
  }
  const best = 'BEST RUN: ' + fmtCoins(g.best.score) + ' earned · reached Shift ' + g.best.shift;  ctx.font = 'bold 15px system-ui, sans-serif';
  const bw = ctx.measureText(best).width + 28;
  ctx.fillStyle = '#d4a017';
  roundRectPath(ctx, 640 - bw / 2, 556, bw, 26, 13);
  ctx.fill();
  ctx.strokeStyle = '#1a120b';
  ctx.lineWidth = 1.5;
  roundRectPath(ctx, 640 - bw / 2, 556, bw, 26, 13);
  ctx.stroke();
  ctx.fillStyle = '#1a120b';
  ctx.fillText(best, 640, 574);
  // Buttons: COOK AGAIN / NEW SEED, plus ENDLESS once unlocked.
  ctx.fillStyle = '#e8703f';
  roundRectPath(ctx, 340, 596, 200, 48, 12);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 19px system-ui, sans-serif';
  ctx.fillText('COOK AGAIN', 440, 626);
  ctx.fillStyle = '#2e7d32';
  roundRectPath(ctx, 560, 596, 200, 48, 12);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillText('NEW SEED', 660, 626);
  if (g.endlessAvailable || g.meta && g.meta.endlessUnlocked) {
    ctx.fillStyle = '#7a3b9e';
    roundRectPath(ctx, 780, 596, 200, 48, 12);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText('ENDLESS', 880, 626);
  }
  ctx.fillStyle = '#d8cdb4';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText('or press Enter to cook again', 640, 656);
}

export function summaryButtons(g) {
  const btns = {
    again: { x: 340, y: 596, w: 200, h: 48 },
    seed: { x: 560, y: 596, w: 200, h: 48 },
  };
  if (g.endlessAvailable || g.meta && g.meta.endlessUnlocked) btns.endless = { x: 780, y: 596, w: 200, h: 48 };
  return btns;
}

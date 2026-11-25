// Ember & Tide — ui/summarySections.js
// Victory-card sections, split out of ui/summaryOverlay.js (6,138 B)
// so both stay under 5 KB. Card y 22..698, with generous 16-22px gaps
// between sections: PERKS header, icon row, set-bonus pills, DISHES
// header, plates + names, BEST RUN pill, then the buttons.

import { fmtCoins, roundRectPath } from '../core/util.js';
import { TOTAL_SHIFTS } from '../core/state.js';
import { dishById } from '../data/recipes.js';
import { ownedBadges } from '../systems/upgrades.js';
import { drawDishPlate } from '../render/foodDishes.js';
import { drawIconBadge } from '../render/iconBadges.js';
import { drawSetBadges } from '../render/setBadges.js';

export const SUMMARY_CARD = { x: 240, y: 22, w: 800, h: 676 };
export const SUMMARY_SECTIONS = {
  perksHeaderY: 408,
  dishesHeaderY: 519,
  bestRunY: 602,
  buttonsY: 644,
  footerY: 712,
};

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

export function drawStatsColumns(ctx, g, y0) {
  statRows(ctx, [
    ['Dishes served', String(g.served)],
    ['Coins earned', fmtCoins(g.earned)],
    ['Best combo', 'x' + g.bestCombo],
    ['PERFECT pulls', String(g.stats.perfects)],
  ], 560, 578, y0);
  statRows(ctx, [
    ['VIP dishes served', String(g.stats.vipServed)],
    ['Tickets lost', String(g.failed) + ' / 3'],
    ['Shift reached', String(g.shift) + ' / ' + TOTAL_SHIFTS],
    ['Critic served', g.stats.criticServed ? 'Yes' : 'No'],
  ], 920, 938, y0);
}

// PERKS & RELICS: header, icon row, set-bonus pills.
export function drawPerksSection(ctx, g, headerY) {
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PERKS & RELICS THIS RUN', 640, headerY);
  const badges = ownedBadges(g);
  if (badges.length) {
    const start = 640 - ((badges.length - 1) * 44) / 2;
    badges.forEach((b, i) => drawIconBadge(ctx, b.id, start + i * 44, headerY + 36, 17));
  } else {
    ctx.fillStyle = '#d8cdb4';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText('No perks picked up this run.', 640, headerY + 40);
  }
  // V8: live set-bonus badges under the perks strip.
  drawSetBadges(ctx, g, 640, headerY + 69);
}

// DISHES SERVED: header, plates + names.
export function drawDishesSection(ctx, g, headerY) {
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DISHES SERVED', 640, headerY);
  const served = (g.servedDishes || []).slice(0, 6);
  if (served.length) {
    const start = 640 - ((served.length - 1) * 108) / 2;
    served.forEach((id, i) => {
      const d = dishById(id);
      if (!d) return;
      const x = start + i * 108;
      drawDishPlate(ctx, d, x, headerY + 35, 18, 0);
      ctx.fillStyle = '#d8cdb4';
      ctx.font = '10px system-ui, sans-serif';
      ctx.fillText(d.name, x, headerY + 63);
    });
  } else {
    ctx.fillStyle = '#d8cdb4';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText('—', 640, headerY + 36);
  }
}

// BEST RUN gold pill: text centred in the 26px pill.
export function drawBestRunPill(ctx, g, y) {
  const best = 'BEST RUN: ' + fmtCoins(g.best.score) + ' earned · reached Shift ' + g.best.shift;
  ctx.font = 'bold 15px system-ui, sans-serif';
  const bw = ctx.measureText(best).width + 28;
  ctx.fillStyle = '#d4a017';
  roundRectPath(ctx, 640 - bw / 2, y, bw, 26, 13);
  ctx.fill();
  ctx.strokeStyle = '#1a120b';
  ctx.lineWidth = 1.5;
  roundRectPath(ctx, 640 - bw / 2, y, bw, 26, 13);
  ctx.stroke();
  ctx.fillStyle = '#1a120b';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(best, 640, y + 13);
  ctx.textBaseline = 'alphabetic';
}

// COOK AGAIN / NEW SEED / ENDLESS: text centred in the 48px buttons.
export function drawSummaryButtons(ctx, g, y) {
  const btn = (x, label, fill) => {
    ctx.fillStyle = fill;
    roundRectPath(ctx, x, y, 200, 48, 12);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 19px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + 100, y + 24);
    ctx.textBaseline = 'alphabetic';
  };
  btn(340, 'COOK AGAIN', '#e8703f');
  btn(560, 'NEW SEED', '#2e7d32');
  if (g.endlessAvailable || g.meta && g.meta.endlessUnlocked) btn(780, 'ENDLESS', '#7a3b9e');
}

export function summaryButtons(g) {
  const y = SUMMARY_SECTIONS.buttonsY;
  const btns = {
    again: { x: 340, y, w: 200, h: 48 },
    seed: { x: 560, y, w: 200, h: 48 },
  };
  if (g.endlessAvailable || g.meta && g.meta.endlessUnlocked) btns.endless = { x: 780, y, w: 200, h: 48 };
  return btns;
}

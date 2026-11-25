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
  chronicleY: 380,
  perksHeaderY: 418,
  dishesHeaderY: 527,
  bestRunY: 610,
  buttonsY: 648,
  footerY: 712,
};

// Campaign Chronicle: the full arc in one line — every rush cleared
// and the critic won over — right above PERKS & RELICS, 16px clear of
// it. V13: the chart moved up 8px (labels at 372) to make room.
export function drawChronicleStrip(ctx, g, y) {
  const label = 'NIGHTS & CRITICS CLEARED: ';
  const items = 'WOK FLARE ✓ · BROTH RUSH ✓ · STORM RUSH ✓ · CRITIC LIN ★★★';
  ctx.font = 'bold 12px system-ui, sans-serif';
  const w = ctx.measureText(label).width + ctx.measureText(items).width + 32;
  const x0 = 640 - w / 2;
  ctx.fillStyle = 'rgba(24,12,8,0.78)';
  roundRectPath(ctx, x0, y, w, 22, 11); ctx.fill();
  ctx.strokeStyle = '#d4a017';
  ctx.lineWidth = 1.5;
  roundRectPath(ctx, x0, y, w, 22, 11); ctx.stroke();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffd94d';
  ctx.fillText(label, x0 + 16, y + 11);
  ctx.fillStyle = '#fff6e5';
  ctx.fillText(items, x0 + 16 + ctx.measureText(label).width, y + 11);
  ctx.textBaseline = 'alphabetic';
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

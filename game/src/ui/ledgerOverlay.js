// Ember & Tide — ui/ledgerOverlay.js
// Recipe ledger: all 12 dishes, their components and prices, in one
// readable book. VIP dishes are starred.

import { DISHES, INGREDIENTS } from '../data/recipes.js';
import { drawDishPlate } from '../render/foodDishes.js';
import { fmtCoins, roundRectPath } from '../core/util.js';
import { dim, panel } from './titleOverlay.js';

export function drawLedger(ctx, g) {
  dim(ctx);
  panel(ctx, 180, 60, 920, 600);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#2a1a12';
  ctx.font = 'bold 30px Georgia, serif';
  ctx.fillText('RECIPE LEDGER', 220, 112);
  ctx.fillStyle = '#7a5a34';
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillText('Every dish is pantry ingredients, prepared and stacked. VIP dishes pay more and ask for four.', 220, 138);
  DISHES.forEach((d, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 220 + col * 450;
    const y = 168 + row * 78;
    drawDishPlate(ctx, d, x + 34, y + 26, 26);
    ctx.fillStyle = '#2a1a12';
    ctx.font = 'bold 15px Georgia, serif';
    ctx.fillText((d.vip ? '★ ' : '') + d.name, x + 72, y + 18);
    ctx.fillStyle = '#7a5a34';
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillText(d.comps.map((c) => INGREDIENTS[c].name).join(' + '), x + 72, y + 38);
    ctx.fillStyle = '#b8860b';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillText(fmtCoins(d.price) + ' + tip', x + 72, y + 56);
  });
  ctx.fillStyle = '#5d3a1e';
  roundRectPath(ctx, 540, 600, 200, 44, 10);
  ctx.fill();
  ctx.fillStyle = '#ffe6a8';
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CLOSE  (L)', 640, 628);
}

export function ledgerButtons() {
  return { close: { x: 540, y: 600, w: 200, h: 44 } };
}

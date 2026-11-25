// Ember & Tide — ui/shopOverlay.js
// Between-shift draft, V5: a rich dark-indigo & warm-gold panel. Left
// column: chef mascot, gold stars for the completed shift, and a Recipe
// Ledger strip of illustrated dishes. Right column: upgrade + relic
// cards — pick 1 of 3 per row, with a Reroll ($10) button for fresh
// choices. The cards themselves live in ui/shopCards.js.

import { UPGRADES, RELICS } from '../systems/upgrades.js';
import { dishById } from '../data/recipes.js';
import { fmtCoins, roundRectPath } from '../core/util.js';
import { drawIngredientIcon } from '../render/foodArt.js';
import { drawDishPlate } from '../render/foodDishes.js';
import { drawChefMascot, drawStars } from '../render/iconBadges.js';
import { darkPanel } from '../render/palette.js';
import { featCount } from '../data/feats.js';
import { REROLL_COST } from '../systems/run.js';
import { CARD_X, CARD_W, CARD_H, drawCard } from './shopCards.js';
import { dim } from './titleOverlay.js';

const LEDGER = ['prawn-rice', 'fish-noodles', 'ember-prawns', 'spicy-noodles', 'tide-special'];

function drawLedgerRow(ctx, d, y) {
  drawDishPlate(ctx, d, 178, y + 18, 15, 0);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fff6e5';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.fillText(d.name, 206, y + 14);
  d.comps.forEach((c, j) => drawIngredientIcon(ctx, c, 212 + j * 20, y + 32, 7));
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.fillText(fmtCoins(d.price), 424, y + 14);
  if (d.vip) {
    ctx.fillStyle = '#e8a0f0';
    ctx.font = 'bold 10px system-ui, sans-serif';
    ctx.fillText('VIP', 424, y + 32);
  }
}

export function drawShop(ctx, g) {
  dim(ctx);
  ctx.fillStyle = 'rgba(8,6,12,0.92)';
  ctx.fillRect(0, 660, 1280, 60);
  darkPanel(ctx, 120, 48, 1040, 624);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffe6a8';
  ctx.font = 'bold 30px Georgia, serif';
  ctx.fillText('Night ' + (g.shift - 1) + ' done — the kitchen rests', 640, 100);
  ctx.fillStyle = '#ffd94d';
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillText(
    'Served ' + g.served + ' dishes · earned ' + fmtCoins(g.earned) + ' · best combo x' + g.bestCombo +
    ' · wallet ' + fmtCoins(g.coins) + ' · best run ' + fmtCoins(g.best.score) +
    ' · FEATS ' + featCount(g) + '/16',
    640, 126,
  );
  ctx.strokeStyle = 'rgba(212,160,23,0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(160, 142); ctx.lineTo(1120, 142); ctx.stroke();
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.fillText('YOUR CHEF', 290, 168);
  drawChefMascot(ctx, 290, 228, 1.0);
  drawStars(ctx, 290, 296, 3, Math.max(1, Math.min(3, g.shift - 1)));
  ctx.fillText('RECIPE LEDGER', 290, 336);
  LEDGER.forEach((id, i) => drawLedgerRow(ctx, dishById(id), 350 + i * 46));
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.fillText('KITCHEN UPGRADES — pick 1 of 3', 460, 164);
  g.shopChoices.map((id) => ({ ...UPGRADES.find((u) => u.id === id), kind: 'upgrade' }))
    .forEach((u, i) => drawCard(ctx, g, u, CARD_X[i], 176));
  ctx.textAlign = 'left';
  ctx.fillText('KITCHEN RELICS — pick 1 of 3', 460, 328);
  g.relicChoices.map((id) => ({ ...RELICS.find((r) => r.id === id), kind: 'relic' }))
    .forEach((r, i) => drawCard(ctx, g, r, CARD_X[i], 340));
  // Reroll: fresh choices for every row not picked yet, $10.
  const rerollDone = g.draftPicked.upgrades && g.draftPicked.relics;
  ctx.fillStyle = rerollDone ? '#5a5a5a' : '#7a3b10';
  roundRectPath(ctx, 460, 484, 180, 36, 10); ctx.fill();
  ctx.strokeStyle = '#ffd94d'; ctx.lineWidth = 2;
  roundRectPath(ctx, 460, 484, 180, 36, 10); ctx.stroke();
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('REROLL ' + fmtCoins(REROLL_COST), 550, 507);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#d8cdb4';
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillText('Pick 1 per row — the others lock. Reroll draws fresh choices.', 660, 507);
  ctx.fillStyle = '#2e7d32';
  roundRectPath(ctx, 500, 540, 280, 56, 12);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('START NIGHT ' + g.shift, 640, 576);
  ctx.fillStyle = '#d8cdb4';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('or press Enter', 640, 622);
}

export function shopButtons(g) {
  const btns = { next: { x: 500, y: 540, w: 280, h: 56 }, reroll: { x: 460, y: 484, w: 180, h: 36 }, cards: [], relicCards: [] };
  g.shopChoices.forEach((id, i) => btns.cards.push({ id, x: CARD_X[i], y: 176, w: CARD_W, h: CARD_H }));
  g.relicChoices.forEach((id, i) => btns.relicCards.push({ id, x: CARD_X[i], y: 340, w: CARD_W, h: CARD_H }));
  return btns;
}

// Ember & Tide — ui/shopOverlay.js
// Between-shift draft, V3: a rich dark-indigo & warm-gold panel. Left
// column: chef mascot, gold stars for the completed shift, and a Recipe
// Ledger strip of illustrated dishes. Right column: upgrade + relic
// cards, each with its own circular illustrated icon badge, a $ price
// badge, and an OWNED stamp once bought.

import { UPGRADES, RELICS } from '../systems/upgrades.js';
import { dishById } from '../data/recipes.js';
import { fmtCoins, roundRectPath } from '../core/util.js';
import { drawIngredientIcon } from '../render/foodArt.js';
import { drawDishPlate } from '../render/foodDishes.js';
import { drawIconBadge, drawChefMascot, drawStars } from '../render/iconBadges.js';
import { darkPanel } from '../render/palette.js';
import { dim } from './titleOverlay.js';

const LEDGER = ['prawn-rice', 'fish-noodles', 'ember-prawns', 'spicy-noodles', 'tide-special'];
const CARD_X = [460, 690, 920];
const CARD_W = 210;
const CARD_H = 128;

function wrap(text, width) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > width) { lines.push(line.trim()); line = w; }
    else line += ' ' + w;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

function drawCard(ctx, g, u, x, y) {
  const owned = u.kind === 'relic' ? !!g.relics[u.id] : !!g.upgrades[u.id];
  ctx.fillStyle = u.kind === 'relic' ? '#2e1e3e' : '#262040';
  roundRectPath(ctx, x, y, CARD_W, CARD_H, 10);
  ctx.fill();
  ctx.strokeStyle = owned ? '#4caf6d' : u.kind === 'relic' ? '#b06fd8' : '#d4a017';
  ctx.lineWidth = 2;
  roundRectPath(ctx, x, y, CARD_W, CARD_H, 10);
  ctx.stroke();
  drawIconBadge(ctx, u.id, x + 36, y + 36, 24);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fff6e5';
  ctx.font = 'bold 14px Georgia, serif';
  ctx.fillText(u.name, x + 68, y + 30);
  ctx.fillStyle = u.kind === 'relic' ? '#d8a0f0' : '#ffd94d';
  ctx.font = 'bold 10px system-ui, sans-serif';
  ctx.fillText(u.kind === 'relic' ? 'RELIC · ' + u.short : 'UPGRADE · ' + u.short, x + 68, y + 48);
  ctx.fillStyle = '#d8cdb4';
  ctx.font = '12px system-ui, sans-serif';
  ctx.textAlign = 'center';
  wrap(u.desc, 30).slice(0, 2).forEach((w, j) => ctx.fillText(w, x + CARD_W / 2, y + 76 + j * 16));
  const px = x + CARD_W / 2 - 42, py = y + CARD_H - 24;
  ctx.fillStyle = owned ? '#2e7d32' : '#d4a017';
  roundRectPath(ctx, px, py, 84, 20, 10);
  ctx.fill();
  ctx.strokeStyle = '#1a120b';
  ctx.lineWidth = 1.5;
  roundRectPath(ctx, px, py, 84, 20, 10);
  ctx.stroke();
  ctx.fillStyle = owned ? '#ffffff' : '#1a120b';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.fillText(owned ? 'OWNED' : fmtCoins(u.cost), x + CARD_W / 2, py + 14);
}

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
  ctx.fillText('Shift ' + (g.shift - 1) + ' done — the kitchen rests', 640, 100);
  ctx.fillStyle = '#ffd94d';
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillText(
    'Served ' + g.served + ' dishes · earned ' + fmtCoins(g.earned) + ' · best combo x' + g.bestCombo +
    ' · wallet ' + fmtCoins(g.coins) + ' · best run ' + fmtCoins(g.best.score),
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
  ctx.fillText('KITCHEN UPGRADES — pick any you can afford', 460, 164);
  g.shopChoices.map((id) => ({ ...UPGRADES.find((u) => u.id === id), kind: 'upgrade' }))
    .forEach((u, i) => drawCard(ctx, g, u, CARD_X[i], 176));
  ctx.textAlign = 'left';
  ctx.fillText('KITCHEN RELICS — rare perks for the whole run', 460, 328);
  g.relicChoices.map((id) => ({ ...RELICS.find((r) => r.id === id), kind: 'relic' }))
    .forEach((r, i) => drawCard(ctx, g, r, CARD_X[i], 340));
  ctx.textAlign = 'center';
  ctx.fillStyle = '#d8cdb4';
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillText('Upgrades and relics stay for the whole run. The next shift brings more tickets, faster.', 795, 500);
  ctx.fillStyle = '#2e7d32';
  roundRectPath(ctx, 500, 540, 280, 56, 12);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText('START SHIFT ' + g.shift, 640, 576);
  ctx.fillStyle = '#d8cdb4';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('or press Enter', 640, 622);
}

export function shopButtons(g) {
  const btns = { next: { x: 500, y: 540, w: 280, h: 56 }, cards: [], relicCards: [] };
  g.shopChoices.forEach((id, i) => btns.cards.push({ id, x: CARD_X[i], y: 176, w: CARD_W, h: CARD_H }));
  g.relicChoices.forEach((id, i) => btns.relicCards.push({ id, x: CARD_X[i], y: 340, w: CARD_W, h: CARD_H }));
  return btns;
}

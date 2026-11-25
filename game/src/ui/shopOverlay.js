// Ember & Tide — ui/shopOverlay.js
// Between-shift draft: 3 kitchen upgrade cards and 3 relic cards, all
// priced in one currency ($), plus the run stats and the next-shift
// button. Owned cards are marked OWNED instead of showing a price.

import { UPGRADES, RELICS } from '../systems/upgrades.js';
import { fmtCoins, roundRectPath } from '../core/util.js';
import { dim, panel } from './titleOverlay.js';

function wrap(text, width) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > width) {
      lines.push(line.trim());
      line = w;
    } else {
      line += ' ' + w;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

function drawCards(ctx, g, list, y, heading) {
  ctx.fillStyle = '#2a1a12';
  ctx.font = 'bold 19px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(heading, 640, y - 8);
  list.forEach((u, i) => {
    const x = 190 + i * 310;
    const owned = u.kind === 'relic' ? !!g.relics[u.id] : !!g.upgrades[u.id];
    ctx.fillStyle = owned ? '#e8e0cf' : '#fff8e6';
    ctx.strokeStyle = owned ? '#b8a67c' : u.kind === 'relic' ? '#7a3b9e' : '#d4a017';
    ctx.lineWidth = 2;
    roundRectPath(ctx, x, y, 280, 132, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = u.kind === 'relic' ? '#7a3b9e' : '#b8860b';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText(u.kind === 'relic' ? 'RELIC · ' + u.icon : 'UPGRADE · ' + u.icon, x + 140, y + 24);
    ctx.fillStyle = '#2a1a12';
    ctx.font = 'bold 18px Georgia, serif';
    ctx.fillText(u.name, x + 140, y + 50);
    ctx.fillStyle = '#7a5a34';
    ctx.font = '13px system-ui, sans-serif';
    const words = wrap(u.desc, 36);
    words.forEach((w, j) => ctx.fillText(w, x + 140, y + 76 + j * 18));
    ctx.fillStyle = owned ? '#8a8a8a' : '#b8860b';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText(owned ? 'OWNED' : fmtCoins(u.cost), x + 140, y + 118);
  });
}

export function drawShop(ctx, g) {
  dim(ctx);
  panel(ctx, 140, 56, 1000, 608);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#2a1a12';
  ctx.font = 'bold 32px Georgia, serif';
  ctx.fillText('Shift ' + (g.shift - 1) + ' done — the kitchen rests', 640, 112);
  ctx.fillStyle = '#7a5a34';
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText(
    'Served ' + g.served + ' dishes · earned ' + fmtCoins(g.earned) + ' · best combo x' + g.bestCombo +
    ' · wallet ' + fmtCoins(g.coins) + ' · best run ' + fmtCoins(g.best.score),
    640, 142,
  );
  const upgrades = g.shopChoices.map((id) => ({ ...UPGRADES.find((u) => u.id === id), kind: 'upgrade' }));
  const relics = g.relicChoices.map((id) => ({ ...RELICS.find((r) => r.id === id), kind: 'relic' }));
  drawCards(ctx, g, upgrades, 178, 'KITCHEN UPGRADES — pick any you can afford');
  drawCards(ctx, g, relics, 352, 'KITCHEN RELICS — rare perks for the whole run');
  ctx.fillStyle = '#5d3a1e';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('Upgrades and relics stay for the whole run. The next shift brings more tickets, faster.', 640, 516);
  ctx.fillStyle = '#2e7d32';
  roundRectPath(ctx, 500, 540, 280, 56, 12);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText('START SHIFT ' + g.shift, 640, 576);
  ctx.fillStyle = '#7a5a34';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('or press Enter', 640, 622);
}

export function shopButtons(g) {
  const btns = { next: { x: 500, y: 540, w: 280, h: 56 }, cards: [], relicCards: [] };
  g.shopChoices.forEach((id, i) => {
    btns.cards.push({ id, x: 190 + i * 310, y: 178, w: 280, h: 132 });
  });
  g.relicChoices.forEach((id, i) => {
    btns.relicCards.push({ id, x: 190 + i * 310, y: 352, w: 280, h: 132 });
  });
  return btns;
}

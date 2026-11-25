// Ember & Tide — ui/shopCards.js
// The draft cards in the between-shift shop: one card per upgrade or
// relic, with its circular illustrated icon badge, a $ price badge, an
// OWNED stamp once bought, and a LOCKED stamp when the row's pick-1
// draft is spent on another card. Split out of ui/shopOverlay.js so
// both files stay under the 6 KB module cap.

import { fmtCoins, roundRectPath } from '../core/util.js';
import { drawIconBadge } from '../render/iconBadges.js';
import { setCounts, RARITY_COLORS } from '../systems/upgrades.js';

export const CARD_X = [460, 690, 920];
export const CARD_W = 210;
export const CARD_H = 128;

export function wrap(text, width) {
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

export function drawCard(ctx, g, u, x, y) {
  const owned = u.kind === 'relic' ? !!g.relics[u.id] : !!g.upgrades[u.id];
  const locked = !owned && g.draftPicked && g.draftPicked[u.kind === 'relic' ? 'relics' : 'upgrades'];
  ctx.fillStyle = u.kind === 'relic' ? '#2e1e3e' : '#262040';
  roundRectPath(ctx, x, y, CARD_W, CARD_H, 10);
  ctx.fill();
  ctx.strokeStyle = owned ? '#4caf6d' : locked ? '#5a5a5a' : u.kind === 'relic' ? '#b06fd8' : '#d4a017';
  ctx.lineWidth = 2;
  roundRectPath(ctx, x, y, CARD_W, CARD_H, 10);
  ctx.stroke();
  if (locked) {
    ctx.fillStyle = 'rgba(8,6,12,0.55)';
    roundRectPath(ctx, x, y, CARD_W, CARD_H, 10);
    ctx.fill();
  }
  drawIconBadge(ctx, u.id, x + 36, y + 36, 24);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fff6e5';
  ctx.font = 'bold 14px Georgia, serif';
  ctx.fillText(u.name, x + 68, y + 30);
  // V8: rarity pill in its set colour + the set progress tag
  // ("EMBER 1/6") so the draft reads at a glance. The set tag runs
  // at 9px with a 6px gap so even the longest pair (MYTHIC +
  // "HARBOUR 2/5") stays inside the 210px card.
  const rc = RARITY_COLORS[u.rarity];
  ctx.font = 'bold 10px system-ui, sans-serif';
  const rw = ctx.measureText(u.rarity).width + 12;
  ctx.fillStyle = rc.fill;
  roundRectPath(ctx, x + 68, y + 36, rw, 16, 8); ctx.fill();
  ctx.fillStyle = rc.text;
  ctx.textAlign = 'center';
  ctx.fillText(u.rarity, x + 68 + rw / 2, y + 48);
  const sc = setCounts(g)[u.set];
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 9px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(u.set + ' ' + sc.owned + '/' + sc.total, x + 68 + rw + 6, y + 48);
  ctx.fillStyle = '#d8cdb4';
  ctx.font = '12px system-ui, sans-serif';
  ctx.textAlign = 'center';
  wrap(u.desc, 30).slice(0, 2).forEach((w, j) => ctx.fillText(w, x + CARD_W / 2, y + 76 + j * 16));
  const px = x + CARD_W / 2 - 42, py = y + CARD_H - 24;
  ctx.fillStyle = owned ? '#2e7d32' : locked ? '#5a5a5a' : '#d4a017';
  roundRectPath(ctx, px, py, 84, 20, 10);
  ctx.fill();
  ctx.strokeStyle = '#1a120b';
  ctx.lineWidth = 1.5;
  roundRectPath(ctx, px, py, 84, 20, 10);
  ctx.stroke();
  ctx.fillStyle = owned ? '#ffffff' : locked ? '#d8cdb4' : '#1a120b';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.fillText(owned ? 'OWNED' : locked ? 'LOCKED' : fmtCoins(u.cost), x + CARD_W / 2, py + 14);
}

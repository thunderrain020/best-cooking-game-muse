// Ember & Tide — render/pantry.js
// The pantry crates along the top counter (8 ingredients, 1-8), the trash
// bin, and the garnish / sauce station at the bottom right, whose counter
// holds the prepped tray. The IN HAND pill sits top-right of a crate, so
// it never covers the ingredient name below the art.

import { INGREDIENTS, INGREDIENT_ORDER } from '../data/recipes.js';
import { drawIngredientIcon } from './foodArt.js';
import { roundRectPath } from '../core/util.js';
import { contactShadow } from './feel.js';
import { stationTag } from './palette.js';
import { trayCap } from '../core/state.js';
import { crateRect, GARNISH_RECT, TRASH_RECT } from './layout.js';

export { crateRect };

// Tray slots sit on the garnish counter. Four slots in a 2x2 grid; with a
// bigger tray (upgrades) they shrink to one row of small slots.
export function trayRect(i, cap = 4) {
  if (cap > 4) return { x: 844 + i * 28, y: 588, w: 26, h: 28 };
  return { x: 924 + (i % 2) * 44, y: 564 + Math.floor(i / 2) * 44, w: 40, h: 40 };
}

const CRATE_TABS = { board: '#7a9e4a', wok: '#c96a3a', pot: '#4a5a8a' };

export function drawCrates(ctx, g) {
  INGREDIENT_ORDER.forEach((id, i) => {
    const r = crateRect(i);
    const ing = INGREDIENTS[id];
    const held = g.hand && g.hand.id === id;
    contactShadow(ctx, r.x + r.w / 2, r.y + r.h + 4, r.w / 2 - 6, 5);
    ctx.fillStyle = '#f7eedc';
    roundRectPath(ctx, r.x, r.y, r.w, r.h, 8); ctx.fill();
    ctx.strokeStyle = held ? '#d4a017' : '#1a120b';
    ctx.lineWidth = held ? 3.5 : 2;
    roundRectPath(ctx, r.x, r.y, r.w, r.h, 8); ctx.stroke();
    ctx.fillStyle = CRATE_TABS[ing.station];
    roundRectPath(ctx, r.x + 2, r.y + 2, r.w - 4, 15, 7); ctx.fill();
    ctx.fillStyle = '#1a120b';
    roundRectPath(ctx, r.x + 4, r.y + 4, 18, 12, 6); ctx.fill();
    ctx.fillStyle = '#ffd94d';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ing.key, r.x + 13, r.y + 14);
    if (held) {
      ctx.fillStyle = '#1a120b';
      roundRectPath(ctx, r.x + r.w - 42, r.y + 4, 38, 13, 6); ctx.fill();
      ctx.fillStyle = '#ffd94d';
      ctx.font = 'bold 8px system-ui, sans-serif';
      ctx.fillText('IN HAND', r.x + r.w - 23, r.y + 14);
    }
    ctx.fillStyle = '#fffaf0';
    roundRectPath(ctx, r.x + 8, r.y + 22, r.w - 16, 34, 6); ctx.fill();
    ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
    roundRectPath(ctx, r.x + 8, r.y + 22, r.w - 16, 34, 6); ctx.stroke();
    drawIngredientIcon(ctx, id, r.x + r.w / 2, r.y + 39, 19);
    ctx.fillStyle = '#1a120b';
    ctx.font = 'bold 11px Georgia, serif';
    ctx.fillText(ing.name, r.x + r.w / 2, r.y + 74);
  });
}

export function drawTrash(ctx, g) {
  const r = TRASH_RECT;
  stationTag(ctx, r.x + r.w / 2, r.y, 'TRASH BIN', 'click with hand to toss');
  contactShadow(ctx, r.x + r.w / 2, r.y + r.h + 2, 44, 6);
  ctx.fillStyle = '#3c3e48';
  roundRectPath(ctx, r.x + 16, r.y + 16, 80, 58, 8); ctx.fill();
  ctx.strokeStyle = g.hand ? '#ffd94d' : '#1a120b';
  ctx.lineWidth = g.hand ? 3 : 2;
  roundRectPath(ctx, r.x + 16, r.y + 16, 80, 58, 8); ctx.stroke();
  ctx.fillStyle = '#2a2c33';
  roundRectPath(ctx, r.x + 12, r.y + 10, 88, 12, 6); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
  roundRectPath(ctx, r.x + 12, r.y + 10, 88, 12, 6); ctx.stroke();
  ctx.fillStyle = '#ffe6a8';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TRASH', r.x + r.w / 2, r.y + 52);
  ctx.fillStyle = '#c9b48a';
  ctx.font = '10px system-ui, sans-serif';
  ctx.fillText('toss the hand', r.x + r.w / 2, r.y + 66);
}

export function drawTray(ctx, g) {
  const r = GARNISH_RECT;
  stationTag(ctx, r.x + r.w / 2, r.y, 'GARNISH & SAUCE', 'click tray to take');
  contactShadow(ctx, r.x + r.w / 2, r.y + r.h - 4, 84, 8);
  ctx.fillStyle = '#8a5a33';
  roundRectPath(ctx, r.x + 6, r.y + 12, r.w - 12, r.h - 24, 10); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2.5;
  roundRectPath(ctx, r.x + 6, r.y + 12, r.w - 12, r.h - 24, 10); ctx.stroke();
  // Sauce bottles + a herb sprig on the left half of the counter.
  const bottles = [['#c0392b', 24], ['#5a3a1e', 46], ['#4a7a3a', 68]];
  for (const [color, bx] of bottles) {
    ctx.fillStyle = color;
    roundRectPath(ctx, r.x + bx, r.y + 30, 16, 34, 5); ctx.fill();
    ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
    roundRectPath(ctx, r.x + bx, r.y + 30, 16, 34, 5); ctx.stroke();
    ctx.fillStyle = '#d8c49a';
    ctx.fillRect(r.x + bx + 5, r.y + 22, 6, 8);
    ctx.fillStyle = '#ffe6a8';
    ctx.fillRect(r.x + bx + 2, r.y + 44, 12, 10);
  }
  ctx.strokeStyle = '#4a7a3a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(r.x + 30, r.y + 76); ctx.lineTo(r.x + 30, r.y + 96); ctx.stroke();
  ctx.fillStyle = '#5a9e4a';
  ctx.beginPath(); ctx.ellipse(r.x + 24, r.y + 80, 6, 3, -0.6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(r.x + 36, r.y + 84, 6, 3, 0.6, 0, Math.PI * 2); ctx.fill();
  const cap = trayCap(g);
  for (let i = 0; i < cap; i++) {
    const s = trayRect(i, cap);
    ctx.fillStyle = 'rgba(255,246,227,0.16)';
    roundRectPath(ctx, s.x, s.y, s.w, s.h, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(26,18,11,0.6)'; ctx.lineWidth = 1.5;
    roundRectPath(ctx, s.x, s.y, s.w, s.h, 7); ctx.stroke();
    if (g.tray[i]) drawIngredientIcon(ctx, g.tray[i], s.x + s.w / 2, s.y + s.h / 2, cap > 4 ? 10 : 15);
  }
}

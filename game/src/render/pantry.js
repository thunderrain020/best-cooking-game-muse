// Ember & Tide — render/pantry.js
// The prepped tray and the pantry crates. Crates are distinct wooden and
// lacquer boxes, each with its key, station tag and ingredient art.

import { INGREDIENTS, INGREDIENT_ORDER } from '../data/recipes.js';
import { drawIngredientIcon } from './foodArt.js';
import { roundRectPath } from '../core/util.js';
import { contactShadow } from './feel.js';
import { trayCap } from '../core/state.js';

export function trayRect(i, cap = 4) {
  const w = cap > 4 ? 64 : 88;
  const step = cap > 4 ? 68 : 100;
  return { x: 310 + i * step, y: 374, w, h: 40 };
}

export function crateRect(i) {
  const cw = 966 / 8;
  return { x: 300 + i * cw + 4, y: 456, w: cw - 8, h: 138 };
}

export function drawTray(ctx, g) {
  ctx.fillStyle = 'rgba(20,10,5,0.35)';
  roundRectPath(ctx, 300, 348, 420, 76, 10); ctx.fill();
  ctx.fillStyle = '#ffe6a8';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('PREPPED TRAY — click to take', 312, 366);
  const cap = trayCap(g);
  for (let i = 0; i < cap; i++) {
    const r = trayRect(i, cap);
    ctx.fillStyle = 'rgba(255,246,227,0.14)';
    roundRectPath(ctx, r.x, r.y, r.w, r.h, 8); ctx.fill();
    if (g.tray[i]) drawIngredientIcon(ctx, g.tray[i], r.x + r.w / 2, r.y + r.h / 2, 15);
  }
}

const CRATE_TABS = { board: '#7a9e4a', wok: '#c96a3a', pot: '#4a5a8a' };

export function drawCrates(ctx, g) {
  ctx.fillStyle = '#ffe6a8';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('PANTRY — click a crate, or press 1–8', 304, 444);
  INGREDIENT_ORDER.forEach((id, i) => {
    const r = crateRect(i);
    const ing = INGREDIENTS[id];
    const held = g.hand && g.hand.id === id;
    // Warm parchment crate, 2px dark ink border, category colour tab.
    // Labels are always bold dark ink (#1a120b) — never white on cream.
    contactShadow(ctx, r.x + r.w / 2, r.y + r.h + 4, r.w / 2 - 6, 5);
    ctx.fillStyle = '#f7eedc';
    roundRectPath(ctx, r.x, r.y, r.w, r.h, 10); ctx.fill();
    ctx.strokeStyle = '#1a120b';
    ctx.lineWidth = 2;
    roundRectPath(ctx, r.x, r.y, r.w, r.h, 10); ctx.stroke();
    ctx.fillStyle = CRATE_TABS[ing.station];
    roundRectPath(ctx, r.x + 2, r.y + 2, r.w - 4, 16, 8); ctx.fill();
    if (held) {
      // Selected: gold border + IN HAND pill. Text stays dark ink.
      ctx.strokeStyle = '#d4a017';
      ctx.lineWidth = 3.5;
      roundRectPath(ctx, r.x - 2, r.y - 2, r.w + 4, r.h + 4, 12); ctx.stroke();
      ctx.fillStyle = '#1a120b';
      roundRectPath(ctx, r.x + r.w / 2 - 34, r.y + r.h - 24, 68, 18, 9); ctx.fill();
      ctx.fillStyle = '#ffd94d';
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('IN HAND', r.x + r.w / 2, r.y + r.h - 11);
    }
    // Inner cream tray so the art pops off the parchment.
    ctx.fillStyle = '#fffaf0';
    roundRectPath(ctx, r.x + 12, r.y + 38, r.w - 24, 52, 8); ctx.fill();
    ctx.strokeStyle = '#1a120b';
    ctx.lineWidth = 1.5;
    roundRectPath(ctx, r.x + 12, r.y + 38, r.w - 24, 52, 8); ctx.stroke();
    drawIngredientIcon(ctx, id, r.x + r.w / 2, r.y + 64, 26);
    ctx.fillStyle = '#1a120b';
    ctx.font = 'bold 13px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(ing.name, r.x + r.w / 2, r.y + 110);
    ctx.fillStyle = '#5a3a1e';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillText(ing.station === 'board' ? 'chop' : ing.station === 'wok' ? 'wok' : 'pot', r.x + r.w / 2, r.y + 126);
    // Key in its own dark pill on the tab: cream-on-ink, always readable.
    ctx.fillStyle = '#1a120b';
    roundRectPath(ctx, r.x + 5, r.y + 4, 20, 14, 7); ctx.fill();
    ctx.fillStyle = '#ffd94d';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(ing.key, r.x + 11, r.y + 15);
  });
}

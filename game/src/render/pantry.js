// Ember & Tide — render/pantry.js
// The prepped tray and the pantry crates. Crates are distinct wooden and
// lacquer boxes, each with its key, station tag and ingredient art.

import { INGREDIENTS, INGREDIENT_ORDER } from '../data/recipes.js';
import { drawIngredientIcon } from './foodArt.js';
import { roundRectPath } from '../core/util.js';
import { trayCap } from '../core/state.js';

export function trayRect(i, cap = 4) {
  const w = cap > 4 ? 64 : 88;
  const step = cap > 4 ? 68 : 100;
  return { x: 310 + i * step, y: 366, w, h: 40 };
}

export function crateRect(i) {
  const cw = 966 / 8;
  return { x: 300 + i * cw + 4, y: 456, w: cw - 8, h: 138 };
}

export function drawTray(ctx, g) {
  ctx.fillStyle = 'rgba(20,10,5,0.35)';
  roundRectPath(ctx, 300, 340, 420, 76, 10); ctx.fill();
  ctx.fillStyle = '#ffe6a8';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('PREPPED TRAY — click to take', 312, 358);
  const cap = trayCap(g);
  for (let i = 0; i < cap; i++) {
    const r = trayRect(i, cap);
    ctx.fillStyle = 'rgba(255,246,227,0.14)';
    roundRectPath(ctx, r.x, r.y, r.w, r.h, 8); ctx.fill();
    if (g.tray[i]) drawIngredientIcon(ctx, g.tray[i], r.x + r.w / 2, r.y + r.h / 2, 15);
  }
}

const CRATE_TINTS = ['#a8542e', '#7a9e4a', '#c9a24a', '#8a5a7a', '#4a7a8a', '#b03a2e', '#6a8a3a', '#a87a3a'];

export function drawCrates(ctx, g) {
  ctx.fillStyle = '#ffe6a8';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('PANTRY — click a crate, or press 1–8', 304, 444);
  INGREDIENT_ORDER.forEach((id, i) => {
    const r = crateRect(i);
    const ing = INGREDIENTS[id];
    const held = g.hand && g.hand.id === id;
    ctx.fillStyle = held ? '#ffe9a8' : CRATE_TINTS[i];
    ctx.strokeStyle = held ? '#ffd94d' : '#3a2410';
    ctx.lineWidth = held ? 3 : 2;
    roundRectPath(ctx, r.x, r.y, r.w, r.h, 10); ctx.fill(); ctx.stroke();
    // Wood slats on the crate face.
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(r.x + 4, r.y + 34, r.w - 8, 3);
    ctx.fillRect(r.x + 4, r.y + 96, r.w - 8, 3);
    // Inner cream tray so the art pops off the coloured wood.
    ctx.fillStyle = '#fdf6e3';
    roundRectPath(ctx, r.x + 12, r.y + 38, r.w - 24, 52, 8); ctx.fill();
    drawIngredientIcon(ctx, id, r.x + r.w / 2, r.y + 64, 26);
    ctx.fillStyle = '#fff6e3';
    ctx.font = 'bold 13px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(ing.name, r.x + r.w / 2, r.y + 110);
    ctx.fillStyle = '#ffe6a8';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText(ing.station === 'board' ? 'chop' : ing.station === 'wok' ? 'wok' : 'pot', r.x + r.w / 2, r.y + 126);
    ctx.fillStyle = '#241608';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(ing.key, r.x + 8, r.y + 18);
  });
}

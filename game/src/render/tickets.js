// Ember & Tide — render/tickets.js
// The order board: ticket cards with dish art, components, price, a
// patience bar and a countdown. VIP tickets get a gold frame and shimmer;
// the Critic ticket gets a purple frame and a CRITIC ribbon.

import { INGREDIENTS } from '../data/recipes.js';
import { drawDishPlate } from './plates.js';
import { fmtCoins, roundRectPath, clamp } from '../core/util.js';
import { drawShimmer } from './feel.js';

export function ticketRect(i) {
  return { x: 22, y: 132 + i * 100, w: 228, h: 92 };
}

export function drawTicket(ctx, t, i, now) {
  const r = ticketRect(i);
  const frac = clamp(t.left / t.total, 0, 1);
  const urgent = frac < 0.3;
  const critic = t.dishId === 'tide-special' && t.critic;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = t.vip ? '#fff3c4' : '#fdf6e3';
  roundRectPath(ctx, r.x, r.y, r.w, r.h, 10);
  ctx.fill();
  ctx.restore();
  if (critic) {
    ctx.strokeStyle = '#7a3b9e'; ctx.lineWidth = 3;
    roundRectPath(ctx, r.x + 1.5, r.y + 1.5, r.w - 3, r.h - 3, 9); ctx.stroke();
  } else if (t.vip) {
    ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 3;
    roundRectPath(ctx, r.x + 1.5, r.y + 1.5, r.w - 3, r.h - 3, 9); ctx.stroke();
    drawShimmer(ctx, r.x, r.y, r.w, r.h, now);
  }
  if (urgent && Math.sin(now * 6) > 0) {
    ctx.strokeStyle = '#e8442e'; ctx.lineWidth = 3;
    roundRectPath(ctx, r.x + 1.5, r.y + 1.5, r.w - 3, r.h - 3, 9); ctx.stroke();
  }
  drawDishPlate(ctx, t.dish, r.x + 42, r.y + 38, 28);
  // Dish name wraps to two lines when long, so it never collides with
  // the countdown pill, which lives on the patience-bar row instead.
  const words = t.dish.name.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > 19) { lines.push(line.trim()); line = w; }
    else line += ' ' + w;
  }
  if (line.trim()) lines.push(line.trim());
  ctx.fillStyle = '#2a1a12';
  ctx.font = 'bold 13px Georgia, serif';
  ctx.textAlign = 'left';
  lines.forEach((l, j) => ctx.fillText(l, r.x + 78, r.y + 24 + j * 15, 144));
  const bodyY = r.y + 24 + lines.length * 15;
  ctx.fillStyle = '#7a5a34';
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillText(t.dish.comps.map((c) => INGREDIENTS[c].name).join(' + '), r.x + 78, bodyY + 4, 144);
  ctx.fillStyle = critic ? '#7a3b9e' : t.vip ? '#b8860b' : '#5a7a3a';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.fillText((critic ? 'CRITIC  ' : t.vip ? 'VIP  ' : '') + fmtCoins(t.dish.price) + ' + tip', r.x + 78, bodyY + 20);
  ctx.fillStyle = '#e8dcc2';
  roundRectPath(ctx, r.x + 12, r.y + 78, r.w - 60, 8, 4); ctx.fill();
  ctx.fillStyle = frac > 0.5 ? '#4caf6d' : frac > 0.3 ? '#f2a54a' : '#e8442e';
  roundRectPath(ctx, r.x + 12, r.y + 78, (r.w - 60) * frac, 8, 4); ctx.fill();
  // Countdown in its own dark pill at the end of the bar row.
  ctx.fillStyle = urgent ? '#e8442e' : 'rgba(24,12,8,0.85)';
  roundRectPath(ctx, r.x + r.w - 42, r.y + 74, 34, 17, 8); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(Math.ceil(t.left) + 's', r.x + r.w - 25, r.y + 86);
  ctx.textAlign = 'left';
}

export function drawBoardPanel(ctx, g, now) {
  ctx.fillStyle = 'rgba(24,12,8,0.55)';
  roundRectPath(ctx, 14, 92, 244, 556, 14); ctx.fill();
  ctx.fillStyle = '#ffe6a8';
  ctx.font = 'bold 17px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('ORDER BOARD', 24, 120);
  ctx.fillStyle = '#f2a54a';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText(g.tickets.length + ' ticket' + (g.tickets.length === 1 ? '' : 's') + ' · serve before the bar runs out', 24, 640);
  if (!g.tickets.length) {
    ctx.fillStyle = 'rgba(255,246,227,0.6)';
    ctx.font = 'italic 14px Georgia, serif';
    ctx.fillText('No orders yet —', 24, 164);
    ctx.fillText('the evening crowd', 24, 184);
    ctx.fillText('is on its way…', 24, 204);
  }
  g.tickets.forEach((t, i) => drawTicket(ctx, t, i, now));
}

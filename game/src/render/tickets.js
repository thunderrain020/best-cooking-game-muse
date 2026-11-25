// Ember & Tide — render/tickets.js
// The order rail: a clean top horizontal strip of ticket cards (up to 5),
// each with dish art, step checkmarks for components already on the
// plate, VIP / CRITIC badges and a bold patience bar with a countdown.

import { INGREDIENTS } from '../data/recipes.js';
import { drawDishPlate } from './foodDishes.js';
import { fmtCoins, roundRectPath, clamp } from '../core/util.js';
import { drawShimmer } from './feel.js';

export function ticketRect(i) {
  return { x: 14 + i * 194, y: 92, w: 186, h: 68 };
}

export function drawTicket(ctx, g, t, i, now) {
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
  ctx.strokeStyle = '#1a120b';
  ctx.lineWidth = 2;
  roundRectPath(ctx, r.x + 1, r.y + 1, r.w - 2, r.h - 2, 9);
  ctx.stroke();
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
  drawDishPlate(ctx, t.dish, r.x + 24, r.y + 20, 18, now);
  // Badge pill, top right — clear of the dish name beside it.
  if (critic || t.vip) {
    ctx.fillStyle = critic ? '#7a3b9e' : '#b8860b';
    roundRectPath(ctx, r.x + r.w - 38, r.y + 6, 32, 13, 6); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(critic ? 'CRITIC' : 'VIP', r.x + r.w - 22, r.y + 16);
  }
  ctx.fillStyle = '#2a1a12';
  ctx.font = 'bold 11px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText(t.dish.name, r.x + 46, r.y + 19, 96);
  // Step pips: one per component, green tick once it is on the plate.
  t.dish.comps.forEach((c, j) => {
    const px = r.x + 52 + j * 17, py = r.y + 35;
    const done = g.plate.items.includes(c);
    ctx.fillStyle = done ? '#4caf6d' : '#e8dcc2';
    ctx.beginPath(); ctx.arc(px, py, 6.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(px, py, 6.5, 0, Math.PI * 2); ctx.stroke();
    if (done) {
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px - 3, py); ctx.lineTo(px - 1, py + 2.5); ctx.lineTo(px + 3.5, py - 2.5); ctx.stroke();
    } else {
      ctx.fillStyle = '#7a5a34';
      ctx.font = 'bold 8px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(INGREDIENTS[c].name[0], px, py + 3);
    }
  });
  ctx.fillStyle = critic ? '#7a3b9e' : t.vip ? '#b8860b' : '#5a7a3a';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(fmtCoins(t.dish.price) + ' + tip', r.x + r.w - 8, r.y + 39);
  // Bold patience bar with the countdown pill on its right end.
  ctx.fillStyle = '#e8dcc2';
  roundRectPath(ctx, r.x + 10, r.y + 50, r.w - 20, 8, 4); ctx.fill();
  ctx.fillStyle = frac > 0.5 ? '#4caf6d' : frac > 0.3 ? '#f2a54a' : '#e8442e';
  roundRectPath(ctx, r.x + 10, r.y + 50, (r.w - 20) * frac, 8, 4); ctx.fill();
  ctx.fillStyle = urgent ? '#e8442e' : 'rgba(24,12,8,0.85)';
  roundRectPath(ctx, r.x + r.w - 44, r.y + 46, 34, 16, 8); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(Math.ceil(t.left) + 's', r.x + r.w - 27, r.y + 58);
  ctx.textAlign = 'left';
}

export function drawBoardPanel(ctx, g, now) {
  ctx.fillStyle = 'rgba(24,12,8,0.5)';
  roundRectPath(ctx, 8, 88, 1024, 80, 12); ctx.fill();
  if (!g.tickets.length) {
    ctx.fillStyle = 'rgba(255,246,227,0.7)';
    ctx.font = 'italic 14px Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText('No orders yet — the evening crowd is on its way…', 24, 130);
  }
  g.tickets.forEach((t, i) => drawTicket(ctx, g, t, i, now));
}

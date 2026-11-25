// Ember & Tide — render/diners.js
// Seated top-down terrace diners with mood badges, and round diner
// tables with a terracotta top and two plated dishes.

import { roundRectPath } from '../core/util.js';

export function drawDiner(ctx, x, y, shirt, mood) {
  ctx.fillStyle = shirt;
  ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#f2c89a';
  ctx.beginPath(); ctx.arc(x, y - 4, 7, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y - 4, 7, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = mood === 'happy' ? '#4caf6d' : mood === 'impatient' ? '#e8442e' : '#f2a54a';
  roundRectPath(ctx, x - 11, y - 28, 22, 13, 6); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1;
  roundRectPath(ctx, x - 11, y - 28, 22, 13, 6); ctx.stroke();
  ctx.fillStyle = '#1a120b';
  ctx.fillRect(x - 5, y - 25, 2.5, 2.5);
  ctx.fillRect(x + 3, y - 25, 2.5, 2.5);
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.2;
  ctx.beginPath();
  if (mood === 'happy') ctx.arc(x, y - 22, 4, 0.15 * Math.PI, 0.85 * Math.PI);
  else ctx.arc(x, y - 16, 4, 1.15 * Math.PI, 1.85 * Math.PI);
  ctx.stroke();
}

export function drawTable(ctx, x, y) {
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(x, y + 4, 30, 12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath(); ctx.arc(x, y, 26, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(x, y, 26, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#c96a3a';
  ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffe6a8';
  ctx.beginPath(); ctx.arc(x - 6, y - 4, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 7, y + 5, 4, 0, Math.PI * 2); ctx.fill();
}

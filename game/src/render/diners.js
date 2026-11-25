// Ember & Tide — render/diners.js
// Seated top-down terrace diners with mood badges, and round diner
// tables with a terracotta top and two plated dishes.

import { roundRectPath } from '../core/util.js';

// Expressive top-down terrace diners: broad shoulders, a head with a
// hair cap, and a round mood bubble with a bold glyph — readable even
// at thumbnail scale. (x, y) is the seat centre; the head sits just
// above the shoulders so the diner reads as seated at the table.
const MOODS = {
  happy: { color: '#4caf6d', glyph: '✓' },
  impatient: { color: '#e8442e', glyph: '!' },
  waiting: { color: '#f2a54a', glyph: '…' },
};

export function drawDiner(ctx, x, y, shirt, mood) {
  const m = MOODS[mood] || MOODS.waiting;
  // Shoulders: broad rounded dome in the shirt colour, ink outline,
  // with a small cream collar V at the throat.
  ctx.fillStyle = shirt;
  ctx.beginPath(); ctx.ellipse(x, y + 5, 16, 11, 0, Math.PI, 0); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(x, y + 5, 16, 11, 0, Math.PI, 0); ctx.stroke();
  ctx.fillStyle = shirt;
  ctx.fillRect(x - 16, y + 4, 32, 11);
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x - 16, y + 4); ctx.lineTo(x - 16, y + 15); ctx.moveTo(x + 16, y + 4); ctx.lineTo(x + 16, y + 15); ctx.stroke();
  ctx.strokeStyle = '#fdf6e3'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x - 4, y - 2); ctx.lineTo(x, y + 4); ctx.lineTo(x + 4, y - 2); ctx.stroke();
  // Head: skin circle with a dark hair cap over the top half.
  ctx.fillStyle = '#f2c89a';
  ctx.beginPath(); ctx.arc(x, y - 8, 8.5, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y - 8, 8.5, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#3a2418';
  ctx.beginPath(); ctx.arc(x, y - 9, 8.5, Math.PI * 1.05, Math.PI * 1.95); ctx.fill();
  // Mood bubble: round, to the side of the head so it never covers
  // the table above, with a bold white glyph and a tiny tail.
  const bx = x + 17, by = y - 12;
  ctx.fillStyle = m.color;
  ctx.beginPath(); ctx.moveTo(bx - 8, by + 6); ctx.lineTo(bx - 2, by + 12); ctx.lineTo(bx - 3, by + 4); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(bx, by, 9, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(bx, by, 9, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(m.glyph, bx, by + 0.5);
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

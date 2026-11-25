// Ember & Tide — render/iconBadges.js
// Shared illustrated art for the overlays: circular icon badges for every
// upgrade and relic (glyphs live in iconGlyphs.js), the top-down chef
// mascot holding a steaming bowl, and gold stars. One family (deep
// indigo disc, gold rim, warm glyphs) so the shop and the victory card
// read as one set.

import { roundRectPath } from '../core/util.js';
import { drawIngredientIcon } from './foodArt.js';
import { glyph, starPath } from './iconGlyphs.js';

export function drawGoldStar(ctx, cx, cy, r, filled) {
  starPath(ctx, cx, cy, r);
  if (filled) {
    ctx.fillStyle = '#ffd94d'; ctx.fill();
    ctx.strokeStyle = '#8a6410'; ctx.lineWidth = 1.5; ctx.stroke();
  } else {
    ctx.fillStyle = 'rgba(255,217,77,0.10)'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,217,77,0.45)'; ctx.lineWidth = 1.5; ctx.stroke();
  }
}

export function drawStars(ctx, cx, cy, total, filled) {
  for (let i = 0; i < total; i++) {
    drawGoldStar(ctx, cx + (i - (total - 1) / 2) * 30, cy, 11, i < filled);
  }
}

export function drawIconBadge(ctx, id, cx, cy, r) {
  const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
  grad.addColorStop(0, '#3a2f5e');
  grad.addColorStop(1, '#1e1b3a');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = 'rgba(26,18,11,0.6)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, r - 2.5, 0, Math.PI * 2); ctx.stroke();
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(r / 24, r / 24);
  glyph(ctx, id);
  ctx.restore();
}

// Top-down chef mascot: tall white hat, teal shirt, cream apron, holding
// a steaming bowl of prawns out front. Drawn at scale s around (cx, cy).
export function drawChefMascot(ctx, cx, cy, s) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath(); ctx.ellipse(0, 40, 30, 9, 0, 0, Math.PI * 2); ctx.fill();
  // Shoulders: teal shirt, ink outline.
  ctx.fillStyle = '#2e7d6b';
  roundRectPath(ctx, -34, -6, 68, 42, 18); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2; ctx.stroke();
  // Cream apron with straps.
  ctx.fillStyle = '#fdf6e3';
  roundRectPath(ctx, -20, -2, 40, 34, 10); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-14, -4); ctx.lineTo(-10, 6); ctx.moveTo(14, -4); ctx.lineTo(10, 6); ctx.stroke();
  // Arms at the sides, reaching for the bowl.
  ctx.fillStyle = '#2e7d6b';
  ctx.beginPath(); ctx.arc(-34, 14, 8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(34, 14, 8, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(-34, 14, 8, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(34, 14, 8, 0, Math.PI * 2); ctx.stroke();
  // Head + tall white chef hat.
  ctx.fillStyle = '#f2c89a';
  ctx.beginPath(); ctx.arc(0, -22, 13, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(0, -22, 13, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(-9, -34, 8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(9, -34, 8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -38, 9, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(-15, -34, 30, 8);
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(-9, -34, 8, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(9, -34, 8, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, -38, 9, 0, Math.PI * 2); ctx.stroke();
  // Eyes and a smile.
  ctx.fillStyle = '#1a120b';
  ctx.beginPath(); ctx.arc(-5, -22, 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(5, -22, 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(0, -18, 5, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  // Steaming bowl of prawns held out front.
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath(); ctx.ellipse(0, 34, 17, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.ellipse(0, 34, 17, 9, 0, 0, Math.PI * 2); ctx.stroke();
  drawIngredientIcon(ctx, 'prawn', 0, 31, 11);
  ctx.strokeStyle = 'rgba(255,244,220,0.9)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-5, 24); ctx.quadraticCurveTo(-8, 18, -5, 13); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(5, 24); ctx.quadraticCurveTo(8, 18, 5, 13); ctx.stroke();
  ctx.restore();
}

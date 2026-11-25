// Ember & Tide — render/serve.js
// The central plating island (three ceramic plates mid-assembly, with
// progress pips and the dish name) and the brass pass bell under its heat
// lamp, opening onto the terrace. No box frames: real equipment on the
// island slab and the brass counter.

import { dishById } from '../data/recipes.js';
import { drawPlateInProgress } from './foodDishes.js';
import { roundRectPath } from '../core/util.js';
import { pillText, stationTag } from './palette.js';
import { drawShimmer, contactShadow, radialGlow } from './feel.js';
import { ISLAND_RECT, BELL_RECT } from './layout.js';

export function drawPlateStation(ctx, g, now) {
  const r = ISLAND_RECT;
  const dish = g.plate.dishId ? dishById(g.plate.dishId) : null;
  const total = dish ? dish.comps.length : Math.max(3, g.plate.items.length);
  stationTag(ctx, r.x + r.w / 2, r.y, 'PLATING ISLAND', 'R · click to stack');
  // Island slab: dark walnut base, warm maple top, brass trim.
  contactShadow(ctx, r.x + r.w / 2, r.y + r.h - 4, 150, 10);
  ctx.fillStyle = '#231b18';
  roundRectPath(ctx, r.x + 4, r.y + 16, r.w - 8, r.h - 28, 14); ctx.fill();
  ctx.fillStyle = '#8a5a33';
  roundRectPath(ctx, r.x + 8, r.y + 12, r.w - 16, r.h - 32, 12); ctx.fill();
  ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 2;
  roundRectPath(ctx, r.x + 8, r.y + 12, r.w - 16, r.h - 32, 12); ctx.stroke();
  ctx.fillStyle = 'rgba(255,246,227,0.12)';
  ctx.fillRect(r.x + 20, r.y + 22, r.w - 40, 3);
  // Live plate, large, centre-left; the composed meal fills ~70% of it.
  const cx = r.x + 92, cy = r.y + 84;
  ctx.fillStyle = '#2b221e';
  ctx.beginPath(); ctx.ellipse(cx, cy + 4, 62, 40, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#b05a3a';
  ctx.beginPath(); ctx.ellipse(cx, cy, 54, 36, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(cx, cy, 54, 36, 0, 0, Math.PI * 2); ctx.stroke();
  drawPlateInProgress(ctx, g.plate.items, total, cx, cy, 52, now);
  // Chopsticks beside the live plate.
  ctx.save();
  ctx.translate(cx + 62, cy - 8); ctx.rotate(0.5);
  ctx.fillStyle = '#8a5a33'; ctx.fillRect(0, -3, 34, 4); ctx.fillRect(0, 3, 34, 4);
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1;
  ctx.strokeRect(0, -3, 34, 4); ctx.strokeRect(0, 3, 34, 4);
  ctx.restore();
  // Second plate: mirrors the finished dish when one is ready, else clean.
  const sx = r.x + r.w - 78, sy = r.y + 76;
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath(); ctx.ellipse(sx, sy, 44, 30, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(sx, sy, 44, 30, 0, 0, Math.PI * 2); ctx.stroke();
  if (dish) {
    drawPlateInProgress(ctx, dish.comps, dish.comps.length, sx, sy, 34, now);
    drawShimmer(ctx, sx - 46, sy - 32, 92, 64, now);
  }
  // Third plate: clean and waiting.
  const tx = r.x + r.w / 2, ty = r.y + r.h - 42;
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath(); ctx.ellipse(tx, ty, 30, 20, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(tx, ty, 30, 20, 0, 0, Math.PI * 2); ctx.stroke();
  // One pill under the live plate: dish name + progress pips, always crisp.
  const label = dish ? dish.name + ' · ' + total + '/' + total : g.plate.items.length ? g.plate.items.length + '/' + total + ' on the plate…' : 'Fresh plate';
  pillText(ctx, label, cx, r.y + r.h - 18, 'bold 12px system-ui, sans-serif', dish ? '#a8d94a' : '#ffe6a8');
}

export function drawBellStation(ctx, g, now) {
  const r = BELL_RECT;
  stationTag(ctx, r.x + r.w / 2, r.y, 'PASS · SERVE', 'Space · ring the bell');
  const ready = !!g.plate.dishId;
  const cx = r.x + r.w / 2;
  // Overhead brass heat lamp: shade at the top, a warm cone of light.
  ctx.fillStyle = '#8a6410';
  ctx.beginPath(); ctx.moveTo(cx - 22, r.y + 46); ctx.quadraticCurveTo(cx, r.y + 26, cx + 22, r.y + 46); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx - 22, r.y + 46); ctx.quadraticCurveTo(cx, r.y + 26, cx + 22, r.y + 46); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,205,110,0.28)';
  ctx.beginPath();
  ctx.moveTo(cx - 18, r.y + 46); ctx.lineTo(cx + 18, r.y + 46);
  ctx.lineTo(cx + 44, r.y + 128); ctx.lineTo(cx - 44, r.y + 128);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath(); ctx.arc(cx, r.y + 46, 6, 0, Math.PI * 2); ctx.fill();
  // Amber heat-lamp glow pooling onto the bell and the counter.
  radialGlow(ctx, cx, r.y + 104, 60, 'rgba(255,190,90,0.32)');
  // Polished brass bell on a small round walnut mat.
  contactShadow(ctx, cx, r.y + 132, 46, 7);
  ctx.fillStyle = '#2b221e';
  ctx.beginPath(); ctx.ellipse(cx, r.y + 128, 44, 12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(cx, r.y + 128, 44, 12, 0, 0, Math.PI * 2); ctx.stroke();
  if (ready) drawShimmer(ctx, r.x + 6, r.y + 50, r.w - 12, 88, now);
  const pulse = ready ? 1 + 0.06 * Math.sin(now * 6) : 1;
  ctx.save();
  ctx.translate(cx, r.y + 92); ctx.scale(pulse, pulse);
  const grad = ctx.createRadialGradient(-7, -12, 3, 0, 0, 38);
  grad.addColorStop(0, '#ffe9a8'); grad.addColorStop(0.6, '#d4a017'); grad.addColorStop(1, '#8a6410');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.moveTo(-28, 22); ctx.quadraticCurveTo(-28, -22, 0, -25); ctx.quadraticCurveTo(28, -22, 28, 22); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-28, 22); ctx.quadraticCurveTo(-28, -22, 0, -25); ctx.quadraticCurveTo(28, -22, 28, 22); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath(); ctx.ellipse(-10, -12, 8, 5, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#8a6410'; ctx.fillRect(-33, 20, 66, 6);
  ctx.fillStyle = '#5d3a1e';
  ctx.beginPath(); ctx.arc(0, 30, 5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  pillText(ctx, ready ? 'RING IT!' : 'Serve a full dish', cx, r.y + r.h - 14, 'bold 12px system-ui, sans-serif', ready ? '#ffd94d' : '#c9b48a');
}

// Ember & Tide — render/serve.js
// Plating counter and pass bell, drawn as real equipment on the counter:
// a patterned ceramic plate with chopsticks and spoon on a walnut mat,
// and a brass bell under a warm heat lamp. No box frames.

import { dishById } from '../data/recipes.js';
import { drawPlateInProgress } from './foodDishes.js';
import { roundRectPath } from '../core/util.js';
import { pillText, stationLabel } from './palette.js';
import { drawShimmer } from './feel.js';
import { STATION_RECTS } from './stations.js';

export function drawPlateStation(ctx, g, now) {
  const r = STATION_RECTS.plateRect;
  const dish = g.plate.dishId ? dishById(g.plate.dishId) : null;
  const total = dish ? dish.comps.length : Math.max(3, g.plate.items.length);
  stationLabel(ctx, r.x, r.y, r.w, 'PLATING COUNTER', 'R · click to stack');
  const cx = r.x + r.w / 2;
  const cy = r.y + 110;
  // Dark walnut mat + patterned terracotta mat under the white plate.
  ctx.fillStyle = '#2b221e';
  ctx.beginPath(); ctx.ellipse(cx, cy + 8, 88, 58, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.ellipse(cx, cy + 8, 88, 58, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#b05a3a';
  ctx.beginPath(); ctx.ellipse(cx, cy, 74, 52, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(cx, cy, 74, 52, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = 'rgba(255,246,227,0.35)';
  ctx.beginPath(); ctx.ellipse(cx, cy, 66, 45, 0, 0, Math.PI * 2); ctx.fill();
  drawPlateInProgress(ctx, g.plate.items, total, cx, cy, 62, now);
  // Chopsticks and a spoon resting beside the plate on the mat.
  ctx.save();
  ctx.translate(cx + 82, cy - 6); ctx.rotate(0.5);
  ctx.fillStyle = '#8a5a33'; ctx.fillRect(0, -3, 44, 4);
  ctx.fillRect(0, 3, 44, 4);
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1;
  ctx.strokeRect(0, -3, 44, 4); ctx.strokeRect(0, 3, 44, 4);
  ctx.restore();
  ctx.fillStyle = '#d8c49a';
  ctx.beginPath(); ctx.ellipse(cx - 84, cy + 18, 9, 12, 0.4, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.ellipse(cx - 84, cy + 18, 9, 12, 0.4, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#8a5a33'; ctx.fillRect(cx - 88, cy + 28, 5, 18);
  // Dish name in its own dark pill below the plate: always crisp.
  const label = dish ? dish.name : g.plate.items.length ? g.plate.items.length + ' on the plate…' : 'Fresh plate';
  pillText(ctx, label, cx, r.y + 168, 'bold 12px system-ui, sans-serif', dish ? '#a8d94a' : '#ffe6a8');
}

export function drawBellStation(ctx, g, now) {
  const r = STATION_RECTS.bellRect;
  stationLabel(ctx, r.x, r.y, r.w, 'PASS · SERVE', 'Space · ring the bell');
  const ready = !!g.plate.dishId;
  const cx = r.x + r.w / 2;
  // Overhead brass heat lamp: shade at the top, a warm cone of light.
  ctx.fillStyle = '#8a6410';
  ctx.beginPath(); ctx.moveTo(cx - 26, r.y + 62); ctx.quadraticCurveTo(cx, r.y + 38, cx + 26, r.y + 62); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx - 26, r.y + 62); ctx.quadraticCurveTo(cx, r.y + 38, cx + 26, r.y + 62); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,205,110,0.28)';
  ctx.beginPath();
  ctx.moveTo(cx - 22, r.y + 62); ctx.lineTo(cx + 22, r.y + 62);
  ctx.lineTo(cx + 52, r.y + 148); ctx.lineTo(cx - 52, r.y + 148);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath(); ctx.arc(cx, r.y + 62, 7, 0, Math.PI * 2); ctx.fill();
  // Polished brass bell on a small round walnut mat.
  ctx.fillStyle = '#2b221e';
  ctx.beginPath(); ctx.ellipse(cx, r.y + 148, 52, 14, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(cx, r.y + 148, 52, 14, 0, 0, Math.PI * 2); ctx.stroke();
  if (ready) drawShimmer(ctx, r.x + 8, r.y + 66, r.w - 16, 96, now);
  const pulse = ready ? 1 + 0.06 * Math.sin(now * 6) : 1;
  ctx.save();
  ctx.translate(cx, r.y + 104); ctx.scale(pulse, pulse);
  const grad = ctx.createRadialGradient(-8, -14, 4, 0, 0, 46);
  grad.addColorStop(0, '#ffe9a8'); grad.addColorStop(0.6, '#d4a017'); grad.addColorStop(1, '#8a6410');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.moveTo(-34, 26); ctx.quadraticCurveTo(-34, -26, 0, -30); ctx.quadraticCurveTo(34, -26, 34, 26); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-34, 26); ctx.quadraticCurveTo(-34, -26, 0, -30); ctx.quadraticCurveTo(34, -26, 34, 26); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath(); ctx.ellipse(-12, -14, 10, 6, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#8a6410'; ctx.fillRect(-40, 24, 80, 7);
  ctx.fillStyle = '#5d3a1e';
  ctx.beginPath(); ctx.arc(0, 36, 6, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  pillText(ctx, ready ? 'RING IT!' : 'Serve a full dish', cx, r.y + 168, 'bold 12px system-ui, sans-serif', ready ? '#ffd94d' : '#c9b48a');
}

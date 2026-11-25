// Ember & Tide — render/serve.js
// The central plating island (three ceramic plates mid-assembly, with
// progress pips and the dish name inside the island's bottom edge).
// The brass pass bell lives in render/bell.js. No box frames: real
// equipment on the island slab and the brass counter.

import { dishById } from '../data/recipes.js';
import { drawPlateInProgress } from './foodDishes.js';
import { roundRectPath } from '../core/util.js';
import { pillText, stationTag } from './palette.js';
import { drawShimmer, contactShadow } from './feel.js';
import { ISLAND_RECT } from './layout.js';

export function drawPlateStation(ctx, g, now) {
  const r = ISLAND_RECT;
  const dish = g.plate.dishId ? dishById(g.plate.dishId) : null;
  const total = dish ? dish.comps.length : Math.max(3, g.plate.items.length);
  stationTag(ctx, r.x + r.w / 2, r.y, 'PLATE', 'R');
  // Island slab: dark walnut base, warm maple top, brass trim. The slab
  // runs to the island's bottom edge so the dish label pill sits on it.
  contactShadow(ctx, r.x + r.w / 2, r.y + r.h - 4, 150, 10);
  ctx.fillStyle = '#231b18';
  roundRectPath(ctx, r.x + 4, r.y + 16, r.w - 8, r.h - 12, 14); ctx.fill();
  ctx.fillStyle = '#8a5a33';
  roundRectPath(ctx, r.x + 8, r.y + 12, r.w - 16, r.h - 16, 12); ctx.fill();
  ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 2;
  roundRectPath(ctx, r.x + 8, r.y + 12, r.w - 16, r.h - 16, 12); ctx.stroke();
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
  // Third plate: clean and waiting, small, tucked between the two
  // plates near the top so the bottom edge stays clear for the label.
  const tx = r.x + r.w / 2, ty = r.y + 30;
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath(); ctx.ellipse(tx, ty, 26, 16, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(tx, ty, 26, 16, 0, 0, Math.PI * 2); ctx.stroke();
  // One pill inside the island's bottom edge: dish name + progress
  // pips, always crisp, on the maple slab — never over the route line.
  // V6: raised 6px (pill 458-484) so the raised route stop badges
  // (tops at y 485) clear it by a pixel.
  const label = dish ? dish.name + ' · ' + total + '/' + total : g.plate.items.length ? g.plate.items.length + '/' + total + ' on the plate…' : 'Fresh plate';
  pillText(ctx, label, cx, r.y + r.h - 34, 'bold 12px system-ui, sans-serif', dish ? '#a8d94a' : '#ffe6a8');
}

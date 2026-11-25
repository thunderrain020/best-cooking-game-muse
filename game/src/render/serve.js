// Ember & Tide — render/serve.js
// Plating counter and pass bell: crisp white marble, the dish name in a
// dark pill, and a golden shimmer on the bell when a dish is ready.

import { dishById } from '../data/recipes.js';
import { drawPlateInProgress } from './plates.js';
import { roundRectPath } from '../core/util.js';
import { pillText, stationLabel } from './palette.js';
import { drawShimmer } from './feel.js';
import { STATION_RECTS } from './stations.js';

function deck(ctx, r, fill) {
  ctx.fillStyle = fill;
  roundRectPath(ctx, r.x, r.y + 56, r.w, 118, 10); ctx.fill();
}

export function drawPlateStation(ctx, g) {
  const r = STATION_RECTS.plateRect;
  const dish = g.plate.dishId ? dishById(g.plate.dishId) : null;
  const total = dish ? dish.comps.length : Math.max(3, g.plate.items.length);
  stationLabel(ctx, r.x, r.y, r.w, 'PLATING COUNTER', 'R · click to stack');
  deck(ctx, r, '#efe9dc');
  drawPlateInProgress(ctx, g.plate.items, total, r.x + r.w / 2, r.y + 118, 62);
  // Dish name in its own dark pill below the plate: always crisp.
  const label = dish ? dish.name : g.plate.items.length ? g.plate.items.length + ' on the plate…' : 'Fresh plate';
  pillText(ctx, label, r.x + r.w / 2, r.y + 178, 'bold 12px system-ui, sans-serif', dish ? '#a8d94a' : '#ffe6a8');
}

export function drawBellStation(ctx, g, now) {
  const r = STATION_RECTS.bellRect;
  stationLabel(ctx, r.x, r.y, r.w, 'PASS · SERVE', 'Space · ring the bell');
  deck(ctx, r, '#efe9dc');
  const ready = !!g.plate.dishId;
  const cx = r.x + r.w / 2;
  if (ready) drawShimmer(ctx, r.x + 8, r.y + 66, r.w - 16, 96, now);
  const pulse = ready ? 1 + 0.06 * Math.sin(now * 6) : 1;
  ctx.save();
  ctx.translate(cx, r.y + 108); ctx.scale(pulse, pulse);
  const grad = ctx.createRadialGradient(-8, -14, 4, 0, 0, 46);
  grad.addColorStop(0, '#ffe9a8'); grad.addColorStop(0.6, '#d4a017'); grad.addColorStop(1, '#8a6410');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.moveTo(-34, 26); ctx.quadraticCurveTo(-34, -26, 0, -30); ctx.quadraticCurveTo(34, -26, 34, 26); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#8a6410'; ctx.fillRect(-40, 24, 80, 7);
  ctx.fillStyle = '#5d3a1e';
  ctx.beginPath(); ctx.arc(0, 36, 6, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  pillText(ctx, ready ? 'RING IT!' : 'Serve a full dish', cx, r.y + 178, 'bold 12px system-ui, sans-serif', ready ? '#ffd94d' : '#c9b48a');
}

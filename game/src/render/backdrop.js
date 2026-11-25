// Ember & Tide — render/backdrop.js
// The top-down kitchen floor: warm harbour slate / teal-ceramic tiles
// with grout lines, a terracotta runner rug under the plating island, and
// warm lantern light pools. The top wooden counter band carries the
// pantry crates and the trash bin.

import { roundRectPath } from '../core/util.js';
import { FLOOR } from './layout.js';

const TILE_A = '#2e5a58';
const TILE_B = '#356661';
const TILE_C = '#2a4f4d';

export function drawBackdrop(ctx, now) {
  // Dark base under everything (top bar and hint strip sit on it).
  ctx.fillStyle = '#17100d';
  ctx.fillRect(0, 0, 1280, 720);
  // Ceramic tile floor.
  const T = 64;
  for (let ty = FLOOR.y; ty < FLOOR.y + FLOOR.h; ty += T) {
    for (let tx = 0; tx < FLOOR.w; tx += T) {
      const i = Math.floor(tx / T), j = Math.floor((ty - FLOOR.y) / T);
      ctx.fillStyle = (i + j) % 3 === 0 ? TILE_C : (i + j) % 2 === 0 ? TILE_A : TILE_B;
      ctx.fillRect(tx, ty, Math.min(T, FLOOR.w - tx), Math.min(T, FLOOR.y + FLOOR.h - ty));
      ctx.strokeStyle = '#1d3a38';
      ctx.lineWidth = 2;
      ctx.strokeRect(tx + 1, ty + 1, Math.min(T, FLOOR.w - tx) - 2, Math.min(T, FLOOR.y + FLOOR.h - ty) - 2);
      ctx.fillStyle = 'rgba(255,235,200,0.05)';
      ctx.fillRect(tx + 4, ty + 4, Math.min(T - 8, FLOOR.w - tx - 8), 3);
    }
  }
  // Warm lantern light pools on the floor.
  const pools = [[260, 320, 150], [700, 430, 170], [920, 320, 130], [520, 600, 150]];
  for (const [x, y, r] of pools) {
    const g = ctx.createRadialGradient(x, y, 8, x, y, r);
    g.addColorStop(0, 'rgba(255,190,90,0.13)');
    g.addColorStop(1, 'rgba(255,190,90,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // Soft vignette so the edges sit back.
  const v = ctx.createRadialGradient(520, 416, 200, 520, 416, 620);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(0,0,0,0.22)');
  ctx.fillStyle = v;
  ctx.fillRect(0, FLOOR.y, FLOOR.w, FLOOR.h);
  // Terracotta runner rug under the plating island.
  ctx.fillStyle = '#8a4a3a';
  roundRectPath(ctx, 356, 316, 368, 200, 16); ctx.fill();
  ctx.strokeStyle = '#5a2e22'; ctx.lineWidth = 3;
  roundRectPath(ctx, 356, 316, 368, 200, 16); ctx.stroke();
  ctx.strokeStyle = '#c98a5a'; ctx.lineWidth = 2;
  roundRectPath(ctx, 368, 328, 344, 176, 10); ctx.stroke();
  ctx.fillStyle = 'rgba(201,138,90,0.35)';
  for (let i = 0; i < 6; i++) {
    ctx.beginPath(); ctx.arc(388 + i * 56, 332, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(388 + i * 56, 512, 5, 0, Math.PI * 2); ctx.fill();
  }
}

export function drawCounter(ctx) {
  // Top wooden counter band: the pantry crates and trash bin sit on it.
  const grad = ctx.createLinearGradient(0, 172, 0, 292);
  grad.addColorStop(0, '#7a5230');
  grad.addColorStop(1, '#5a3a1e');
  ctx.fillStyle = grad;
  roundRectPath(ctx, 8, 172, 1024, 120, 10); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2.5;
  roundRectPath(ctx, 8, 172, 1024, 120, 10); ctx.stroke();
  ctx.fillStyle = 'rgba(255,220,160,0.08)';
  for (let i = 0; i < 10; i++) ctx.fillRect(20 + (i * 103) % 1000, 180 + (i % 4) * 26, 70, 2);
  ctx.fillStyle = '#c9a24a';
  ctx.fillRect(12, 288, 1016, 3);
  ctx.fillStyle = '#4a2c14';
  ctx.fillRect(8, 292, 1024, 4);
}

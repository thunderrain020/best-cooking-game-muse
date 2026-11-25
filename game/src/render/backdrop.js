// Ember & Tide — render/backdrop.js
// The top-down kitchen floor, V7: warm harbour wood planks with
// alternating grain (no more flat schematic grid), a slate threshold
// band with a brass compass medallion inlaid at its centre, and warm
// amber lantern light pools. The top wooden counter band carries the
// pantry crates and the trash bin.

import { roundRectPath } from '../core/util.js';
import { FLOOR } from './layout.js';

const WOODS = ['#7a5230', '#6b4526', '#835a34', '#5f3d22'];
const SLATES = ['#3d4a4f', '#46545a'];

export function drawBackdrop(ctx, now) {
  // Dark base under everything (top bar and hint strip sit on it).
  ctx.fillStyle = '#17100d';
  ctx.fillRect(0, 0, 1280, 720);
  // Warm wood-plank floor: horizontal planks, 32px tall, staggered
  // seams, alternating grain tones and a dark seam per plank.
  const PH = 32;
  for (let y = FLOOR.y; y < FLOOR.y + FLOOR.h; y += PH) {
    const row = Math.floor((y - FLOOR.y) / PH);
    const off = (row % 2) * 130;
    for (let sx = -off; sx < FLOOR.w; sx += 260) {
      const seg = Math.floor((sx + off) / 260);
      const x0 = Math.max(0, sx);
      const x1 = Math.min(FLOOR.w, sx + 260);
      if (x1 <= x0) continue;
      ctx.fillStyle = WOODS[(row + seg) % WOODS.length];
      ctx.fillRect(x0, y, x1 - x0, PH);
      // Grain streaks: one dark, one warm highlight per plank.
      ctx.fillStyle = 'rgba(0,0,0,0.10)';
      ctx.fillRect(x0 + 8, y + 9, Math.max(0, x1 - x0 - 16), 2);
      ctx.fillStyle = 'rgba(255,220,160,0.07)';
      ctx.fillRect(x0 + 8, y + 21, Math.max(0, x1 - x0 - 16), 2);
      ctx.fillStyle = 'rgba(20,10,4,0.55)';
      ctx.fillRect(x1 - 2, y, 2, PH);
    }
    ctx.fillStyle = 'rgba(20,10,4,0.5)';
    ctx.fillRect(0, y + PH - 2, FLOOR.w, 2);
  }
  // Slate threshold band across the floor just below the counter
  // (y 292–330), with brass grout and a compass medallion inlaid
  // at its centre — the harbour emblem of the rooftop kitchen.
  for (let x = 0; x < FLOOR.w; x += 52) {
    const i = Math.floor(x / 52);
    ctx.fillStyle = SLATES[i % 2];
    ctx.fillRect(x, 292, 52, 38);
    ctx.fillStyle = 'rgba(255,220,160,0.06)';
    ctx.fillRect(x + 4, 296, 44, 3);
  }
  ctx.fillStyle = '#c9a24a';
  ctx.fillRect(0, 292, FLOOR.w, 2);
  ctx.fillRect(0, 328, FLOOR.w, 2);
  for (let x = 0; x <= FLOOR.w; x += 52) ctx.fillRect(x, 292, 2, 38);
  // Brass compass medallion inlaid in the open floor left of the
  // island — the harbour emblem of the rooftop kitchen. (It lived
  // in the slate band first, but the PLATING ISLAND tag covered it.)
  const mx = 290, my = 440;
  ctx.strokeStyle = '#c9a24a';
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(mx, my, 20, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#c9a24a';
  ctx.beginPath(); ctx.arc(mx, my, 14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3d4a4f';
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(mx + Math.cos(a) * 13, my + Math.sin(a) * 13);
    ctx.lineTo(mx + Math.cos(a + 0.35) * 5, my + Math.sin(a + 0.35) * 5);
    ctx.lineTo(mx + Math.cos(a - 0.35) * 5, my + Math.sin(a - 0.35) * 5);
    ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = '#ffd94d';
  ctx.beginPath(); ctx.arc(mx, my, 3, 0, Math.PI * 2); ctx.fill();
  // Warm lantern light pools on the floor.
  const pools = [[260, 340, 160], [700, 440, 180], [920, 340, 140], [520, 600, 160], [300, 460, 140]];
  for (const [x, y, r] of pools) {
    const g = ctx.createRadialGradient(x, y, 8, x, y, r);
    g.addColorStop(0, 'rgba(255,190,90,0.20)');
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

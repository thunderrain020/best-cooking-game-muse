// Ember & Tide — render/backdrop.js
// The sunset rooftop harbour: twilight sky, low sun, harbour water with
// reflections, boat / lighthouse / crane silhouettes, a wooden rooftop
// railing, and glowing string lanterns above the kitchen.

import { roundRectPath } from '../core/util.js';

export function drawBackdrop(ctx, now) {
  const sky = ctx.createLinearGradient(0, 0, 0, 720);
  sky.addColorStop(0, '#241a44');
  sky.addColorStop(0.3, '#6e3358');
  sky.addColorStop(0.52, '#c65a3d');
  sky.addColorStop(0.68, '#f2a54a');
  sky.addColorStop(0.8, '#7a4a3a');
  sky.addColorStop(1, '#2e2233');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 1280, 720);

  // Low sun and its glow.
  const sun = ctx.createRadialGradient(1010, 178, 10, 1010, 178, 230);
  sun.addColorStop(0, 'rgba(255,214,130,0.95)');
  sun.addColorStop(0.4, 'rgba(255,170,80,0.5)');
  sun.addColorStop(1, 'rgba(255,170,80,0)');
  ctx.fillStyle = sun;
  ctx.fillRect(740, 0, 540, 430);
  ctx.fillStyle = '#ffe6a8';
  ctx.beginPath(); ctx.arc(1010, 182, 50, 0, Math.PI * 2); ctx.fill();

  // Distant skyline: warehouses, a lighthouse, cranes, masts.
  ctx.fillStyle = '#241a33';
  for (let i = 0; i < 14; i++) {
    const bx = 30 + i * 92;
    const bh = 24 + ((i * 37) % 42);
    ctx.fillRect(bx, 296 - bh, 54, bh + 64);
    ctx.fillStyle = '#ffd94d';
    ctx.fillRect(bx + 8, 296 - bh + 8, 6, 6);
    ctx.fillRect(bx + 28, 296 - bh + 16, 6, 6);
    ctx.fillStyle = '#241a33';
  }
  // Lighthouse, left of centre.
  ctx.fillRect(560, 196, 26, 104);
  ctx.fillStyle = '#ffd94d';
  ctx.fillRect(554, 182, 38, 16);
  ctx.fillStyle = 'rgba(255,217,77,0.35)';
  ctx.beginPath(); ctx.moveTo(592, 190); ctx.lineTo(700, 168); ctx.lineTo(700, 212); ctx.closePath(); ctx.fill();
  // Cranes.
  ctx.strokeStyle = '#1d1428'; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(180, 300); ctx.lineTo(180, 210); ctx.lineTo(300, 210); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(300, 210); ctx.lineTo(268, 268); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(1120, 300); ctx.lineTo(1120, 226); ctx.lineTo(1210, 226); ctx.stroke();
  // Boats on the waterline.
  ctx.fillStyle = '#1d1428';
  ctx.beginPath(); ctx.moveTo(700, 330); ctx.lineTo(790, 330); ctx.lineTo(762, 348); ctx.lineTo(724, 348); ctx.closePath(); ctx.fill();
  ctx.fillRect(742, 296, 6, 34);
  ctx.beginPath(); ctx.moveTo(748, 296); ctx.lineTo(748, 322); ctx.lineTo(786, 322); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(380, 336); ctx.lineTo(452, 336); ctx.lineTo(432, 350); ctx.lineTo(398, 350); ctx.closePath(); ctx.fill();

  // Harbour water with slow reflections.
  ctx.fillStyle = '#1d3a4d';
  ctx.fillRect(0, 348, 1280, 372);
  ctx.fillStyle = 'rgba(255,190,110,0.22)';
  for (let i = 0; i < 10; i++) {
    const y = 372 + i * 36;
    const off = Math.sin(now * 0.7 + i * 1.7) * 16;
    ctx.fillRect(180 + off, y, 300 - i * 18, 3);
    ctx.fillRect(820 - off, y + 12, 260 - i * 14, 3);
  }

  // Wooden rooftop railing across the waterline.
  ctx.fillStyle = '#4a2c14';
  ctx.fillRect(0, 356, 1280, 10);
  for (let x = 20; x < 1280; x += 86) ctx.fillRect(x, 366, 10, 44);
  ctx.fillStyle = '#6d4526';
  ctx.fillRect(0, 356, 1280, 4);

  // String lanterns above the kitchen.
  ctx.strokeStyle = 'rgba(40,20,10,0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, 8); ctx.quadraticCurveTo(640, 52, 1280, 8); ctx.stroke();
  for (let i = 0; i < 26; i++) {
    const t = i / 25;
    const x = t * 1280;
    const y = 8 + Math.sin(t * Math.PI) * 40;
    const glow = 0.6 + 0.4 * Math.sin(now * 2 + i);
    ctx.fillStyle = `rgba(255,205,110,${0.5 + 0.4 * glow})`;
    ctx.beginPath(); ctx.arc(x, y + 8, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,180,80,0.25)';
    ctx.beginPath(); ctx.arc(x, y + 8, 9, 0, Math.PI * 2); ctx.fill();
  }
}

export function drawCounter(ctx) {
  // The counter band the stations sit on, with a warm top edge.
  const grad = ctx.createLinearGradient(0, 96, 0, 660);
  grad.addColorStop(0, '#8a5a33');
  grad.addColorStop(1, '#5d3a1e');
  ctx.fillStyle = grad;
  roundRectPath(ctx, 272, 96, 994, 548, 18); ctx.fill();
  ctx.fillStyle = 'rgba(255,220,160,0.16)';
  roundRectPath(ctx, 272, 96, 994, 26, 18); ctx.fill();
  ctx.fillStyle = '#6d4526';
  ctx.fillRect(272, 428, 994, 8);
}

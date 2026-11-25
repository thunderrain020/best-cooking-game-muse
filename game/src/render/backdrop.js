// Ember & Tide — render/backdrop.js
// The sunset rooftop harbour: twilight sky, low sun, harbour water with
// reflections, boat / lighthouse / crane silhouettes, a wooden rooftop
// railing, and glowing string lanterns above the kitchen.

import { roundRectPath } from '../core/util.js';

export function drawBackdrop(ctx, now) {
  const sky = ctx.createLinearGradient(0, 0, 0, 720);
  sky.addColorStop(0, '#131126');
  sky.addColorStop(0.28, '#2c1d42');
  sky.addColorStop(0.5, '#7a3350');
  sky.addColorStop(0.64, '#ff8c42');
  sky.addColorStop(0.78, '#f2a54a');
  sky.addColorStop(0.88, '#5a3a4a');
  sky.addColorStop(1, '#1c1426');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 1280, 720);

  // Low sun and its glow.
  const sun = ctx.createRadialGradient(1010, 178, 10, 1010, 178, 260);
  sun.addColorStop(0, 'rgba(255,214,130,0.98)');
  sun.addColorStop(0.4, 'rgba(255,140,66,0.55)');
  sun.addColorStop(1, 'rgba(255,140,66,0)');
  ctx.fillStyle = sun;
  ctx.fillRect(720, 0, 560, 460);
  ctx.fillStyle = '#ffe6a8';
  ctx.beginPath(); ctx.arc(1010, 182, 50, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#ff8c42';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(1010, 182, 58, 0, Math.PI * 2); ctx.stroke();

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

  // Harbour water with bright sunset reflections.
  ctx.fillStyle = '#16324a';
  ctx.fillRect(0, 348, 1280, 372);
  ctx.fillStyle = 'rgba(255,217,77,0.34)';
  for (let i = 0; i < 10; i++) {
    const y = 372 + i * 36;
    const off = Math.sin(now * 0.7 + i * 1.7) * 16;
    ctx.fillRect(180 + off, y, 300 - i * 18, 3);
    ctx.fillRect(820 - off, y + 12, 260 - i * 14, 3);
  }
  ctx.fillStyle = 'rgba(255,140,66,0.28)';
  for (let i = 0; i < 6; i++) {
    const y = 384 + i * 52;
    ctx.fillRect(940 + Math.sin(now + i) * 10, y, 180, 3);
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
    ctx.fillStyle = 'rgba(255,180,80,0.3)';
    ctx.beginPath(); ctx.arc(x, y + 8, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `rgba(255,205,110,${0.6 + 0.4 * glow})`;
    ctx.beginPath(); ctx.arc(x, y + 8, 5, 0, Math.PI * 2); ctx.fill();
    if (i % 5 === 2) {
      // A proper paper lantern: warm gold body, ink outline, lit from within.
      ctx.fillStyle = '#ffb347';
      roundRectPath(ctx, x - 7, y + 12, 14, 16, 7); ctx.fill();
      ctx.strokeStyle = '#1a120b';
      ctx.lineWidth = 1.5;
      roundRectPath(ctx, x - 7, y + 12, 14, 16, 7); ctx.stroke();
      ctx.fillStyle = '#fff3c4';
      ctx.fillRect(x - 3, y + 16, 6, 8);
    }
  }
}

export function drawCounter(ctx) {
  // Dark espresso / charcoal counter deck: bright stations and food pop
  // off it at once. 2.5px ink border plus a warm brass trim along the top.
  const grad = ctx.createLinearGradient(0, 96, 0, 660);
  grad.addColorStop(0, '#231b18');
  grad.addColorStop(1, '#17100d');
  ctx.fillStyle = grad;
  roundRectPath(ctx, 272, 96, 994, 548, 18); ctx.fill();
  ctx.strokeStyle = '#1a120b';
  ctx.lineWidth = 2.5;
  roundRectPath(ctx, 272, 96, 994, 548, 18); ctx.stroke();
  ctx.fillStyle = '#c9a24a';
  ctx.fillRect(276, 100, 986, 3);
  // Subtle wood grain on the dark deck.
  ctx.fillStyle = 'rgba(255,220,160,0.05)';
  for (let i = 0; i < 12; i++) ctx.fillRect(280 + (i * 83) % 980, 110 + (i % 5) * 104, 60, 2);
  ctx.fillStyle = '#3a2418';
  ctx.fillRect(272, 428, 994, 8);
}

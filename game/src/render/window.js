// Ember & Tide — render/window.js
// The open rooftop pass-through window above the counter (y 88–140):
// a second, closer harbour skyline — warehouses, lighthouse, cranes,
// boats on a water strip — plus a swag of glowing string lanterns and
// the wooden sill the window sits on. Drawn between the backdrop and
// the counter so the skyline reads in the cover and rush shots.

import { roundRectPath } from '../core/util.js';

export function drawWindowSkyline(ctx, now, storm) {
  // Water strip along the bottom of the window.
  ctx.fillStyle = '#16324a';
  ctx.fillRect(272, 126, 994, 14);
  ctx.fillStyle = 'rgba(255,217,77,0.4)';
  for (let i = 0; i < 8; i++) {
    const x = 300 + i * 120 + Math.sin(now * 0.7 + i) * 8;
    ctx.fillRect(x, 130 + (i % 2) * 5, 52, 2);
  }
  // Near skyline: warehouses with lit windows.
  ctx.fillStyle = '#241a33';
  const sheds = [[300, 22], [380, 30], [470, 18], [640, 26], [730, 20], [860, 28], [1180, 24]];
  for (const [x, h] of sheds) ctx.fillRect(x, 126 - h, 62, h);
  ctx.fillStyle = '#ffd94d';
  for (const [x, h] of sheds) {
    ctx.fillRect(x + 8, 126 - h + 6, 5, 5);
    ctx.fillRect(x + 40, 126 - h + 12, 5, 5);
  }
  // Lighthouse, left of centre, lamp sweeping.
  ctx.fillStyle = '#241a33';
  ctx.fillRect(556, 96, 12, 30);
  ctx.fillStyle = '#ffd94d';
  ctx.fillRect(552, 88, 20, 9);
  ctx.fillStyle = 'rgba(255,217,77,0.3)';
  ctx.beginPath(); ctx.moveTo(572, 92); ctx.lineTo(660, 82); ctx.lineTo(660, 102); ctx.closePath(); ctx.fill();
  // Cranes.
  ctx.strokeStyle = '#1d1428'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(420, 126); ctx.lineTo(420, 98); ctx.lineTo(500, 98); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(500, 98); ctx.lineTo(478, 120); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(1140, 126); ctx.lineTo(1140, 100); ctx.lineTo(1210, 100); ctx.stroke();
  // Boats riding the water strip.
  ctx.fillStyle = '#1d1428';
  ctx.beginPath(); ctx.moveTo(690, 132); ctx.lineTo(760, 132); ctx.lineTo(744, 140); ctx.lineTo(706, 140); ctx.closePath(); ctx.fill();
  ctx.fillRect(720, 108, 4, 24);
  ctx.beginPath(); ctx.moveTo(724, 108); ctx.lineTo(724, 130); ctx.lineTo(752, 130); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(920, 134); ctx.lineTo(972, 134); ctx.lineTo(960, 140); ctx.lineTo(932, 140); ctx.closePath(); ctx.fill();
  if (storm) {
    // Storm wash: the window sky turns deep violet-navy, rain slants
    // across it, and a lightning fork tints the far side.
    const wash = ctx.createLinearGradient(0, 88, 0, 140);
    wash.addColorStop(0, 'rgba(38,24,84,0.82)');
    wash.addColorStop(1, 'rgba(18,14,48,0.88)');
    ctx.fillStyle = wash;
    ctx.fillRect(272, 88, 994, 52);
    ctx.strokeStyle = 'rgba(200,210,255,0.55)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 22; i++) {
      const rx = 290 + i * 46 + Math.sin(now * 3 + i) * 6;
      const ry = 92 + (i % 3) * 14;
      ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 7, ry + 12); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(232,230,255,0.9)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(1000, 88); ctx.lineTo(986, 104); ctx.lineTo(998, 108);
    ctx.lineTo(984, 126); ctx.lineTo(994, 128); ctx.stroke();
    ctx.fillStyle = 'rgba(232,230,255,0.14)';
    ctx.beginPath(); ctx.arc(990, 112, 26, 0, Math.PI * 2); ctx.fill();
  }
  // String lanterns swagged across the window.
  ctx.strokeStyle = 'rgba(40,20,10,0.85)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(272, 90); ctx.quadraticCurveTo(769, 122, 1266, 90); ctx.stroke();
  for (let i = 0; i < 13; i++) {
    const t = i / 12;
    const x = 272 + t * 994;
    const y = 90 + Math.sin(t * Math.PI) * 26;
    const glow = 0.6 + 0.4 * Math.sin(now * 2 + i * 1.3);
    ctx.fillStyle = 'rgba(255,180,80,0.3)';
    ctx.beginPath(); ctx.arc(x, y + 6, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `rgba(255,205,110,${0.6 + 0.4 * glow})`;
    ctx.beginPath(); ctx.arc(x, y + 6, 4.5, 0, Math.PI * 2); ctx.fill();
    if (i % 4 === 2) {
      ctx.fillStyle = '#ffb347';
      roundRectPath(ctx, x - 6, y + 10, 12, 14, 6); ctx.fill();
      ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
      roundRectPath(ctx, x - 6, y + 10, 12, 14, 6); ctx.stroke();
      ctx.fillStyle = '#fff3c4';
      ctx.fillRect(x - 2, y + 14, 4, 6);
    }
  }
  // Wooden sill the window sits on, just above the counter top.
  ctx.fillStyle = '#4a2c14';
  ctx.fillRect(272, 134, 994, 6);
  ctx.fillStyle = '#6d4526';
  ctx.fillRect(272, 134, 994, 2);
}

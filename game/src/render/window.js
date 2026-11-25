// Ember & Tide — render/window.js
// The harbour rooftop terrace (x 1040–1280): sky, skyline, lighthouse
// beam, deck, lanterns, set diner tables with order tags, and the Critic.

import { roundRectPath } from '../core/util.js';
import { TERRACE } from './layout.js';
import { drawDiner, drawTable, drawOrderTag } from './diners.js';
import { drawRegulars } from './regulars.js';
import { drawPassArch } from './archway.js';
import { drawHarbourWater } from './water.js';

export function drawTerrace(ctx, g, now) {
  const T = TERRACE;
  const storm = !!(g.rush && g.rush.name.includes('STORM'));
  const sky = ctx.createLinearGradient(0, T.y, 0, T.y + T.h);
  if (storm) {
    sky.addColorStop(0, '#1a1038'); sky.addColorStop(0.5, '#2c1d54'); sky.addColorStop(1, '#141024');
  } else {
    sky.addColorStop(0, '#2c1d42'); sky.addColorStop(0.45, '#7a3350');
    sky.addColorStop(0.7, '#ff8c42'); sky.addColorStop(1, '#5a3a4a');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(T.x, T.y, T.w, T.h);
  if (!storm) {
    ctx.fillStyle = '#ffe6a8';
    ctx.beginPath(); ctx.arc(1196, 150, 26, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#ff8c42'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(1196, 150, 32, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.fillStyle = '#241a33';
  const sheds = [[1052, 24], [1120, 34], [1200, 26]];
  for (const [x, h] of sheds) ctx.fillRect(x, 300 - h, 56, h);
  ctx.fillStyle = '#ffd94d';
  for (const [x, h] of sheds) {
    ctx.fillRect(x + 8, 300 - h + 7, 5, 5);
    ctx.fillRect(x + 36, 300 - h + 13, 5, 5);
  }
  ctx.fillStyle = '#241a33';
  ctx.fillRect(1168, 250, 12, 50);
  ctx.fillStyle = '#ffd94d';
  ctx.fillRect(1164, 242, 20, 9);
  // Lighthouse beam: bright core ray, wide soft wash, lit lamp, gold path on the water.
  ctx.fillStyle = 'rgba(255,217,77,0.3)';
  ctx.beginPath(); ctx.moveTo(1188, 246); ctx.lineTo(1250, 236); ctx.lineTo(1250, 256); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,217,77,0.15)';
  ctx.beginPath(); ctx.moveTo(1188, 246); ctx.lineTo(1252, 228); ctx.lineTo(1252, 264); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,230,160,0.6)';
  ctx.beginPath(); ctx.arc(1174, 246, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,217,77,0.5)';
  for (let i = 0; i < 4; i++) ctx.fillRect(1150 + i * 22, 344 + (i % 2) * 6, 14, 2);
  ctx.strokeStyle = '#1d1428'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(1080, 300); ctx.lineTo(1080, 262); ctx.lineTo(1140, 262); ctx.stroke();
  drawHarbourWater(ctx, T, now);
  ctx.fillStyle = '#6d4526';
  ctx.fillRect(T.x, 360, T.w, T.h - 272);
  ctx.fillStyle = '#4a2c14';
  for (let y = 380; y < T.y + T.h; y += 34) ctx.fillRect(T.x, y, T.w, 3);
  ctx.fillStyle = 'rgba(255,220,160,0.06)';
  for (let i = 0; i < 8; i++) ctx.fillRect(T.x + 10 + (i * 29) % 200, 372 + (i % 6) * 44, 40, 2);
  ctx.strokeStyle = 'rgba(40,20,10,0.85)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(T.x, 96); ctx.quadraticCurveTo(1160, 128, 1280, 96); ctx.stroke();
  for (let i = 0; i < 7; i++) {
    const t = i / 6;
    const x = T.x + t * T.w;
    const y = 96 + Math.sin(t * Math.PI) * 26;
    const glow = 0.6 + 0.4 * Math.sin(now * 2 + i * 1.3);
    ctx.fillStyle = 'rgba(255,180,80,0.3)';
    ctx.beginPath(); ctx.arc(x, y + 6, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `rgba(255,205,110,${0.6 + 0.4 * glow})`;
    ctx.beginPath(); ctx.arc(x, y + 6, 4.5, 0, Math.PI * 2); ctx.fill();
    if (i % 3 === 1) {
      ctx.fillStyle = '#ffb347';
      roundRectPath(ctx, x - 6, y + 10, 12, 14, 6); ctx.fill();
      ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
      roundRectPath(ctx, x - 6, y + 10, 12, 14, 6); ctx.stroke();
      ctx.fillStyle = '#fff3c4';
      ctx.fillRect(x - 2, y + 14, 4, 6);
    }
  }
  // Diner tables: set tables, varied hats/hair, an order tag over each.
  drawOrderTag(ctx, 1120, 376, '#1', 'waiting');
  drawTable(ctx, 1120, 430);
  drawDiner(ctx, 1086, 470, '#c96a3a', g.tickets.length ? 'waiting' : 'happy', 'straw');
  drawDiner(ctx, 1154, 470, '#4a5a8a', g.tickets.length ? 'impatient' : 'happy', 'bun');
  drawOrderTag(ctx, 1120, 540, '#2 · VIP ★', 'happy');
  drawTable(ctx, 1120, 590);
  drawDiner(ctx, 1086, 630, '#7a9e4a', 'happy', 'band');
  drawDiner(ctx, 1154, 630, '#b8860b', 'happy');
  // Critic's table: purple glow when the critic ticket is live.
  const criticHere = g.tickets.some((t) => t.critic);
  ctx.save();
  if (criticHere) {
    ctx.shadowColor = 'rgba(122,59,158,0.9)';
    ctx.shadowBlur = 18;
  }
  drawTable(ctx, 1160, 200);
  ctx.restore();
  drawDiner(ctx, 1160, 238, '#7a3b9e', criticHere ? 'impatient' : 'happy');
  // Named regulars + reactive quotes (names, critic pill, quote lines).
  drawRegulars(ctx, g);
  // Warm timber pass archway on the terrace edge — the kitchen and
  // the terrace are one rooftop restaurant now, no harsh wall split.
  drawPassArch(ctx, g, now);
  if (storm) {
    ctx.strokeStyle = 'rgba(200,210,255,0.55)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 18; i++) {
      const rx = 1050 + i * 13 + Math.sin(now * 3 + i) * 5;
      const ry = 100 + (i % 6) * 40;
      ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 6, ry + 11); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(232,230,255,0.9)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(1200, 96); ctx.lineTo(1188, 116); ctx.lineTo(1198, 120);
    ctx.lineTo(1186, 142); ctx.lineTo(1196, 144); ctx.stroke();
    ctx.fillStyle = 'rgba(232,230,255,0.14)';
    ctx.beginPath(); ctx.arc(1192, 120, 24, 0, Math.PI * 2); ctx.fill();
  }
}

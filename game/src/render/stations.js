// Ember & Tide — render/stations.js
// Chop board and sizzle wok as real equipment on the counter, with
// contact shadows and burner glow. Stations sit at y 140 so the
// harbour window stays open.

import { drawIngredientIcon } from './foodArt.js';
import { roundRectPath, clamp } from '../core/util.js';
import { pillText, stationLabel } from './palette.js';
import { drawSlash, drawFlameBurst, drawBurnerFlame, contactShadow, radialGlow, drawBurnFlames, drawSizzleSparks } from './feel.js';

export const STATION_RECTS = {
  boardRect: { x: 300, y: 140, w: 170, h: 190 },
  wokRect: { x: 490, y: 140, w: 170, h: 190 },
  potRect: { x: 680, y: 140, w: 170, h: 190 },
  plateRect: { x: 870, y: 140, w: 190, h: 190 },
  bellRect: { x: 1080, y: 140, w: 186, h: 190 },
};

function drawKnife(ctx, x, y, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = '#dfe6ec';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(36, -6); ctx.lineTo(36, 6); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(36, -6); ctx.lineTo(36, 6); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = '#5a3a1e'; ctx.fillRect(-14, -4, 16, 8);
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1;
  ctx.strokeRect(-14, -4, 16, 8);
  ctx.restore();
}

// Blue-orange gas burner ring under a wok or pot, with a warm glow
// pooling onto the counter when it is lit.
function drawBurner(ctx, cx, y, now, on) {
  if (on) {
    radialGlow(ctx, cx, y, 74, 'rgba(255,122,40,0.30)');
    radialGlow(ctx, cx, y, 46, 'rgba(80,120,255,0.22)');
  }
  ctx.strokeStyle = '#3a6fd8'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(cx, y, 46, 8, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#ff8a3c'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(cx, y, 30, 5, 0, 0, Math.PI * 2); ctx.stroke();
  if (on) drawBurnerFlame(ctx, cx, y, now, true);
}

export function drawBoardStation(ctx, g, now) {
  const r = STATION_RECTS.boardRect;
  stationLabel(ctx, r.x, r.y, r.w, 'CHOP BOARD', 'Q · click or Space');
  contactShadow(ctx, r.x + r.w / 2, r.y + 158, 80, 9);
  ctx.fillStyle = '#c89a5e';
  roundRectPath(ctx, r.x + 10, r.y + 70, r.w - 20, 82, 8); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2.5;
  roundRectPath(ctx, r.x + 10, r.y + 70, r.w - 20, 82, 8); ctx.stroke();
  ctx.fillStyle = 'rgba(120,70,20,0.35)';
  ctx.fillRect(r.x + 16, r.y + 96, r.w - 32, 2);
  ctx.fillRect(r.x + 16, r.y + 126, r.w - 32, 2);
  ctx.fillStyle = '#231b18';
  ctx.beginPath(); ctx.ellipse(r.x + r.w - 26, r.y + 111, 9, 13, 0, 0, Math.PI * 2); ctx.fill();
  const b = g.board;
  if (b.item) {
    drawIngredientIcon(ctx, b.item, r.x + r.w / 2, r.y + 110, 32);
    for (let i = 0; i < b.chopsNeeded; i++) {
      ctx.fillStyle = i < b.chops ? '#4caf6d' : '#e8dcc2';
      ctx.beginPath();
      ctx.arc(r.x + r.w / 2 - (b.chopsNeeded - 1) * 12 + i * 24, r.y + 150, 7, 0, Math.PI * 2); ctx.fill();
    }
    drawKnife(ctx, r.x + r.w / 2 + 44, r.y + 100, -0.5 - b.anim * 0.9);
    drawSlash(ctx, r.x + r.w / 2, r.y + 110, b.anim, now);
    ctx.fillStyle = '#7cb342';
    ctx.fillRect(r.x + 22, r.y + 138, 6, 4);
    ctx.fillRect(r.x + 34, r.y + 142, 5, 4);
    ctx.fillStyle = '#e8442e';
    ctx.fillRect(r.x + r.w - 36, r.y + 136, 6, 4);
  } else {
    drawKnife(ctx, r.x + r.w / 2 + 30, r.y + 110, -0.4);
    ctx.fillStyle = 'rgba(255,246,227,0.5)';
    ctx.beginPath(); ctx.ellipse(r.x + r.w / 2 - 20, r.y + 110, 26, 8, 0, 0, Math.PI * 2); ctx.fill();
  }
}

export function drawWokStation(ctx, g, now) {
  const r = STATION_RECTS.wokRect;
  stationLabel(ctx, r.x, r.y, r.w, 'SIZZLE WOK', 'W · Space to pull');
  const cx = r.x + r.w / 2;
  const w = g.wok;
  contactShadow(ctx, cx, r.y + 166, 72, 9);
  drawBurner(ctx, cx, r.y + 160, now, w.state === 'cooking');
  // Round cast-iron wok with a long riveted handle.
  const grad = ctx.createRadialGradient(cx, r.y + 104, 6, cx, r.y + 104, 62);
  grad.addColorStop(0, w.state === 'burning' ? '#3a2a24' : '#4a4a55');
  grad.addColorStop(1, '#23232c');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.ellipse(cx, r.y + 104, 62, 36, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.ellipse(cx, r.y + 104, 62, 36, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#9aa2ad'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(cx, r.y + 104, 62, 36, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  ctx.save();
  ctx.translate(cx + 58, r.y + 100); ctx.rotate(-0.35);
  ctx.fillStyle = '#3c3e48'; ctx.fillRect(0, -5, 42, 10);
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2; ctx.strokeRect(0, -5, 42, 10);
  ctx.fillStyle = '#c9a24a';
  ctx.beginPath(); ctx.arc(8, 0, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(18, 0, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  if (w.item) {
    drawIngredientIcon(ctx, w.item, cx, r.y + 96, 30);
    if (w.state === 'cooking') {
      drawSizzleSparks(ctx, cx, r.y + 92, now);
      const bx = r.x + 6, by = r.y + 172, bw = r.w - 12, bh = 12;
      ctx.fillStyle = '#2a1a12'; roundRectPath(ctx, bx, by, bw, bh, 6); ctx.fill();
      ctx.fillStyle = '#e8442e'; roundRectPath(ctx, bx + bw * 0.85, by, bw * 0.15, bh, 6); ctx.fill();
      ctx.fillStyle = '#4caf6d'; ctx.fillRect(bx + bw * w.perfect[0], by, bw * (w.perfect[1] - w.perfect[0]), bh);
      const frac = clamp(w.t / w.dur, 0, 1);
      ctx.fillStyle = '#ffd94d';
      ctx.beginPath(); ctx.moveTo(bx + bw * frac, by - 5); ctx.lineTo(bx + bw * frac - 6, by - 14); ctx.lineTo(bx + bw * frac + 6, by - 14); ctx.closePath(); ctx.fill();
      pillText(ctx, 'PERFECT', cx, by + 14, 'bold 10px system-ui, sans-serif', '#4caf6d');
      if (w.anim > 0.6) drawFlameBurst(ctx, cx, r.y + 96, now);
    } else if (w.state === 'burning') {
      const pulse = 0.8 + 0.2 * Math.sin(now * 8);
      ctx.save(); ctx.globalAlpha = pulse;
      pillText(ctx, 'BURNING! CLICK TO TOSS', cx, r.y + 178, 'bold 11px system-ui, sans-serif', '#fff', '#ff5a2e');
      ctx.restore();
      drawBurnFlames(ctx, cx, r.y + 96, now);
    }
  }
}

export { drawBurner };
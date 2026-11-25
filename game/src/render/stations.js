// Ember & Tide — render/stations.js
// Chop board, sizzle wok, simmer pot. Status callouts live in dark pills.

import { drawIngredientIcon } from './foodArt.js';
import { drawBroth } from './plates.js';
import { roundRectPath, clamp } from '../core/util.js';
import { pillText, stationLabel, stationDeck, C } from './palette.js';
import { drawSlash, drawFlameBurst, drawBurnerFlame } from './feel.js';

export const STATION_RECTS = {
  boardRect: { x: 300, y: 132, w: 170, h: 190 },
  wokRect: { x: 490, y: 132, w: 170, h: 190 },
  potRect: { x: 680, y: 132, w: 170, h: 190 },
  plateRect: { x: 870, y: 132, w: 190, h: 190 },
  bellRect: { x: 1080, y: 132, w: 186, h: 190 },
};

const deck = stationDeck;

export function drawBoardStation(ctx, g, now) {
  const r = STATION_RECTS.boardRect;
  stationLabel(ctx, r.x, r.y, r.w, 'CHOP BOARD', 'Q · click or Space');
  deck(ctx, r, '#a9763f');
  ctx.fillStyle = 'rgba(255,220,160,0.25)';
  ctx.fillRect(r.x + 6, r.y + 62, r.w - 12, 4);
  ctx.fillStyle = '#d9b380';
  roundRectPath(ctx, r.x + 8, r.y + 76, r.w - 16, 84, 8); ctx.fill();
  ctx.fillStyle = 'rgba(120,70,20,0.35)';
  ctx.fillRect(r.x + 14, r.y + 100, r.w - 28, 2);
  ctx.fillRect(r.x + 14, r.y + 130, r.w - 28, 2);
  const b = g.board;
  if (b.item) {    drawIngredientIcon(ctx, b.item, r.x + r.w / 2, r.y + 118, 32);
    for (let i = 0; i < b.chopsNeeded; i++) {
      ctx.fillStyle = i < b.chops ? '#4caf6d' : '#e8dcc2';
      ctx.beginPath();
      ctx.arc(r.x + r.w / 2 - (b.chopsNeeded - 1) * 12 + i * 24, r.y + 156, 7, 0, Math.PI * 2); ctx.fill();
    }
    ctx.save();
    ctx.translate(r.x + r.w / 2 + 44, r.y + 100);
    ctx.rotate(-0.5 - b.anim * 0.9);
    ctx.fillStyle = '#cfd6dd';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(34, -6); ctx.lineTo(34, 6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5a3a1e'; ctx.fillRect(-14, -4, 16, 8);
    ctx.restore();
    drawSlash(ctx, r.x + r.w / 2, r.y + 118, b.anim, now);
  } else {
    // Illustrated empty board: clean wood and a resting knife.
    ctx.save();
    ctx.translate(r.x + r.w / 2 + 30, r.y + 118);
    ctx.rotate(-0.4);
    ctx.fillStyle = '#cfd6dd';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(36, -6); ctx.lineTo(36, 6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5a3a1e'; ctx.fillRect(-14, -4, 16, 8);
    ctx.restore();
    ctx.fillStyle = 'rgba(255,246,227,0.5)';
    ctx.beginPath(); ctx.ellipse(r.x + r.w / 2 - 20, r.y + 118, 26, 8, 0, 0, Math.PI * 2); ctx.fill();
  }
}
export function drawWokStation(ctx, g, now) {
  const r = STATION_RECTS.wokRect;
  stationLabel(ctx, r.x, r.y, r.w, 'SIZZLE WOK', 'W · Space to pull');
  deck(ctx, r, C.slateDeck);
  const w = g.wok;
  drawBurnerFlame(ctx, r.x + r.w / 2, r.y + 168, now, w.state === 'cooking');
  const grad = ctx.createRadialGradient(r.x + r.w / 2, r.y + 110, 6, r.x + r.w / 2, r.y + 110, 62);
  grad.addColorStop(0, w.state === 'burning' ? '#3a2a24' : '#4a4a55');
  grad.addColorStop(1, '#23232c');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.ellipse(r.x + r.w / 2, r.y + 112, 62, 40, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#888'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(r.x + r.w / 2, r.y + 112, 62, 40, 0, Math.PI, Math.PI * 2); ctx.stroke();
  if (w.item) {
    drawIngredientIcon(ctx, w.item, r.x + r.w / 2, r.y + 104, 30);
    if (w.state === 'cooking') {
      const bx = r.x + 6, by = r.y + 182, bw = r.w - 12, bh = 12;
      ctx.fillStyle = '#2a1a12'; roundRectPath(ctx, bx, by, bw, bh, 6); ctx.fill();
      ctx.fillStyle = '#e8442e'; roundRectPath(ctx, bx + bw * 0.85, by, bw * 0.15, bh, 6); ctx.fill();
      ctx.fillStyle = '#4caf6d'; ctx.fillRect(bx + bw * w.perfect[0], by, bw * (w.perfect[1] - w.perfect[0]), bh);
      const frac = clamp(w.t / w.dur, 0, 1);
      ctx.fillStyle = '#ffd94d';
      ctx.beginPath(); ctx.moveTo(bx + bw * frac, by - 5); ctx.lineTo(bx + bw * frac - 6, by - 14); ctx.lineTo(bx + bw * frac + 6, by - 14); ctx.closePath(); ctx.fill();
      pillText(ctx, 'PERFECT', r.x + r.w / 2, by + 16, 'bold 10px system-ui, sans-serif', '#4caf6d');
      if (w.anim > 0.6) drawFlameBurst(ctx, r.x + r.w / 2, r.y + 104, now);
    } else if (w.state === 'burning') {
      const pulse = 0.8 + 0.2 * Math.sin(now * 8);
      ctx.save(); ctx.globalAlpha = pulse;
      pillText(ctx, 'BURNING! CLICK TO TOSS', r.x + r.w / 2, r.y + 178, 'bold 11px system-ui, sans-serif', '#fff', '#ff5a2e');
      ctx.restore();
      drawFlameBurst(ctx, r.x + r.w / 2, r.y + 104, now);
    }
  }
}

export function drawPotStation(ctx, g, now) {
  const r = STATION_RECTS.potRect;
  stationLabel(ctx, r.x, r.y, r.w, 'SIMMER POT', 'E · it finishes itself');
  deck(ctx, r, C.slateDeck);
  drawBurnerFlame(ctx, r.x + r.w / 2, r.y + 168, now, g.pot.state === 'cooking');
  const p = g.pot;
  const grad = ctx.createLinearGradient(r.x, r.y + 70, r.x, r.y + 170);
  grad.addColorStop(0, '#7a7d88'); grad.addColorStop(1, '#3c3e48');
  ctx.fillStyle = grad;
  roundRectPath(ctx, r.x + 18, r.y + 66, r.w - 36, 92, 12); ctx.fill();
  if (p.state === 'cooking') {
    drawBroth(ctx, r.x + r.w / 2, r.y + 70, (r.w - 36) / 2, now);
    for (let i = 0; i < 4; i++) {
      const bx = r.x + r.w / 2 - 30 + i * 20 + Math.sin(now * 3 + i * 2) * 3;
      const by = r.y + 66 - ((now * 14 + i * 9) % 22);
      ctx.fillStyle = 'rgba(255,240,200,0.8)';
      ctx.beginPath(); ctx.arc(bx, by, 3 + (i % 2), 0, Math.PI * 2); ctx.fill();
    }
    const frac = clamp(p.t / p.dur, 0, 1);
    ctx.fillStyle = '#2a1a12'; roundRectPath(ctx, r.x + 6, r.y + 182, r.w - 12, 10, 5); ctx.fill();
    ctx.fillStyle = '#f2a54a'; roundRectPath(ctx, r.x + 6, r.y + 182, (r.w - 12) * frac, 10, 5); ctx.fill();
    if (p.item) drawIngredientIcon(ctx, p.item, r.x + r.w / 2, r.y + 112, 22);
  } else {
    drawBroth(ctx, r.x + r.w / 2, r.y + 70, (r.w - 36) / 2, now);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.ellipse(r.x + r.w / 2, r.y + 112, 18, 6, 0, 0, Math.PI * 2); ctx.fill();
  }
}


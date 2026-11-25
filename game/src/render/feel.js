// Ember & Tide — render/feel.js
// Action juice: knife slash arcs on the chop board, the flame burst ring
// on a PERFECT wok pull, and the golden shimmer that marks VIP tickets
// and a ready Pass Bell. All of it is drawn, never text-only.

import { C } from './palette.js';

export function drawSlash(ctx, cx, cy, anim, now) {
  if (anim <= 0) return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.6 + (1 - anim) * 1.2);
  ctx.strokeStyle = `rgba(255,255,255,${0.9 * anim})`;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, 0, 42, -0.9, 0.5);
  ctx.stroke();
  ctx.strokeStyle = `rgba(255,217,77,${0.8 * anim})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 52, -0.7, 0.3);
  ctx.stroke();
  ctx.restore();
}

export function drawFlameBurst(ctx, cx, cy, now) {
  const pulse = 1 + 0.12 * Math.sin(now * 10);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(pulse, pulse);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + now * 0.8;
    const r = 34 + 6 * Math.sin(now * 6 + i);
    ctx.fillStyle = i % 2 ? '#ff8a3c' : '#ffd94d';
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 10, Math.sin(a) * 8);
    ctx.quadraticCurveTo(Math.cos(a) * r, Math.sin(a) * r * 0.7, Math.cos(a + 0.5) * 10, Math.sin(a + 0.5) * 8);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

export function drawShimmer(ctx, x, y, w, h, now) {
  const t = ((now * 0.35) % 1);
  const sx = x + t * (w + 80) - 40;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  const grad = ctx.createLinearGradient(sx - 30, y, sx + 30, y);
  grad.addColorStop(0, 'rgba(255,217,77,0)');
  grad.addColorStop(0.5, 'rgba(255,217,77,0.55)');
  grad.addColorStop(1, 'rgba(255,217,77,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

export function drawBurnerFlame(ctx, cx, y, now, big) {
  const h = big ? 16 : 10;
  for (let i = -1; i <= 1; i++) {
    const flick = Math.sin(now * 9 + i * 2.1) * 3;
    ctx.fillStyle = i === 0 ? '#ff9a3c' : '#e8703f';
    ctx.beginPath();
    ctx.moveTo(cx + i * 16 - 7, y);
    ctx.quadraticCurveTo(cx + i * 16, y - h - flick, cx + i * 16 + 7, y);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#ffd94d';
  ctx.beginPath();
  ctx.ellipse(cx, y - 2, 26, 3, 0, 0, Math.PI * 2);
  ctx.fill();
}

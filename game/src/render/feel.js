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
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + now * 0.8;
    const r = 40 + 6 * Math.sin(now * 6 + i);
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

// Soft dark contact shadow that grounds equipment on the counter.
export function contactShadow(ctx, cx, cy, rx, ry) {
  ctx.fillStyle = 'rgba(8,4,2,0.45)';
  ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(8,4,2,0.25)';
  ctx.beginPath(); ctx.ellipse(cx, cy, rx * 0.8, ry * 0.7, 0, 0, Math.PI * 2); ctx.fill();
}

// Warm radial glow (heat lamp, burner) pooling onto the counter.
export function radialGlow(ctx, cx, cy, r, color) {
  const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, r);
  grad.addColorStop(0, color);
  grad.addColorStop(1, 'rgba(255,140,66,0)');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
}

// Tall flickering orange-red flames + dark smoke puffs: BURNING! must
// read as danger even at thumbnail scale.
export function drawBurnFlames(ctx, cx, y, now) {
  for (let i = 0; i < 4; i++) {
    const fx = cx - 30 + i * 20;
    const flick = Math.sin(now * 11 + i * 2.4) * 7;
    const h = 24 + ((i * 13) % 10) + flick;
    ctx.fillStyle = i % 2 ? '#ff5a2e' : '#ff8a3c';
    ctx.beginPath();
    ctx.moveTo(fx - 9, y);
    ctx.quadraticCurveTo(fx - 4, y - h * 0.6, fx, y - h);
    ctx.quadraticCurveTo(fx + 4, y - h * 0.6, fx + 9, y);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath();
    ctx.moveTo(fx - 4, y);
    ctx.quadraticCurveTo(fx, y - h * 0.45, fx + 4, y);
    ctx.closePath(); ctx.fill();
  }
  for (let i = 0; i < 3; i++) {
    // Smoke capped below the wok tag: it rises from the pan but never
    // crosses the station tag pill above it.
    const sy = y - 20 - ((now * 26 + i * 23) % 24);
    const sx = cx - 18 + i * 18 + Math.sin(now * 2 + i * 2) * 5;
    ctx.fillStyle = 'rgba(30,20,20,0.55)';
    ctx.beginPath(); ctx.arc(sx, sy, 7 + i * 2, 0, Math.PI * 2); ctx.fill();
  }
}

// Gentle rising steam wisps above a plated dish: thin curling strokes
// that drift and fade, capped well below the station tag above.
export function drawSteamWisps(ctx, cx, y, now, n) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,244,220,0.55)';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const sx = cx + (i - (n - 1) / 2) * 26;
    const sway = Math.sin(now * 1.4 + i * 2.1) * 5;
    const rise = 10 + ((now * 12 + i * 17) % 18);
    ctx.globalAlpha = 0.55 - (rise / 28) * 0.35;
    ctx.beginPath();
    ctx.moveTo(sx, y);
    ctx.bezierCurveTo(sx + sway - 6, y - rise * 0.4, sx + sway + 6, y - rise * 0.7, sx + sway, y - rise);
    ctx.stroke();
  }
  ctx.restore();
}

// Deterministic sizzle sparks rising off a cooking wok, V7: more
// sparks, bigger and brighter, over a warm ember glow pooling in
// the pan — cooking feedback that pops at thumbnail size.
export function drawSizzleSparks(ctx, cx, y, now) {
  radialGlow(ctx, cx, y + 8, 52, 'rgba(255,122,40,0.34)');
  radialGlow(ctx, cx, y, 34, 'rgba(255,217,77,0.30)');
  for (let i = 0; i < 10; i++) {
    const t = (now * 1.6 + i * 0.1) % 1;
    const sx = cx - 38 + ((i * 53) % 76) + Math.sin(now * 5 + i) * 4;
    const sy = y - t * 44;
    ctx.fillStyle = i % 3 === 0 ? '#fff3c4' : i % 3 === 1 ? 'rgba(255,190,80,0.95)' : 'rgba(255,140,60,0.95)';
    ctx.beginPath(); ctx.arc(sx, sy, 3.4 - t * 1.2, 0, Math.PI * 2); ctx.fill();
    // Star glint on the brightest sparks.
    if (i % 3 === 0) {
      ctx.strokeStyle = 'rgba(255,240,200,0.9)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sx - 5, sy); ctx.lineTo(sx + 5, sy);
      ctx.moveTo(sx, sy - 5); ctx.lineTo(sx, sy + 5);
      ctx.stroke();
    }
  }
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

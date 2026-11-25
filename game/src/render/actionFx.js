// Ember & Tide — render/actionFx.js
// Kinetic cooking action: the knife slash + chopped confetti bits flying
// off the active board, and the tossed item + flame licks leaping above
// the active wok/grill. All motion is driven by `now` in modulo cycles
// (same style as the sizzle sparks), so a staged capture shows a lively
// mid-action frame and live play reads as hands-on cooking, not static
// icons. The chop action keys off mid-chop state (item on the board,
// chops remaining) — not the chop `anim`, which the settle loop ages to
// zero before a capture — so it is visible in the screenshots.

import { drawIngredientIcon } from './foodArt.js';

const CONFETTI = ['#4caf6d', '#e8442e', '#a8d94a', '#ffd94d', '#7ec850', '#ff8a3c'];

// Crisp knife slash arc sweeping over the item plus chopped herb /
// chilli confetti bits tumbling upward off the board. (cx, cy) is the
// item centre on the board; the bits rise to ~46px above it, clear of
// the station tag pill above the board.
export function drawChopAction(ctx, cx, cy, now) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.7 + Math.sin(now * 2.4) * 0.35);
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, 0, 34, -1.0, 0.4); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,217,77,0.85)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 0, 42, -0.8, 0.2); ctx.stroke();
  ctx.restore();
  for (let i = 0; i < 8; i++) {
    const t = (now * 0.9 + i * 0.13) % 1;
    const bx = cx - 34 + ((i * 37) % 68) + Math.sin(now * 4 + i * 1.7) * 3;
    const by = cy - 12 - t * 34;
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(i * 0.9 + now * 3);
    ctx.globalAlpha = 0.95 - t * 0.55;
    ctx.fillStyle = CONFETTI[i % CONFETTI.length];
    ctx.fillRect(-3, -2, 6, 4);
    ctx.restore();
  }
}

// Small flame tongues leaping above the pan, cycling with `now`. The
// tallest tip stays ~7px below the station tag pill above the station.
export function drawFlameLicks(ctx, cx, y, now) {
  for (let i = 0; i < 4; i++) {
    const t = (now * 1.4 + i * 0.25) % 1;
    const fx = cx - 30 + i * 20 + Math.sin(now * 5 + i * 2) * 3;
    const h = 10 + 14 * (1 - Math.abs(2 * t - 1));
    const fy = y - t * 26;
    ctx.fillStyle = i % 2 ? 'rgba(255,138,60,0.95)' : 'rgba(255,217,77,0.95)';
    ctx.beginPath();
    ctx.moveTo(fx - 5, fy);
    ctx.quadraticCurveTo(fx, fy - h, fx + 5, fy);
    ctx.closePath(); ctx.fill();
  }
}

// The ingredient tossed in an arc above the pan: it leaps up and falls
// back in a looping parabola, trailing ember sparks, with flame licks
// underneath. panY is the item's resting y in the pan; the toss peaks
// 28px above it, clear of the station tag pill.
export function drawTossAction(ctx, cx, panY, now, item) {
  const t = (now * 0.8) % 1;
  const tx = cx - 22 + 44 * t;
  const ty = panY - 6 - 28 * 4 * t * (1 - t);
  drawIngredientIcon(ctx, item, tx, ty, 18);
  for (let i = 0; i < 3; i++) {
    const st = (t + i * 0.22) % 1;
    const sx = cx - 22 + 44 * st;
    const sy = panY - 6 - 28 * 4 * st * (1 - st) + 8;
    ctx.fillStyle = 'rgba(255,190,80,0.9)';
    ctx.beginPath(); ctx.arc(sx, sy, 2.5, 0, Math.PI * 2); ctx.fill();
  }
  drawFlameLicks(ctx, cx, panY - 6, now);
}

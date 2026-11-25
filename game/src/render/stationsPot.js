// Ember & Tide — render/stationsPot.js
// The simmer pot: a deep copper / steel stockpot with two side loop
// handles, bubbling golden broth and curling steam, on its gas burner.

import { drawIngredientIcon } from './foodArt.js';
import { drawBroth } from './plates.js';
import { roundRectPath, clamp } from '../core/util.js';
import { pillText, stationLabel } from './palette.js';
import { contactShadow } from './feel.js';
import { STATION_RECTS, drawBurner } from './stations.js';

export function drawPotStation(ctx, g, now) {
  const r = STATION_RECTS.potRect;
  stationLabel(ctx, r.x, r.y, r.w, 'SIMMER POT', 'E · it finishes itself');
  const cx = r.x + r.w / 2;
  const p = g.pot;
  contactShadow(ctx, cx, r.y + 158, 68, 9);
  drawBurner(ctx, cx, r.y + 160, now, p.state === 'cooking');
  const grad = ctx.createLinearGradient(r.x, r.y + 62, r.x, r.y + 154);
  grad.addColorStop(0, '#b87333'); grad.addColorStop(0.5, '#7a7d88'); grad.addColorStop(1, '#3c3e48');
  ctx.fillStyle = grad;
  roundRectPath(ctx, r.x + 20, r.y + 62, r.w - 40, 92, 12); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2.5;
  roundRectPath(ctx, r.x + 20, r.y + 62, r.w - 40, 92, 12); ctx.stroke();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(r.x + 14, r.y + 100, 9, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();
  ctx.beginPath(); ctx.arc(r.x + r.w - 14, r.y + 100, 9, -Math.PI * 0.5, Math.PI * 0.5); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(r.x + 30, r.y + 76); ctx.lineTo(r.x + 30, r.y + 140); ctx.stroke();
  drawBroth(ctx, cx, r.y + 70, (r.w - 40) / 2, now);
  if (p.state === 'cooking') {
    // Tall bright steam curls rising off the broth, clear of the hint text.
    ctx.strokeStyle = 'rgba(255,244,220,0.85)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const sx = cx + (i - 1) * 34;
      const sway = Math.sin(now * 1.6 + i * 2.2) * 6;
      ctx.beginPath();
      ctx.moveTo(sx, r.y + 62);
      ctx.bezierCurveTo(sx + sway - 8, r.y + 50, sx + sway + 8, r.y + 40, sx + sway, r.y + 30);
      ctx.stroke();
    }
    for (let i = 0; i < 6; i++) {
      const bx = cx - 36 + i * 15 + Math.sin(now * 3 + i * 2) * 3;
      const by = r.y + 62 - ((now * 14 + i * 9) % 26);
      ctx.fillStyle = 'rgba(255,240,200,0.9)';
      ctx.beginPath(); ctx.arc(bx, by, 3 + (i % 2), 0, Math.PI * 2); ctx.fill();
    }
    // Redraw the hint line last: steam curls rise past it, and the key
    // must stay crisp on top, never washed out by a wisp.
    ctx.fillStyle = '#ffd94d';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('E · it finishes itself', cx, r.y + 44);
    const frac = clamp(p.t / p.dur, 0, 1);
    ctx.fillStyle = '#2a1a12'; roundRectPath(ctx, r.x + 6, r.y + 172, r.w - 12, 10, 5); ctx.fill();
    ctx.fillStyle = '#f2a54a'; roundRectPath(ctx, r.x + 6, r.y + 172, (r.w - 12) * frac, 10, 5); ctx.fill();
    if (p.item) drawIngredientIcon(ctx, p.item, cx, r.y + 104, 22);
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.ellipse(cx, r.y + 104, 18, 6, 0, 0, Math.PI * 2); ctx.fill();
  }
}

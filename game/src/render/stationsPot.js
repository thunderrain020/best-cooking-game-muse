// Ember & Tide — render/stationsPot.js
// The simmer pot on the bottom wall: a copper / steel stockpot with two
// loop handles, bubbling golden broth and curling steam, on its burner.

import { drawIngredientIcon } from './foodArt.js';
import { drawBroth } from './plates.js';
import { roundRectPath, clamp } from '../core/util.js';
import { stationTag } from './palette.js';
import { contactShadow } from './feel.js';
import { POT_RECT } from './layout.js';
import { drawBurner } from './stations.js';

export function drawPotStation(ctx, g, now) {
  const r = POT_RECT;
  const cx = r.x + r.w / 2;
  const p = g.pot;
  // Tag raised 6px and steam/bubbles capped below it: the key line now
  // sits at r.y-7, steam tops out at r.y+2, bubbles at r.y+4 — the
  // "E · it finishes itself" line never touches steam, bubbles or rim.
  stationTag(ctx, cx, r.y - 6, 'SIMMER POT', 'E · it finishes itself');
  contactShadow(ctx, cx, r.y + 100, 62, 8);
  drawBurner(ctx, cx, r.y + 96, now, p.state === 'cooking');
  const grad = ctx.createLinearGradient(r.x, r.y + 18, r.x, r.y + 92);
  grad.addColorStop(0, '#b87333'); grad.addColorStop(0.5, '#7a7d88'); grad.addColorStop(1, '#3c3e48');
  ctx.fillStyle = grad;
  roundRectPath(ctx, r.x + 22, r.y + 18, r.w - 44, 72, 10); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2.5;
  roundRectPath(ctx, r.x + 22, r.y + 18, r.w - 44, 72, 10); ctx.stroke();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(r.x + 16, r.y + 54, 8, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();
  ctx.beginPath(); ctx.arc(r.x + r.w - 16, r.y + 54, 8, -Math.PI * 0.5, Math.PI * 0.5); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(r.x + 32, r.y + 30); ctx.lineTo(r.x + 32, r.y + 80); ctx.stroke();
  drawBroth(ctx, cx, r.y + 26, (r.w - 44) / 2, now);
  if (p.state === 'cooking') {
    ctx.strokeStyle = 'rgba(255,244,220,0.85)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const sx = cx + (i - 1) * 30;
      const sway = Math.sin(now * 1.6 + i * 2.2) * 5;
      ctx.beginPath();
      ctx.moveTo(sx, r.y + 18);
      ctx.bezierCurveTo(sx + sway - 7, r.y + 12, sx + sway + 7, r.y + 6, sx + sway, r.y + 2);
      ctx.stroke();
    }
    for (let i = 0; i < 5; i++) {
      const bx = cx - 30 + i * 15 + Math.sin(now * 3 + i * 2) * 3;
      const by = r.y + 16 - ((now * 14 + i * 9) % 12);
      ctx.fillStyle = 'rgba(255,240,200,0.9)';
      ctx.beginPath(); ctx.arc(bx, by, 3 + (i % 2), 0, Math.PI * 2); ctx.fill();
    }
    const frac = clamp(p.t / p.dur, 0, 1);
    ctx.fillStyle = '#2a1a12'; roundRectPath(ctx, r.x + 8, r.y + 104, r.w - 16, 6, 3); ctx.fill();
    ctx.fillStyle = '#f2a54a'; roundRectPath(ctx, r.x + 8, r.y + 104, (r.w - 16) * frac, 6, 3); ctx.fill();
    if (p.item) drawIngredientIcon(ctx, p.item, cx, r.y + 58, 20);
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.ellipse(cx, r.y + 58, 16, 5, 0, 0, Math.PI * 2); ctx.fill();
  }
}

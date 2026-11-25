// Ember & Tide — render/stations.js
// The two sizzle woks along the bottom wall: cast-iron bowls on gas
// burner rings, with the PERFECT timing bar, flame bursts and the
// BURNING alarm. Both woks share one logical wok (g.wok); the item is
// drawn on the wok the chef last used (g.wok.slot).

import { drawIngredientIcon } from './foodArt.js';
import { roundRectPath, clamp } from '../core/util.js';
import { stationTag } from './palette.js';
import { drawFlameBurst, drawBurnerFlame, contactShadow, radialGlow, drawBurnFlames, drawSizzleSparks } from './feel.js';
import { WOK_RECTS } from './layout.js';

// Blue-orange gas burner ring under a wok or pot, with a warm glow
// pooling onto the floor when it is lit.
function drawBurner(ctx, cx, y, now, on) {
  if (on) {
    radialGlow(ctx, cx, y, 66, 'rgba(255,122,40,0.30)');
    radialGlow(ctx, cx, y, 40, 'rgba(80,120,255,0.22)');
  }
  ctx.strokeStyle = '#3a6fd8'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(cx, y, 42, 7, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#ff8a3c'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(cx, y, 27, 4.5, 0, 0, Math.PI * 2); ctx.stroke();
  if (on) drawBurnerFlame(ctx, cx, y, now, true);
}

export function drawWokStation(ctx, g, now, slot) {
  const r = WOK_RECTS[slot];
  const cx = r.x + r.w / 2;
  const w = g.wok;
  stationTag(ctx, cx, r.y, slot === 0 ? 'SIZZLE WOK' : 'SIZZLE WOK 2', 'W · Space to pull');
  contactShadow(ctx, cx, r.y + 100, 66, 8);
  drawBurner(ctx, cx, r.y + 94, now, w.state === 'cooking' && w.slot === slot);
  // Round cast-iron wok with a long riveted handle.
  const grad = ctx.createRadialGradient(cx, r.y + 50, 6, cx, r.y + 50, 58);
  grad.addColorStop(0, w.state === 'burning' ? '#3a2a24' : '#4a4a55');
  grad.addColorStop(1, '#23232c');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.ellipse(cx, r.y + 50, 58, 30, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.ellipse(cx, r.y + 50, 58, 30, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#9aa2ad'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(cx, r.y + 50, 58, 30, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  ctx.save();
  ctx.translate(cx + 54, r.y + 46); ctx.rotate(-0.35);
  ctx.fillStyle = '#3c3e48'; ctx.fillRect(0, -5, 38, 10);
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2; ctx.strokeRect(0, -5, 38, 10);
  ctx.fillStyle = '#c9a24a';
  ctx.beginPath(); ctx.arc(8, 0, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(18, 0, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  if (w.item && w.slot === slot) {
    drawIngredientIcon(ctx, w.item, cx, r.y + 44, 26);
    if (w.state === 'cooking') {
      drawSizzleSparks(ctx, cx, r.y + 40, now);
      const bx = r.x + 8, by = r.y + 102, bw = r.w - 16, bh = 8;
      ctx.fillStyle = '#2a1a12'; roundRectPath(ctx, bx, by, bw, bh, 4); ctx.fill();
      ctx.fillStyle = '#e8442e'; roundRectPath(ctx, bx + bw * 0.85, by, bw * 0.15, bh, 4); ctx.fill();
      ctx.fillStyle = '#4caf6d'; ctx.fillRect(bx + bw * w.perfect[0], by, bw * (w.perfect[1] - w.perfect[0]), bh);
      const frac = clamp(w.t / w.dur, 0, 1);
      ctx.fillStyle = '#ffd94d';
      ctx.fillRect(bx + bw * frac - 1.5, by - 2, 3, bh + 4);
      if (w.anim > 0.6) drawFlameBurst(ctx, cx, r.y + 44, now);
    } else if (w.state === 'burning') {
      drawBurnFlames(ctx, cx, r.y + 44, now);
      // Solid bright-red pill so the alarm pops on the dark teal
      // floor, with crisp white bold text.
      const pulse = 0.8 + 0.2 * Math.sin(now * 8);
      ctx.save(); ctx.globalAlpha = pulse;
      ctx.fillStyle = '#d92d20';
      roundRectPath(ctx, cx - 96, r.y + 12, 192, 20, 10); ctx.fill();
      ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
      roundRectPath(ctx, cx - 96, r.y + 12, 192, 20, 10); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BURNING! CLICK TO TOSS', cx, r.y + 26);
      ctx.restore();
    }
  }
}

export { drawBurner };

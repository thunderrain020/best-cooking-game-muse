// Ember & Tide — render/stations.js
// The sizzle wok and the charcoal grill along the bottom wall: a
// cast-iron bowl on a gas burner ring, and a low stone trough with a
// glowing charcoal bed and iron grates. Both share one logical wok
// (g.wok); the item is drawn on the station the chef last used
// (g.wok.slot). Same PERFECT timing bar, flame bursts and BURNING
// alarm on both — only the silhouette differs.

import { drawIngredientIcon } from './foodArt.js';
import { stationTag } from './palette.js';
import { drawFlameBurst, drawBurnerFlame, contactShadow, radialGlow, drawBurnFlames, drawSizzleSparks } from './feel.js';
import { drawGrillStation, drawWokTiming, drawBurnAlarm } from './stationsGrill.js';
import { WOK_RECTS } from './layout.js';

// Blue-orange gas burner ring under a wok or pot, with a warm glow
// pooling onto the floor when it is lit.
function drawBurner(ctx, cx, y, now, on) {
  if (on) {
    radialGlow(ctx, cx, y, 78, 'rgba(255,122,40,0.38)');
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
  if (slot === 1) {
    drawGrillStation(ctx, g, now);
    return;
  }
  stationTag(ctx, cx, r.y, 'WOK', 'F');
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
      drawWokTiming(ctx, w, r);
      if (w.anim > 0.6) drawFlameBurst(ctx, cx, r.y + 44, now);
    } else if (w.state === 'burning') {
      drawBurnFlames(ctx, cx, r.y + 44, now);
      drawBurnAlarm(ctx, cx, r.y, now);
    }
  }
}

export { drawBurner };

// Ember & Tide — render/stationsGrill.js
// The charcoal grill (the second cook slot) and the timing / alarm
// helpers it shares with the sizzle wok. Split out of
// render/stations.js so both files stay under the 6 KB module cap.

import { drawIngredientIcon } from './foodArt.js';
import { roundRectPath, clamp } from '../core/util.js';
import { stationTag } from './palette.js';
import { drawFlameBurst, drawBurnFlames, contactShadow, radialGlow, drawSizzleSparks } from './feel.js';
import { WOK_RECTS } from './layout.js';

export function drawWokTiming(ctx, w, r) {
  const bx = r.x + 8, by = r.y + 102, bw = r.w - 16, bh = 8;
  ctx.fillStyle = '#2a1a12'; roundRectPath(ctx, bx, by, bw, bh, 4); ctx.fill();
  ctx.fillStyle = '#e8442e'; roundRectPath(ctx, bx + bw * 0.85, by, bw * 0.15, bh, 4); ctx.fill();
  ctx.fillStyle = '#4caf6d'; ctx.fillRect(bx + bw * w.perfect[0], by, bw * (w.perfect[1] - w.perfect[0]), bh);
  const frac = clamp(w.t / w.dur, 0, 1);
  ctx.fillStyle = '#ffd94d';
  ctx.fillRect(bx + bw * frac - 1.5, by - 2, 3, bh + 4);
}

export function drawBurnAlarm(ctx, cx, y, now) {
  // Solid bright-red pill so the alarm pops on the dark teal
  // floor, with crisp white bold text.
  const pulse = 0.8 + 0.2 * Math.sin(now * 8);
  ctx.save(); ctx.globalAlpha = pulse;
  ctx.fillStyle = '#d92d20';
  roundRectPath(ctx, cx - 96, y + 70, 192, 20, 10); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
  roundRectPath(ctx, cx - 96, y + 70, 192, 20, 10); ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BURNING! CLICK TO TOSS', cx, y + 84);
  ctx.restore();
}

// V8: the second cook slot is a CHARCOAL GRILL, not a twin wok —
// a low stone trough, a glowing orange-red charcoal bed, iron grates
// and sear marks. Same wok rules underneath (same keys, same timing,
// same PERFECT window): only the silhouette changes.
export function drawGrillStation(ctx, g, now) {
  const r = WOK_RECTS[1];
  const cx = r.x + r.w / 2;
  const w = g.wok;
  stationTag(ctx, cx, r.y, 'GRILL', 'G');
  contactShadow(ctx, cx, r.y + 100, 66, 8);
  // Warm ember glow pooling under the trough.
  radialGlow(ctx, cx, r.y + 78, 70, 'rgba(255,90,46,0.30)');
  // Stone trough.
  ctx.fillStyle = '#3c3e48';
  roundRectPath(ctx, r.x + 6, r.y + 30, r.w - 12, 56, 10); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2.5;
  roundRectPath(ctx, r.x + 6, r.y + 30, r.w - 12, 56, 10); ctx.stroke();
  // Glowing charcoal bed: hot coals in two rows.
  ctx.fillStyle = '#7a2a12';
  roundRectPath(ctx, r.x + 14, r.y + 38, r.w - 28, 30, 8); ctx.fill();
  const coals = ['#ff5a2e', '#ff8a3c', '#e8442e', '#ffb347'];
  for (let i = 0; i < 8; i++) {
    const cox = r.x + 28 + (i % 4) * 38 + (Math.floor(i / 4) % 2) * 12;
    const coy = r.y + 47 + Math.floor(i / 4) * 14;
    ctx.fillStyle = coals[i % coals.length];
    ctx.beginPath(); ctx.ellipse(cox, coy, 13, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,240,200,0.85)';
    ctx.beginPath(); ctx.ellipse(cox - 3, coy - 2, 4, 2.5, 0, 0, Math.PI * 2); ctx.fill();
  }
  // Iron grates across the bed.
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    const gy = r.y + 40 + i * 8;
    ctx.beginPath(); ctx.moveTo(r.x + 12, gy); ctx.lineTo(r.x + r.w - 12, gy); ctx.stroke();
  }
  if (w.item && w.slot === 1) {
    drawIngredientIcon(ctx, w.item, cx, r.y + 44, 26);
    // Sear marks across the item on the grill.
    ctx.strokeStyle = 'rgba(26,18,11,0.8)'; ctx.lineWidth = 3;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * 14 - 6, r.y + 30);
      ctx.lineTo(cx + i * 14 + 6, r.y + 58);
      ctx.stroke();
    }
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

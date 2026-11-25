// Ember & Tide — render/bell.js
// The brass pass bell under its heat lamp, opening onto the terrace.
// Split out of render/serve.js so both files stay under the 6 KB
// module cap.

import { roundRectPath } from '../core/util.js';
import { pillText, stationTag } from './palette.js';
import { drawShimmer, contactShadow, radialGlow } from './feel.js';
import { BELL_RECT } from './layout.js';

export function drawBellStation(ctx, g, now) {
  const r = BELL_RECT;
  stationTag(ctx, r.x + r.w / 2, r.y, 'SERVE', 'SPC');
  const ready = !!g.plate.dishId;
  const cx = r.x + r.w / 2;
  // Overhead brass heat lamp: shade at the top, a warm cone of light.
  ctx.fillStyle = '#8a6410';
  ctx.beginPath(); ctx.moveTo(cx - 22, r.y + 46); ctx.quadraticCurveTo(cx, r.y + 26, cx + 22, r.y + 46); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx - 22, r.y + 46); ctx.quadraticCurveTo(cx, r.y + 26, cx + 22, r.y + 46); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,205,110,0.28)';
  ctx.beginPath();
  ctx.moveTo(cx - 18, r.y + 46); ctx.lineTo(cx + 18, r.y + 46);
  ctx.lineTo(cx + 44, r.y + 128); ctx.lineTo(cx - 44, r.y + 128);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath(); ctx.arc(cx, r.y + 46, 6, 0, Math.PI * 2); ctx.fill();
  // Amber heat-lamp glow pooling onto the bell and the counter.
  radialGlow(ctx, cx, r.y + 104, 60, 'rgba(255,190,90,0.32)');
  // Polished brass bell on a small round walnut mat.
  contactShadow(ctx, cx, r.y + 132, 46, 7);
  ctx.fillStyle = '#2b221e';
  ctx.beginPath(); ctx.ellipse(cx, r.y + 128, 44, 12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(cx, r.y + 128, 44, 12, 0, 0, Math.PI * 2); ctx.stroke();
  if (ready) drawShimmer(ctx, r.x + 6, r.y + 50, r.w - 12, 88, now);
  const pulse = ready ? 1 + 0.06 * Math.sin(now * 6) : 1;
  ctx.save();
  ctx.translate(cx, r.y + 92); ctx.scale(pulse, pulse);
  const grad = ctx.createRadialGradient(-7, -12, 3, 0, 0, 38);
  grad.addColorStop(0, '#ffe9a8'); grad.addColorStop(0.6, '#d4a017'); grad.addColorStop(1, '#8a6410');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.moveTo(-28, 22); ctx.quadraticCurveTo(-28, -22, 0, -25); ctx.quadraticCurveTo(28, -22, 28, 22); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-28, 22); ctx.quadraticCurveTo(-28, -22, 0, -25); ctx.quadraticCurveTo(28, -22, 28, 22); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath(); ctx.ellipse(-10, -12, 8, 5, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#8a6410'; ctx.fillRect(-33, 20, 66, 6);
  ctx.fillStyle = '#5d3a1e';
  ctx.beginPath(); ctx.arc(0, 30, 5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  // RING IT pill: sits above the bell mat, clear of the route corridor
  // (y 492-510) so the numbered bell stop is never clipped.
  pillText(ctx, ready ? 'RING IT!' : 'Serve a full dish', cx, r.y + r.h - 42, 'bold 12px system-ui, sans-serif', ready ? '#ffd94d' : '#c9b48a');
}

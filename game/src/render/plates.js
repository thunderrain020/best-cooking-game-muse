// Ember & Tide — render/plates.js
// Finished plates and plates mid-assembly. Empty states are illustrated,
// never text: a clean ceramic plate with a rim highlight, and empty slots
// shown as soft pale wells — no dashed guides, no "empty" labels.

import { drawIngredientIcon } from './foodArt.js';

function plateBase(ctx, r) {
  ctx.fillStyle = '#f7f2e8';
  ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.72, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(0, -r * 0.06, r * 0.92, r * 0.64, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
  ctx.fillStyle = '#e3d9c2';
  ctx.beginPath(); ctx.ellipse(0, 0, r * 0.78, r * 0.55, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fdfaf2';
  ctx.beginPath(); ctx.ellipse(0, 0, r * 0.62, r * 0.42, 0, 0, Math.PI * 2); ctx.fill();
}

export function drawDishPlate(ctx, dish, cx, cy, r) {
  ctx.save();
  ctx.translate(cx, cy);
  plateBase(ctx, r);
  const n = dish.comps.length;
  dish.comps.forEach((id, i) => {
    const a = -Math.PI / 2 + (i - (n - 1) / 2) * 0.55;
    drawIngredientIcon(ctx, id, Math.cos(a) * r * 0.3, Math.sin(a) * r * 0.2, r * 0.34);
  });
  ctx.restore();
}

export function drawPlateInProgress(ctx, items, total, cx, cy, r) {
  ctx.save();
  ctx.translate(cx, cy);
  plateBase(ctx, r);
  const n = Math.max(total, items.length, 1);
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i - (n - 1) / 2) * 0.6;
    const x = Math.cos(a) * r * 0.3;
    const y = Math.sin(a) * r * 0.2;
    if (i < items.length) {
      drawIngredientIcon(ctx, items[i], x, y, r * 0.32);
    } else {
      // Soft pale well: an unfilled slot reads as "waiting", not a bug.
      ctx.fillStyle = 'rgba(120,90,40,0.10)';
      ctx.beginPath(); ctx.arc(x, y, r * 0.3, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(120,90,40,0.22)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x, y, r * 0.3, 0, Math.PI * 2); ctx.stroke();
    }
  }
  ctx.restore();
}

// Shimmering broth for an idle simmer pot: illustrated, never a label.
export function drawBroth(ctx, cx, cy, rx, now) {
  const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, rx);
  grad.addColorStop(0, '#e8b64c');
  grad.addColorStop(0.7, '#c98f2e');
  grad.addColorStop(1, '#8a5f1a');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.ellipse(cx, cy, rx, rx * 0.28, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,240,200,0.75)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    const a = now * 0.8 + i * 2.1;
    ctx.beginPath();
    ctx.ellipse(cx + Math.cos(a) * rx * 0.3, cy + Math.sin(a) * rx * 0.08, rx * 0.28, rx * 0.07, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}

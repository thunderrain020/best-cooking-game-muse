// Ember & Tide — render/plates.js
// The ceramic plate base (exported for foodDishes.js) and the shimmering
// broth for an idle simmer pot. Empty states are illustrated, never text:
// a clean ceramic plate with a rim highlight — no dashed guides.

export function plateBase(ctx, r) {
  ctx.fillStyle = '#f7f2e8';
  ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.72, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.72, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(0, -r * 0.06, r * 0.92, r * 0.64, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
  ctx.fillStyle = '#e3d9c2';
  ctx.beginPath(); ctx.ellipse(0, 0, r * 0.78, r * 0.55, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fdfaf2';
  ctx.beginPath(); ctx.ellipse(0, 0, r * 0.62, r * 0.42, 0, 0, Math.PI * 2); ctx.fill();
  // Rim shadow: a soft dark crescent along the plate's lower inner edge
  // so the food sits in the plate instead of floating on it.
  ctx.fillStyle = 'rgba(60,30,10,0.16)';
  ctx.beginPath(); ctx.ellipse(0, r * 0.16, r * 0.58, r * 0.3, 0, 0, Math.PI); ctx.fill();
  // Thin gold rim ring: the plate edge reads at thumbnail size.
  ctx.strokeStyle = 'rgba(212,160,23,0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(0, 0, r * 0.88, r * 0.63, 0, 0, Math.PI * 2); ctx.stroke();
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

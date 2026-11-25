// Ember & Tide — render/archway.js
// The warm timber pass archway where the kitchen meets the Harbour
// Terrace (x 1040): no more harsh vertical wall split. Two timber
// posts frame the pass opening (y 332–490), an arched timber header
// crowns it, a low sill closes its foot, and a slim serving shelf
// juts from the sill into the kitchen beside the pass bell — so
// Critic Lin, Capt. Budi and Chef Mei read as seated in the same
// rooftop restaurant as the chef.

import { TERRACE } from './layout.js';

function timberPost(ctx, x, y, w, h) {
  ctx.fillStyle = '#6b4526';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(x + 3, y, 2, h);
  ctx.fillRect(x + w - 5, y, 2, h);
  ctx.fillStyle = 'rgba(255,220,160,0.12)';
  ctx.fillRect(x + w / 2 - 1, y, 2, h);
  ctx.fillStyle = '#c9a24a';
  ctx.fillRect(x - 1, y, w + 2, 3);
  ctx.fillRect(x - 1, y + h - 3, w + 2, 3);
}

export function drawPassArch(ctx, g, now) {
  const T = TERRACE;
  // Timber posts up the terrace edge, above and below the opening.
  timberPost(ctx, T.x - 4, T.y, 18, 254);
  timberPost(ctx, T.x - 4, 490, 18, T.h - 402);
  // Timber lintel crowning the pass opening: a short beam over the
  // gap with a shallow arched underside and brass pins — the header
  // of the archway, clear of the water and the PASS · SERVE tag.
  ctx.fillStyle = '#7a5230';
  ctx.beginPath();
  ctx.moveTo(T.x - 8, 318);
  ctx.lineTo(T.x + 22, 318);
  ctx.lineTo(T.x + 22, 332);
  ctx.quadraticCurveTo(T.x + 7, 342, T.x - 8, 332);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#1a120b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(T.x - 8, 318);
  ctx.lineTo(T.x + 22, 318);
  ctx.lineTo(T.x + 22, 332);
  ctx.quadraticCurveTo(T.x + 7, 342, T.x - 8, 332);
  ctx.closePath(); ctx.stroke();
  ctx.fillStyle = '#c9a24a';
  for (const [px, py] of [[T.x + 1, 326], [T.x + 13, 326]]) {
    ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fill();
  }
  // Warm light spilling through the pass, between header and sill.
  ctx.fillStyle = 'rgba(255,190,90,0.25)';
  ctx.fillRect(T.x, 360, 14, 126);
  // Low timber sill at the foot of the opening, brass-capped.
  ctx.fillStyle = '#6b4526';
  ctx.fillRect(T.x - 4, 486, 18, 14);
  ctx.fillStyle = '#c9a24a';
  ctx.fillRect(T.x - 4, 486, 18, 3);
  // Slim serving shelf jutting into the kitchen beside the bell,
  // brass-railed, with a small plate waiting on it.
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(1004, 486, 36, 12);
  ctx.fillStyle = '#c9a24a';
  ctx.fillRect(1004, 486, 36, 3);
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath(); ctx.ellipse(1022, 493, 9, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e8442e';
  ctx.beginPath(); ctx.arc(1022, 491, 3, 0, Math.PI * 2); ctx.fill();
}

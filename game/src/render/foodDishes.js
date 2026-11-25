// Ember & Tide — render/foodDishes.js
// Composed, layered meals: a noodle nest or rice mound as the base, with
// the dish's components arranged on top as garnish — never raw icons
// pasted side by side. Steam wisps finish the plate.

import { drawIngredientIcon } from './foodArt.js';
import { plateBase } from './plates.js';

// Arrange n toppings on a fan above the base, overlapping naturally.
function toppingSpots(n) {
  const spots = [];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i - (n - 1) / 2) * 0.62;
    spots.push([Math.cos(a) * 0.3, Math.sin(a) * 0.22]);
  }
  return spots;
}

function steamWisps(ctx, r, now) {
  ctx.strokeStyle = 'rgba(255,244,220,0.7)';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const x = (i - 1) * r * 0.45;
    const sway = Math.sin((now || 0) * 1.4 + i * 2.2) * r * 0.06;
    ctx.beginPath();
    ctx.moveTo(x, -r * 0.42);
    ctx.bezierCurveTo(x + sway - r * 0.12, -r * 0.68, x + sway + r * 0.12, -r * 0.85, x + sway, -r * 1.05);
    ctx.stroke();
  }
}

// Sauce drizzle over the base: glossy amber arcs, always on top.
function drizzle(ctx, r) {
  ctx.strokeStyle = 'rgba(201,106,46,0.85)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-r * 0.42, -r * 0.05);
  ctx.quadraticCurveTo(0, r * 0.18, r * 0.42, -r * 0.02);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-r * 0.3, r * 0.22);
  ctx.quadraticCurveTo(r * 0.1, r * 0.02, r * 0.34, r * 0.2);
  ctx.stroke();
}

function drawBase(ctx, comps, r) {
  if (comps.includes('noodle') || comps.includes('rice')) {
    // Rich amber broth pool under the starch: contrast against the pale
    // plate so the mound reads as food, not a white blob, at thumbnail size.
    ctx.fillStyle = '#b4712e';
    ctx.beginPath(); ctx.ellipse(0, r * 0.1, r * 0.62, r * 0.34, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#7a4a16'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(0, r * 0.1, r * 0.62, r * 0.34, 0, 0, Math.PI * 2); ctx.stroke();
  }
  if (comps.includes('noodle')) {
    drawIngredientIcon(ctx, 'noodle', 0, r * 0.08, r * 0.62);
  } else if (comps.includes('rice')) {
    drawIngredientIcon(ctx, 'rice', 0, r * 0.1, r * 0.6);
  } else {
    // Green bed for dishes with no starch base.
    ctx.fillStyle = '#7cb342';
    ctx.beginPath(); ctx.ellipse(0, r * 0.1, r * 0.55, r * 0.3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(0, r * 0.1, r * 0.55, r * 0.3, 0, 0, Math.PI * 2); ctx.stroke();
  }
}

export function drawDishPlate(ctx, dish, cx, cy, r, now) {
  ctx.save();
  ctx.translate(cx, cy);
  plateBase(ctx, r);
  const base = dish.comps.includes('noodle') ? 'noodle' : dish.comps.includes('rice') ? 'rice' : null;
  drawBase(ctx, dish.comps, r);
  drizzle(ctx, r);
  const tops = dish.comps.filter((c) => c !== base);
  const spots = toppingSpots(tops.length);
  tops.forEach((id, i) => {
    const big = id === 'prawn' || id === 'fish' ? r * 0.4 : r * 0.32;
    drawIngredientIcon(ctx, id, spots[i][0] * r, spots[i][1] * r - r * 0.08, big);
  });
  // A herb garnish and a crisp lime wedge on top, and heat rising off it.
  drawIngredientIcon(ctx, 'herbs', r * 0.28, -r * 0.28, r * 0.22);
  drawIngredientIcon(ctx, 'lime', -r * 0.3, -r * 0.26, r * 0.2);
  steamWisps(ctx, r, now);
  ctx.restore();
}

export function drawPlateInProgress(ctx, items, total, cx, cy, r, now) {
  ctx.save();
  ctx.translate(cx, cy);
  plateBase(ctx, r);
  const n = Math.max(total, items.length, 1);
  const base = items.includes('noodle') ? 'noodle' : items.includes('rice') ? 'rice' : null;
  if (base) { drawBase(ctx, items, r); drizzle(ctx, r); }
  const tops = items.filter((c) => c !== base);
  const spots = toppingSpots(n);
  for (let i = 0; i < n; i++) {
    const x = spots[i][0] * r;
    const y = spots[i][1] * r - r * 0.08;
    if (i < tops.length) {
      const id = tops[i];
      const big = id === 'prawn' || id === 'fish' ? r * 0.4 : r * 0.32;
      drawIngredientIcon(ctx, id, x, y, big);
    } else if (!(base && i === 0)) {
      // Soft pale well: an unfilled slot reads as "waiting", not a bug.
      ctx.fillStyle = 'rgba(120,90,40,0.10)';
      ctx.beginPath(); ctx.arc(x, y, r * 0.3, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(120,90,40,0.22)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x, y, r * 0.3, 0, Math.PI * 2); ctx.stroke();
    }
  }
  if (items.length) {
    // Garnish + steam on a mid-assembly plate too, so the island reads
    // as food in progress rather than loose icons.
    drawIngredientIcon(ctx, 'herbs', r * 0.28, -r * 0.28, r * 0.22);
    drawIngredientIcon(ctx, 'lime', -r * 0.3, -r * 0.26, r * 0.2);
    steamWisps(ctx, r, now);
  }
  ctx.restore();
}

// Ember & Tide — render/foodIngredientsC.js
// Chilli, lime and herbs: glossy pepper, juicy wedges, veined leaves.
// Each draw fn assumes ctx is translated to the ingredient centre.

const INK = '#1a120b';

function ink(ctx, w) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = w || 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
}

export function drawChilli(ctx, r) {
  // Glossy curved pepper: ink under-stroke, red body, green calyx.
  ctx.strokeStyle = INK; ctx.lineWidth = r * 0.48; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-r * 0.7, -r * 0.4); ctx.quadraticCurveTo(r * 0.1, r * 0.78, r * 0.78, -r * 0.12); ctx.stroke();
  ctx.strokeStyle = '#e8442e'; ctx.lineWidth = r * 0.38;
  ctx.beginPath(); ctx.moveTo(-r * 0.7, -r * 0.4); ctx.quadraticCurveTo(r * 0.1, r * 0.78, r * 0.78, -r * 0.12); ctx.stroke();
  ctx.strokeStyle = '#ff7a5c'; ctx.lineWidth = r * 0.12;
  ctx.beginPath(); ctx.moveTo(-r * 0.5, -r * 0.28); ctx.quadraticCurveTo(r * 0.05, r * 0.5, r * 0.55, -r * 0.08); ctx.stroke();
  ctx.fillStyle = '#4caf6d';
  ctx.beginPath(); ctx.moveTo(-r * 0.7, -r * 0.4); ctx.lineTo(-r * 0.92, -r * 0.62); ctx.lineTo(-r * 0.78, -r * 0.3); ctx.lineTo(-r * 0.58, -r * 0.52); ctx.closePath(); ctx.fill();
  ink(ctx, 1.5); ctx.beginPath(); ctx.moveTo(-r * 0.7, -r * 0.4); ctx.lineTo(-r * 0.92, -r * 0.62); ctx.lineTo(-r * 0.78, -r * 0.3); ctx.lineTo(-r * 0.58, -r * 0.52); ctx.closePath(); ctx.stroke();
  ctx.strokeStyle = '#2e7d32'; ctx.lineWidth = r * 0.1;
  ctx.beginPath(); ctx.moveTo(-r * 0.78, -r * 0.5); ctx.lineTo(-r * 1.0, -r * 0.78); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath(); ctx.ellipse(-r * 0.1, r * 0.28, r * 0.26, r * 0.08, 0.6, 0, Math.PI * 2); ctx.fill();
}

export function drawLime(ctx, r) {
  // Textured rind, juicy translucent wedges, pith spokes.
  ctx.fillStyle = '#5d8a1e';
  ctx.beginPath(); ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2); ctx.fill();
  ink(ctx); ctx.beginPath(); ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#a8d94a';
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    ctx.beginPath(); ctx.arc(Math.cos(a) * r * 0.78, Math.sin(a) * r * 0.78, r * 0.05, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#c4ec7a';
  ctx.beginPath(); ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#eaf7c0'; ctx.lineWidth = r * 0.07;
  ctx.beginPath(); ctx.arc(0, 0, r * 0.62, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#7cb832'; ctx.lineWidth = r * 0.06;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * r * 0.62, Math.sin(a) * r * 0.62); ctx.stroke();
  }
  ctx.fillStyle = '#d8f79a';
  ctx.beginPath(); ctx.arc(0, 0, r * 0.12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath(); ctx.ellipse(-r * 0.3, -r * 0.35, r * 0.2, r * 0.1, -0.6, 0, Math.PI * 2); ctx.fill();
}

export function drawHerbs(ctx, r) {
  // Layered veined basil / cilantro leaves on stems.
  ctx.strokeStyle = '#2e7d32'; ctx.lineWidth = r * 0.1; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, r * 0.65); ctx.quadraticCurveTo(r * 0.08, 0, 0, -r * 0.65); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, r * 0.4); ctx.quadraticCurveTo(-r * 0.35, r * 0.1, -r * 0.55, -r * 0.3); ctx.stroke();
  const leaf = (x, y, rot, s, col) => {
    ctx.save(); ctx.translate(x * r, y * r); ctx.rotate(rot);
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(0, 0, r * 0.36 * s, r * 0.17 * s, 0, 0, Math.PI * 2); ctx.fill();
    ink(ctx, 1.5); ctx.beginPath(); ctx.ellipse(0, 0, r * 0.36 * s, r * 0.17 * s, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#22663a'; ctx.lineWidth = r * 0.05;
    ctx.beginPath(); ctx.moveTo(-r * 0.3 * s, 0); ctx.lineTo(r * 0.3 * s, 0); ctx.stroke();
    ctx.restore();
  };
  leaf(-0.38, 0.12, -0.7, 1, '#4caf6d');
  leaf(0.38, -0.08, 0.7, 1, '#66bb6a');
  leaf(-0.3, -0.38, -0.9, 0.9, '#43a047');
  leaf(0.32, -0.48, 0.9, 0.9, '#4caf6d');
  leaf(0, -0.68, 0, 0.85, '#66bb6a');
}

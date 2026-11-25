// Ember & Tide — render/foodIngredients.js
// Prawn and fish fillet: shading, highlights, 2px ink outlines.
// Each draw fn assumes ctx is translated to the ingredient centre.

const INK = '#1a120b';

function ink(ctx, w) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = w || 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
}

export function drawPrawn(ctx, r) {
  // Curved segmented tail: ink under-arc, coral body, glaze highlight.
  ctx.strokeStyle = INK; ctx.lineWidth = r * 0.52; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, r * 0.12, r * 0.6, Math.PI * 0.12, Math.PI * 1.32); ctx.stroke();
  ctx.strokeStyle = '#ff8a5c'; ctx.lineWidth = r * 0.42;
  ctx.beginPath(); ctx.arc(0, r * 0.12, r * 0.6, Math.PI * 0.12, Math.PI * 1.32); ctx.stroke();
  ctx.strokeStyle = '#ffb08a'; ctx.lineWidth = r * 0.12;
  ctx.beginPath(); ctx.arc(0, r * 0.12, r * 0.6, Math.PI * 0.25, Math.PI * 0.9); ctx.stroke();
  ctx.strokeStyle = '#c94f2a'; ctx.lineWidth = r * 0.09;
  for (const a of [0.35, 0.7, 1.05]) {
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * r * 0.36, r * 0.12 + Math.sin(a) * r * 0.36);
    ctx.lineTo(Math.cos(a) * r * 0.84, r * 0.12 + Math.sin(a) * r * 0.84); ctx.stroke();
  }
  // Tail fan at the top end, head + eye + legs at the bottom end.
  ctx.fillStyle = '#ff6a3c';
  ctx.beginPath(); ctx.moveTo(r * 0.52, -r * 0.5); ctx.lineTo(r * 0.98, -r * 0.22); ctx.lineTo(r * 0.62, -r * 0.02); ctx.closePath(); ctx.fill();
  ink(ctx); ctx.beginPath(); ctx.moveTo(r * 0.52, -r * 0.5); ctx.lineTo(r * 0.98, -r * 0.22); ctx.lineTo(r * 0.62, -r * 0.02); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = '#e85d3a';
  ctx.beginPath(); ctx.arc(-r * 0.5, r * 0.62, r * 0.22, 0, Math.PI * 2); ctx.fill();
  ink(ctx); ctx.beginPath(); ctx.arc(-r * 0.5, r * 0.62, r * 0.22, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = INK;
  ctx.beginPath(); ctx.arc(-r * 0.44, r * 0.56, r * 0.06, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = r * 0.06;
  ctx.beginPath(); ctx.moveTo(-r * 0.55, r * 0.8); ctx.lineTo(-r * 0.75, r * 0.95); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-r * 0.4, r * 0.82); ctx.lineTo(-r * 0.5, r * 1.0); ctx.stroke();
}

export function drawFish(ctx, r) {
  // Angled skin-on fillet: silver-blue sheen, flesh marbling, grill lines.
  ctx.save(); ctx.rotate(-0.35);
  const sheen = ctx.createLinearGradient(-r * 0.8, -r * 0.4, r * 0.8, r * 0.4);
  sheen.addColorStop(0, '#cfeef8'); sheen.addColorStop(0.5, '#9fd8e8'); sheen.addColorStop(1, '#5d9db2');
  ctx.fillStyle = sheen;
  ctx.beginPath();
  ctx.moveTo(-r * 0.9, 0); ctx.quadraticCurveTo(-r * 0.3, -r * 0.55, r * 0.75, -r * 0.28);
  ctx.quadraticCurveTo(r * 0.95, 0, r * 0.75, r * 0.28); ctx.quadraticCurveTo(-r * 0.3, r * 0.55, -r * 0.9, 0);
  ctx.closePath(); ctx.fill(); ink(ctx); ctx.stroke();
  ctx.fillStyle = '#fdf3dd';
  ctx.beginPath(); ctx.ellipse(0, 0, r * 0.58, r * 0.3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#f2a0a0'; ctx.lineWidth = r * 0.06;
  for (const [y, p] of [[-0.12, 0.4], [0.02, -0.3], [0.14, 0.5]]) {
    ctx.beginPath(); ctx.moveTo(-r * 0.45, y * r);
    ctx.bezierCurveTo(-r * 0.15, (y + p * 0.3) * r, r * 0.15, (y - p * 0.3) * r, r * 0.45, y * r); ctx.stroke();
  }
  ctx.strokeStyle = '#8a5a2a'; ctx.lineWidth = r * 0.07;
  for (const x of [-0.3, 0, 0.3]) {
    ctx.beginPath(); ctx.moveTo(x * r, -r * 0.28); ctx.lineTo((x + 0.18) * r, r * 0.28); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath(); ctx.ellipse(-r * 0.25, -r * 0.28, r * 0.3, r * 0.08, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

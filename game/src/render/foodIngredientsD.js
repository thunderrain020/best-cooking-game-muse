// Ember & Tide — render/foodIngredientsD.js
// Scallop and tofu (V5): a golden-seared scallop in its shell, and a
// silken tofu cube with a crisp seared face. Shading, highlights, 2px
// ink outlines. Each draw fn assumes ctx is translated to the
// ingredient centre.

const INK = '#1a120b';

function ink(ctx, w) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = w || 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
}

export function drawScallop(ctx, r) {
  // Fan shell behind: pale ridged fan, ink outline.
  ctx.fillStyle = '#f2d8b8';
  ctx.beginPath();
  ctx.moveTo(0, r * 0.55);
  ctx.quadraticCurveTo(-r * 0.95, r * 0.1, -r * 0.85, -r * 0.55);
  ctx.quadraticCurveTo(0, -r * 0.95, r * 0.85, -r * 0.55);
  ctx.quadraticCurveTo(r * 0.95, r * 0.1, 0, r * 0.55);
  ctx.closePath(); ctx.fill(); ink(ctx); ctx.stroke();
  ctx.strokeStyle = '#d8b48a'; ctx.lineWidth = r * 0.06;
  for (const a of [-0.6, -0.3, 0, 0.3, 0.6]) {
    ctx.beginPath();
    ctx.moveTo(Math.sin(a) * r * 0.2, r * 0.5);
    ctx.lineTo(Math.sin(a) * r * 0.85, -r * 0.45); ctx.stroke();
  }
  // The scallop meat: a plump ivory-gold disc, seared on top.
  const meat = ctx.createRadialGradient(-r * 0.15, -r * 0.2, r * 0.1, 0, 0, r * 0.55);
  meat.addColorStop(0, '#fff6e0'); meat.addColorStop(0.6, '#ffe9c4'); meat.addColorStop(1, '#e8b878');
  ctx.fillStyle = meat;
  ctx.beginPath(); ctx.arc(0, r * 0.08, r * 0.52, 0, Math.PI * 2); ctx.fill();
  ink(ctx); ctx.beginPath(); ctx.arc(0, r * 0.08, r * 0.52, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#c98f4a';
  ctx.beginPath(); ctx.ellipse(0, -r * 0.22, r * 0.34, r * 0.16, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath(); ctx.ellipse(-r * 0.18, -r * 0.1, r * 0.16, r * 0.08, -0.5, 0, Math.PI * 2); ctx.fill();
  // Coral roe crescent at the base.
  ctx.fillStyle = '#ff8a5c';
  ctx.beginPath(); ctx.arc(r * 0.28, r * 0.38, r * 0.16, 0, Math.PI * 2); ctx.fill();
  ink(ctx, 1.5); ctx.beginPath(); ctx.arc(r * 0.28, r * 0.38, r * 0.16, 0, Math.PI * 2); ctx.stroke();
}

export function drawTofu(ctx, r) {
  // Silken cube: cream faces, a crisp golden seared top, soft shadow.
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.beginPath(); ctx.ellipse(r * 0.08, r * 0.62, r * 0.62, r * 0.18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fbf3e2';
  ctx.beginPath();
  ctx.moveTo(-r * 0.62, -r * 0.2); ctx.lineTo(r * 0.15, -r * 0.55);
  ctx.lineTo(r * 0.72, -r * 0.05); ctx.lineTo(r * 0.72, r * 0.5);
  ctx.lineTo(-r * 0.05, r * 0.62); ctx.lineTo(-r * 0.62, r * 0.28);
  ctx.closePath(); ctx.fill(); ink(ctx); ctx.stroke();
  // Golden seared top face.
  ctx.fillStyle = '#e8b878';
  ctx.beginPath();
  ctx.moveTo(-r * 0.62, -r * 0.2); ctx.lineTo(r * 0.15, -r * 0.55);
  ctx.lineTo(r * 0.72, -r * 0.05); ctx.lineTo(-r * 0.05, r * 0.28);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#a97c3a'; ctx.lineWidth = r * 0.05;
  for (const x of [-0.3, 0.05, 0.4]) {
    ctx.beginPath(); ctx.moveTo(x * r, -r * 0.32 + Math.abs(x) * r * 0.2);
    ctx.lineTo((x + 0.12) * r, -r * 0.05 + Math.abs(x) * r * 0.2); ctx.stroke();
  }
  // Front face shading + a sesame sprinkle.
  ctx.fillStyle = '#efe3c8';
  ctx.beginPath();
  ctx.moveTo(-r * 0.05, r * 0.28); ctx.lineTo(r * 0.72, -r * 0.05);
  ctx.lineTo(r * 0.72, r * 0.5); ctx.lineTo(-r * 0.05, r * 0.62);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#8a6a3a';
  for (const [x, y] of [[0.25, 0.25], [0.45, 0.4], [0.2, 0.45]]) {
    ctx.beginPath(); ctx.ellipse(x * r, y * r, r * 0.05, r * 0.03, 0.4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath(); ctx.ellipse(-r * 0.3, -r * 0.05, r * 0.14, r * 0.06, -0.4, 0, Math.PI * 2); ctx.fill();
}

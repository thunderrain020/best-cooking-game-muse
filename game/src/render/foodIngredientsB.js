// Ember & Tide — render/foodIngredientsB.js
// Rice, noodles and egg: glossy grains, a tangled nest, a fried egg.
// Each draw fn assumes ctx is translated to the ingredient centre.

const INK = '#1a120b';

function ink(ctx, w) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = w || 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
}

export function drawRice(ctx, r) {
  // Mounded scoop of glossy grains on a shadow base.
  ctx.fillStyle = 'rgba(90,60,20,0.3)';
  ctx.beginPath(); ctx.ellipse(0, r * 0.55, r * 0.8, r * 0.22, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f5ecd7';
  ctx.beginPath(); ctx.ellipse(0, r * 0.28, r * 0.85, r * 0.5, 0, Math.PI, 0); ctx.closePath(); ctx.fill();
  ink(ctx); ctx.beginPath(); ctx.ellipse(0, r * 0.28, r * 0.85, r * 0.5, 0, Math.PI, 0); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = '#fff8e6';
  ctx.beginPath(); ctx.ellipse(-r * 0.2, -r * 0.12, r * 0.42, r * 0.28, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d8c49a';
  for (const [x, y, a] of [[-0.45, 0.15, 0.4], [0.05, 0.3, -0.2], [0.48, 0.1, 0.7], [-0.08, -0.02, 0.2], [0.28, -0.18, -0.5]]) {
    ctx.beginPath(); ctx.ellipse(x * r, y * r, r * 0.13, r * 0.07, a, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#fffdf4';
  for (const [x, y] of [[-0.3, 0.32], [0.2, 0.38], [0.55, 0.3]]) {
    ctx.beginPath(); ctx.ellipse(x * r, y * r, r * 0.09, r * 0.05, 0.3, 0, Math.PI * 2); ctx.fill();
  }
}

export function drawNoodle(ctx, r) {
  // Wavy tangled golden nest with shadow strands underneath.
  ctx.strokeStyle = '#a97c1e'; ctx.lineWidth = r * 0.2; ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const y = (i - 1) * r * 0.34 + r * 0.06;
    ctx.beginPath(); ctx.moveTo(-r * 0.8, y);
    ctx.bezierCurveTo(-r * 0.3, y - r * 0.3, r * 0.3, y + r * 0.3, r * 0.8, y); ctx.stroke();
  }
  ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = r * 0.17;
  for (let i = 0; i < 3; i++) {
    const y = (i - 1) * r * 0.34;
    ctx.beginPath(); ctx.moveTo(-r * 0.8, y);
    ctx.bezierCurveTo(-r * 0.3, y - r * 0.3, r * 0.3, y + r * 0.3, r * 0.8, y); ctx.stroke();
  }
  ctx.strokeStyle = '#ffe08a'; ctx.lineWidth = r * 0.06;
  ctx.beginPath(); ctx.moveTo(-r * 0.7, -r * 0.4);
  ctx.bezierCurveTo(-r * 0.3, -r * 0.62, r * 0.2, -r * 0.18, r * 0.6, -r * 0.4); ctx.stroke();
  ctx.strokeStyle = INK; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.ellipse(0, 0, r * 0.86, r * 0.52, 0, 0, Math.PI * 2); ctx.stroke();
}

export function drawEgg(ctx, r) {
  // Ruffled crispy-edged white, glossy golden yolk, specular dot.
  ctx.fillStyle = '#fff6e0';
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const rr = r * (0.62 + 0.14 * ((i * 7) % 3) / 2);
    ctx.arc(Math.cos(a) * rr * 0.85, Math.sin(a) * rr * 0.7, r * 0.3, 0, Math.PI * 2);
  }
  ctx.fill();
  ink(ctx);
  ctx.beginPath(); ctx.ellipse(0, 0, r * 0.78, r * 0.6, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#c98f1b';
  ctx.beginPath(); ctx.arc(r * 0.12, r * 0.1, r * 0.34, 0, Math.PI * 2); ctx.fill();
  const grad = ctx.createRadialGradient(r * 0.02, -r * 0.08, r * 0.04, r * 0.1, -r * 0.02, r * 0.4);
  grad.addColorStop(0, '#ffe066'); grad.addColorStop(1, '#f5a623');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(r * 0.1, -r * 0.02, r * 0.38, 0, Math.PI * 2); ctx.fill();
  ink(ctx, 1.5); ctx.beginPath(); ctx.arc(r * 0.1, -r * 0.02, r * 0.38, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath(); ctx.arc(-r * 0.04, -r * 0.18, r * 0.1, 0, Math.PI * 2); ctx.fill();
}

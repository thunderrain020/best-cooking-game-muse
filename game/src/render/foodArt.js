// Ember & Tide — render/foodArt.js
// Every ingredient is drawn with vector shapes: no image files, no emoji
// fonts, so the art looks the same in every browser.

export function drawIngredientIcon(ctx, id, cx, cy, r) {
  ctx.save();
  ctx.translate(cx, cy);
  if (id === 'prawn') {
    ctx.strokeStyle = '#ff8a5c'; ctx.lineWidth = r * 0.42; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, r * 0.1, r * 0.62, Math.PI * 0.15, Math.PI * 1.35); ctx.stroke();
    ctx.strokeStyle = '#c94f2a'; ctx.lineWidth = r * 0.1;
    for (const a of [0.35, 0.7, 1.05]) {
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r * 0.42, r * 0.1 + Math.sin(a) * r * 0.42);
      ctx.lineTo(Math.cos(a) * r * 0.82, r * 0.1 + Math.sin(a) * r * 0.82); ctx.stroke();
    }
    ctx.fillStyle = '#ff8a5c';
    ctx.beginPath(); ctx.moveTo(r * 0.55, -r * 0.45); ctx.lineTo(r * 0.95, -r * 0.1); ctx.lineTo(r * 0.55, -r * 0.05); ctx.closePath(); ctx.fill();
  } else if (id === 'fish') {
    ctx.fillStyle = '#9fd8e8';
    ctx.beginPath(); ctx.ellipse(0, 0, r * 0.85, r * 0.45, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-r * 0.7, 0); ctx.lineTo(-r * 1.15, -r * 0.45); ctx.lineTo(-r * 1.15, r * 0.45); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#3f7d92';
    ctx.beginPath(); ctx.arc(r * 0.45, -r * 0.08, r * 0.09, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#3f7d92'; ctx.lineWidth = r * 0.08;
    ctx.beginPath(); ctx.arc(-r * 0.1, 0, r * 0.3, -0.9, 0.9); ctx.stroke();
  } else if (id === 'rice') {
    ctx.fillStyle = '#f5ecd7';
    ctx.beginPath(); ctx.ellipse(0, r * 0.25, r * 0.9, r * 0.55, 0, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff8e6';
    ctx.beginPath(); ctx.ellipse(-r * 0.15, -r * 0.15, r * 0.45, r * 0.3, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d8c49a';
    for (const [x, y] of [[-0.4, 0.1], [0.1, 0.25], [0.45, 0.05], [-0.05, -0.05]]) {
      ctx.beginPath(); ctx.ellipse(x * r, y * r, r * 0.12, r * 0.07, 0.4, 0, Math.PI * 2); ctx.fill();
    }
  } else if (id === 'noodle') {
    ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = r * 0.2; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const y = (i - 1) * r * 0.32;
      ctx.beginPath(); ctx.moveTo(-r * 0.8, y);
      ctx.bezierCurveTo(-r * 0.3, y - r * 0.28, r * 0.3, y + r * 0.28, r * 0.8, y); ctx.stroke();
    }
    ctx.strokeStyle = '#a97c1e'; ctx.lineWidth = r * 0.07;
    ctx.beginPath(); ctx.moveTo(-r * 0.8, -r * 0.32);
    ctx.bezierCurveTo(-r * 0.3, -r * 0.6, r * 0.3, -r * 0.04, r * 0.8, -r * 0.32); ctx.stroke();
  } else if (id === 'egg') {
    ctx.fillStyle = '#fff6e0';
    ctx.beginPath(); ctx.ellipse(0, 0, r * 0.8, r * 0.62, 0.2, 0, Math.PI * 2); ctx.fill();
    const grad = ctx.createRadialGradient(r * 0.1, -r * 0.05, r * 0.05, r * 0.1, -r * 0.05, r * 0.42);
    grad.addColorStop(0, '#ffe066'); grad.addColorStop(1, '#f5a623');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(r * 0.1, -r * 0.05, r * 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath(); ctx.arc(r * -0.02, -r * 0.18, r * 0.1, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'chilli') {
    ctx.strokeStyle = '#e8442e'; ctx.lineWidth = r * 0.4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-r * 0.7, -r * 0.4); ctx.quadraticCurveTo(r * 0.1, r * 0.75, r * 0.75, -r * 0.15); ctx.stroke();
    ctx.strokeStyle = '#4caf6d'; ctx.lineWidth = r * 0.16;
    ctx.beginPath(); ctx.moveTo(-r * 0.7, -r * 0.4); ctx.lineTo(-r * 0.95, -r * 0.7); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.ellipse(-r * 0.15, r * 0.2, r * 0.28, r * 0.09, 0.6, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'lime') {
    ctx.fillStyle = '#7cb832';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#c4ec7a';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.68, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#7cb832'; ctx.lineWidth = r * 0.07;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * r * 0.62, Math.sin(a) * r * 0.62); ctx.stroke();
    }
    ctx.fillStyle = '#a8d94a';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.12, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'herbs') {
    ctx.strokeStyle = '#4caf6d'; ctx.lineWidth = r * 0.12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, r * 0.6); ctx.quadraticCurveTo(r * 0.1, 0, 0, -r * 0.7); ctx.stroke();
    ctx.fillStyle = '#4caf6d';
    for (const [x, y, rot] of [[-0.35, 0.1, -0.7], [0.35, -0.1, 0.7], [-0.3, -0.35, -0.9], [0.3, -0.45, 0.9]]) {
      ctx.save(); ctx.translate(x * r, y * r); ctx.rotate(rot);
      ctx.beginPath(); ctx.ellipse(0, 0, r * 0.34, r * 0.15, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
  }
  ctx.restore();
}

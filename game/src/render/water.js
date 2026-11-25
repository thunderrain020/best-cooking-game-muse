// Ember & Tide — render/water.js
// The harbour water band on the terrace edge (y 300-360): dark water,
// the lighthouse beam's gold path, and soft reflection ripples that
// breathe with the lantern light. Split out of render/window.js so
// both files stay under the 6 KB module cap.

export function drawHarbourWater(ctx, T, now) {
  ctx.fillStyle = '#16324a';
  ctx.fillRect(T.x, 300, T.w, 60);
  ctx.fillStyle = 'rgba(255,217,77,0.34)';
  for (let i = 0; i < 5; i++) {
    const y = 312 + i * 10;
    ctx.fillRect(1060 + Math.sin(now * 0.7 + i) * 8, y, 120 - i * 10, 2);
  }
  // Soft reflection ripples along the terrace edge — slow gold arcs.
  ctx.strokeStyle = 'rgba(255,230,160,0.28)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    const ry = 308 + i * 12;
    const wob = Math.sin(now * 0.9 + i * 1.7) * 6;
    ctx.beginPath();
    ctx.ellipse(1160 + wob, ry, 52 - i * 7, 4, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.ellipse(1100 + Math.sin(now * 0.6 + i) * 8, 318 + i * 14, 30, 3, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}

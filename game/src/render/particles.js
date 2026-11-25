// Ember & Tide — render/particles.js
// Steam, sizzle sparks and floating score callouts. Spawners live here so
// the kitchen systems stay about rules, not pixels. Floats always draw with
// a dark outline so they read over the busiest part of the scene.

import { outlineText } from './palette.js';

export function spawnSteam(g, x, y, n, color) {
  for (let i = 0; i < n; i++) {
    g.particles.push({
      x: x + (g.rng() - 0.5) * 36, y, vx: (g.rng() - 0.5) * 8, vy: -22 - g.rng() * 18,
      r: 3 + g.rng() * 5, t: 0, life: 0.9 + g.rng() * 0.7, color: color || 'rgba(255,244,220,0.5)',
    });
  }
}

export function spawnSparks(g, x, y, n) {
  for (let i = 0; i < n; i++) {
    g.particles.push({
      x, y, vx: (g.rng() - 0.5) * 90, vy: -30 - g.rng() * 60,
      r: 1.5 + g.rng() * 2, t: 0, life: 0.4 + g.rng() * 0.3, color: '#ffb347', spark: true,
    });
  }
}

export function spawnFlameBurst(g, x, y) {
  spawnSparks(g, x, y, 14);
  spawnSteam(g, x, y, 6, 'rgba(255,180,90,0.7)');
}

export function drawParticles(ctx, g) {
  for (const p of g.particles) {
    const a = 1 - p.t / p.life;
    ctx.save();
    ctx.globalAlpha = a * 0.8;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * (p.spark ? 1 : 1 + p.t), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export function drawFloats(ctx, g) {
  for (const f of g.floats) {
    // Dark pill backing plus an ink outline: the callout reads over any
    // art behind it and never blends into a station or hint line. The
    // rise is slow (16px over its life) so it never drifts up into the
    // station hint lines above the art.
    const y = f.y - f.t * 16;
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - f.t / 1.4);
    ctx.font = 'bold 20px system-ui, sans-serif';
    const w = ctx.measureText(f.text).width + 30;
    ctx.fillStyle = 'rgba(24,12,8,0.88)';
    ctx.strokeStyle = '#d4a017';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(f.x - w / 2, y - 18, w, 32, 16);
    ctx.fill();
    ctx.stroke();
    outlineText(ctx, f.text, f.x, y + 1, 'bold 20px system-ui, sans-serif', f.color || '#ffd94d');
    ctx.restore();
  }
}

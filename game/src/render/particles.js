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
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - f.t / 1.4);
    outlineText(ctx, f.text, f.x, f.y - f.t * 40, 'bold 20px system-ui, sans-serif', f.color || '#ffd94d');
    ctx.restore();
  }
}

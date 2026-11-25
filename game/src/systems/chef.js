// Ember & Tide — systems/chef.js
// V2 top-down chef movement: WASD / arrows walk the floor, stroll-to-act
// targets come from the act layer. The chef cannot walk through counters
// or equipment (AABB push-out). Stroll targets are reached via the A*
// path in systems/pathing.js, so the chef walks around the island and
// the counters instead of grinding against them.

import { doAction } from './act.js';
import { ensurePath } from './pathing.js';
import { obstacles } from '../render/layout.js';
import { clamp } from '../core/util.js';

const SPEED=340, RADIUS=13;

function pushOut(c) {
  for (const r of obstacles()) {
    const nx = clamp(c.x, r.x, r.x + r.w);
    const ny = clamp(c.y, r.y, r.y + r.h);
    const dx = c.x - nx, dy = c.y - ny;
    const d2 = dx * dx + dy * dy;
    if (d2 >= RADIUS * RADIUS) continue;
    if (!d2) { c.y = r.y + r.h + RADIUS; continue; }
    const d = Math.sqrt(d2);
    c.x = nx + (dx / d) * RADIUS;
    c.y = ny + (dy / d) * RADIUS;
  }
}

export function updateChef(g, dt, keys, audio) {
  const c = g.chef;
  const setDir = (dx, dy) => {
    c.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
  };
  let vx = 0, vy = 0;
  if (keys) {
    const k = (a, b) => keys.has(a) || keys.has(b);
    if (k('w', 'arrowup')) vy -= 1;
    if (k('s', 'arrowdown')) vy += 1;
    if (k('a', 'arrowleft')) vx -= 1;
    if (k('d', 'arrowright')) vx += 1;
  }
  if (vx || vy) {
    c.tx = null; c.ty = null; c.action = null; c.path = null; c.pathTarget = null;
    const len = Math.hypot(vx, vy);
    c.x += (vx / len) * SPEED * dt;
    c.y += (vy / len) * SPEED * dt;
    setDir(vx, vy);
  } else if (c.tx !== null && c.ty !== null) {
    ensurePath(g);
    let sx = c.tx, sy = c.ty, isFinal = true;
    if (c.path && c.path.length) { sx = c.path[0].x; sy = c.path[0].y; isFinal = false; }
    const dx = sx - c.x, dy = sy - c.y;
    const d = Math.hypot(dx, dy);
    if (d < 12) {
      if (isFinal) {
        c.tx = null; c.ty = null; c.path = null; c.pathTarget = null;
        const action = c.action;
        c.action = null;
        doAction(g, action, audio);
      } else c.path.shift();
    } else {
      c.x += (dx / d) * SPEED * dt;
      c.y += (dy / d) * SPEED * dt;
      setDir(dx, dy);
    }
  }
  c.x = clamp(c.x, 10, 1030);
  c.y = clamp(c.y, 176, 660);
  pushOut(c);
  const moving = !!(vx || vy || (c.tx !== null && c.ty !== null));
  if (moving && (c.stepT += dt) > 0.14) {
    c.stepT = 0;
    c.trail.push({ x: c.x, y: c.y + 10, t: 0 });
  }
  for (const t of c.trail) t.t += dt;
  c.trail = c.trail.filter((t) => t.t < 0.9);
}

// Ember & Tide — core/shotsUtil.js
// Shared helpers for the staged screenshot states: a base game with a
// recorded best run, a ticket with an exact patience clock, and a chef
// placed by hand. Split out of core/shots.js so both files stay under
// the 6 KB module cap.

import { createGame } from './state.js';
import { spawnTicket } from '../systems/orders.js';

export function base(overrides = {}) {
  const g = createGame(7);
  g.mode = 'play';
  g.best = { score: 312, shift: 3 };
  Object.assign(g, overrides);
  return g;
}

export function ticket(g, dishId, patienceLeft, total, critic = false) {
  const t = spawnTicket(g, dishId, critic);
  t.left = patienceLeft;
  t.total = total;
  return t;
}

export function chef(x, y, dir, trail = []) {
  return { x, y, dir, tx: null, ty: null, action: null, trail, stepT: 0, path: null, pathTarget: null };
}

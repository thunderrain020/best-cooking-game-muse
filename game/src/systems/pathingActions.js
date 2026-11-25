// Ember & Tide — systems/pathingActions.js
// Space / E interaction, split out of systems/pathing.js (6,107 B) so
// both stay under 5 KB: the nearest station (Space / E) and the old
// contextual fallback. V13: the fallback answers BOTH cook jobs —
// the wok (F) and the charcoal grill (G) — so dual-cook works
// identically via Space / E as well as via F / G.

import { INGREDIENT_ORDER } from '../data/recipes.js';
import { chopOnce, clickWok, pullWok } from './kitchen.js';
import { clickBell } from './plating.js';
import { servePlate } from './orders.js';
import { stationAt, doAction, actionForKey } from './act.js';

const REACH = 48;

export function nearestStation(g) {
  const c = g.chef;
  const keys = ['board0', 'board1', 'wok0', 'wok1', 'pot', 'plate', 'bell', 'trash', 'garnish'];
  for (let i = 0; i < 8; i++) keys.push('crate:' + INGREDIENT_ORDER[i]);
  let best = null, bestD = REACH * REACH;
  for (const key of keys) {
    const at = stationAt(key);
    const dx = at.x - c.x, dy = at.y - c.y;
    const d = dx * dx + dy * dy;
    if (d < bestD) { bestD = d; best = key; }
  }
  return best;
}

// Space / E: use the station the chef stands at, else the old contextual
// action — now across both cook jobs. A burning job is tossed first;
// otherwise the most urgent cooking job is pulled (largest frac, the
// one closest to its PERFECT pull), then the board, then the bell.
export function interactNearest(g, audio) {
  const key = nearestStation(g);
  if (key) { doAction(g, actionForKey(key, g), audio); return; }
  const jobs = g.wok2 ? [g.wok, g.wok2] : [g.wok];
  const burning = jobs.find((w) => w.state === 'burning');
  if (burning) { clickWok(g, audio, burning.slot); return; }
  let best = null, bestFrac = -1;
  for (const w of jobs) {
    if (w.state !== 'cooking') continue;
    const f = w.t / w.dur;
    if (f > bestFrac) { bestFrac = f; best = w; }
  }
  if (best) { pullWok(g, audio, best); return; }
  if (g.board.item) { chopOnce(g, audio); return; }
  if (g.plate.dishId) { clickBell(g, audio, servePlate); }
}

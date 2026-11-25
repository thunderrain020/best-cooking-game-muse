// Ember & Tide — systems/run.js
// Run flow: starting a shift, ending one into the upgrade/relic draft,
// buying from the draft, and ending the run with a win or a loss.
// The summary screen records the persistent best run.

import { SHIFT_LENGTH, TOTAL_SHIFTS, shiftTarget } from '../core/state.js';
import { UPGRADES, RELICS, pickDraft } from './upgrades.js';
import { recordRun } from '../core/best.js';
import { toast } from './kitchen.js';

export function startShift(g, audio) {
  g.mode = 'play';
  g.paused = false;
  g.spawnIn = 1.2;
  audio.ensure();
  audio.click();
}

export function endShift(g, audio) {
  if (g.shift >= TOTAL_SHIFTS) {
    endRun(g, false, 'The finale target was missed — the Critic left hungry.');
    return;
  }
  if (g.shiftServed < shiftTarget(g.shift)) {
    endRun(g, false, 'Shift ' + g.shift + ' target missed — served ' + g.shiftServed + ' of ' + shiftTarget(g.shift) + '.');
    return;
  }
  g.mode = 'shop';
  g.tickets = [];
  g.hand = null;
  g.plate = { items: [], dishId: null };
  g.tray = [];
  g.board = { item: null, chops: 0, chopsNeeded: 3, anim: 0 };
  g.wok = { item: null, t: 0, dur: 6, perfect: [0.42, 0.62], state: 'idle', anim: 0 };
  g.pot = { item: null, t: 0, dur: 8, state: 'idle' };
  g.rush = null;
  const draft = pickDraft(g, g.rng);
  g.shopChoices = draft.upgrades;
  g.relicChoices = draft.relics;
  g.shiftScores[g.shift - 1] = g.shiftServed;
  g.shift += 1;
  g.shiftLeft = SHIFT_LENGTH;
  g.shiftServed = 0;
  g.time = 0;
  g.rushDone = { sunset: false, storm: false };
  g.combo = 0;
  audio.setSizzle(false);
}

export function buyUpgrade(g, id, audio) {
  const u = UPGRADES.find((x) => x.id === id);
  if (!u || g.upgrades[id]) return;
  if (g.coins < u.cost) { toast(g, 'Not enough coins for that yet.'); return; }
  g.coins -= u.cost;
  u.apply(g);
  audio.coin();
}

export function buyRelic(g, id, audio) {
  const r = RELICS.find((x) => x.id === id);
  if (!r || g.relics[id]) return;
  if (g.coins < r.cost) { toast(g, 'Not enough coins for that yet.'); return; }
  g.coins -= r.cost;
  r.apply(g);
  audio.coin();
}

export function endRun(g, won, reason) {
  g.mode = 'over';
  g.result = { won, reason };
  g.rush = null;
  g.shiftScores[g.shift - 1] = Math.max(g.shiftScores[g.shift - 1] || 0, g.shiftServed);
  recordRun(g);
}

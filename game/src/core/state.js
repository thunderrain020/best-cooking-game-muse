// Ember & Tide — core/state.js
// The whole game state in one factory, plus the tuning constants.
// Stations: board (chop), wok (timed PERFECT window), pot (simmer), plate,
// pass (serve bell). The hand carries one raw or prepared ingredient.
// A run is 5 shifts: Shifts 1-4, then the Critic Finale on Shift 5.
// WIN: clear all 5 shifts and serve the Harbour Critic.
// LOSE: 3 tickets walk out, or the Shift 5 target is missed.

import { mulberry32 } from './util.js';

export const SHIFT_LENGTH = 150; // seconds per shift
export const TOTAL_SHIFTS = 5;
export const MAX_TICKETS_BASE = 4;
export const COMBO_WINDOW = 3;
export const LOSE_MISSES = 3;
export const CRITIC_DISH = 'tide-special';

export function shiftTarget(shift) {
  return 4 + shift * 2; // dishes to serve to clear the shift
}

export function createGame(seed = 20261125) {
  const rng = mulberry32(seed);
  return {
    seed,
    rng,
    mode: 'title', // title | play | shop | over
    paused: false,
    time: 0,
    shift: 1,
    shiftLeft: SHIFT_LENGTH,
    shiftServed: 0, // dishes served this shift
    coins: 0,
    earned: 0,
    served: 0,
    failed: 0, // tickets that walked out (lose at 3)
    combo: 0,
    bestCombo: 0,
    best: { score: 0, shift: 0 }, // persistent best, loaded by main.js
    rush: null,
    rushDone: { sunset: false, storm: false },
    critic: { spawned: false, served: false, active: false },
    result: null, // { won, reason } on the summary screen
    hand: null,
    tickets: [],
    spawnIn: 1.2,
    board: { item: null, chops: 0, chopsNeeded: 3, anim: 0 },
    wok: { item: null, t: 0, dur: 6, perfect: [0.42, 0.62], state: 'idle', anim: 0 },
    pot: { item: null, t: 0, dur: 8, state: 'idle' },
    plate: { items: [], dishId: null },
    tray: [],
    upgrades: { knives: false, wok: false, pass: false, calm: false, bell: false, pot: false },
    relics: {},
    shopChoices: [],
    relicChoices: [],
    ledgerOpen: false,
    helpOpen: false,
    toast: null,
    floats: [],
    particles: [],
    muted: false,
    stats: { perfects: 0, burns: 0, vipServed: 0, criticServed: 0 },
    shot: null,
  };
}

export function maxTickets(g) {
  return MAX_TICKETS_BASE + (g.upgrades.pass ? 1 : 0);
}

export function trayCap(g) {
  return g.relics.ladle ? 6 : 4;
}

export function chopHitsNeeded(g) {
  return g.upgrades.knives ? 2 : 3;
}

export function wokDuration(g) {
  return g.relics.salt ? 8 : 6;
}

export function potDuration(g) {
  return g.upgrades.pot ? 5.6 : 8;
}

export function patienceFor(g, dish) {
  const base = dish.vip ? 70 : 55;
  const critic = dish.id === CRITIC_DISH ? 20 : 0;
  const quill = dish.id === CRITIC_DISH && g.relics.quill ? 20 : 0;
  return base + critic + quill + (g.upgrades.calm ? 12 : 0) + g.shift * 2;
}

export function tipMultiplier(g) {
  return (g.upgrades.bell ? 1.5 : 1) * (1 + Math.min(g.combo, 9) * 0.1);
}

export function comboMult(g) {
  return 1 + Math.min(g.combo, 9) * 0.1;
}

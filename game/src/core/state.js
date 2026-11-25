// Ember & Tide — core/state.js
// The whole game state in one factory, plus the tuning constants.
// Stations: board (chop), wok (timed PERFECT window), pot (simmer), plate,
// pass (serve bell). The hand carries one raw or prepared ingredient.
// A run is 7 Harbour Nights: Shifts 1-6, then the Critic Finale on
// Night 7. WIN: clear all 7 nights and serve the Harbour Critic.
// LOSE: 3 tickets walk out, or a shift target is missed. After a win,
// Endless Rush unlocks: nights keep coming, harder, until service ends.

import { mulberry32 } from './util.js';

export const SHIFT_LENGTH = 150; // seconds per shift
export const TOTAL_SHIFTS = 7;
export const MAX_TICKETS_BASE = 4;
export const COMBO_WINDOW = 3;
export const LOSE_MISSES = 3;
export const CRITIC_DISH = 'tide-special';
export const CLEAN_ROUTE_BONUS = 5;

// Difficulty tiers: patience, ticket arrival rate and rush drain.
export const DIFFICULTIES = {
  calm: { name: 'Calm', patience: 10, spawn: 2, drain: 0.9 },
  service: { name: 'Service', patience: 0, spawn: 0, drain: 1 },
  typhoon: { name: 'Typhoon', patience: -8, spawn: -2, drain: 1.25 },
};

export function shiftTarget(shift) {
  if (shift === TOTAL_SHIFTS) return 1; // the finale is one dish: the Critic
  if (shift > TOTAL_SHIFTS) return 14; // Endless Rush nights stay busy
  return Math.min(14, 3 + shift * 2); // dishes to serve to clear the shift
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
    shiftScores: [0, 0, 0, 0, 0, 0, 0], // dishes served per shift, for the summary
    coins: 0,
    earned: 0,
    served: 0,
    servedDishes: [], // dish ids served this run, in order (summary row)
    failed: 0, // tickets that walked out (lose at 3)
    combo: 0,
    bestCombo: 0,
    best: { score: 0, shift: 0 }, // persistent best, loaded by main.js
    // V5 Championship Edition: difficulty, Endless Rush, feats, goals.
    difficulty: 'service', // calm | service | typhoon
    endless: false, // Endless Rush: nights keep coming after Night 7
    endlessAvailable: false, // unlocked by winning once
    meta: null, // the persisted profile (core/meta.js), attached by main.js
    feats: {}, // unlocked feat ids (persisted through meta)
    goals: [], // this shift's GOALS checklist (systems/goals.js)
    lastGoalsDone: 0, // goals completed last shift (shop stars)
    routeVisited: [], // station keys visited since the plate emptied
    shiftBurns: 0, // wok burns this shift (feats)
    shiftFailed: 0, // tickets lost this shift (feats)
    shiftTrashed: 0, // items tossed this shift (feats)
    failedAtShiftStart: 0,
    draftPicked: { upgrades: false, relics: false },
    rerolls: 0,
    rush: null,
    rushDone: { sunset: false, storm: false },
    critic: { spawned: false, served: false, active: false },
    result: null, // { won, reason } on the summary screen
    hand: null,
    // V2 top-down chef: walks the floor, carries the hand in front, and
    // queues one walk-to-act (click a crate/station to stroll over and
    // do it). `trail` holds fading footstep dust dots.
    chef: { x: 520, y: 520, dir: 'up', tx: null, ty: null, action: null, trail: [], stepT: 0, path: null, pathTarget: null },
    tickets: [],
    spawnIn: 1.2,
    board: { item: null, chops: 0, chopsNeeded: 3, anim: 0, slot: 0 },
    wok: { item: null, t: 0, dur: 6, perfect: [0.42, 0.62], state: 'idle', anim: 0, slot: 0 },
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
    stats: { perfects: 0, burns: 0, vipServed: 0, criticServed: 0, batchServed: 0, cleanRoutes: 0 },
    shot: null,
  };
}

export function maxTickets(g) {
  return MAX_TICKETS_BASE + (g.upgrades.pass ? 1 : 0);
}

export function trayCap(g) {
  return 4 + (g.relics.ladle ? 2 : 0) + (g.upgrades.batch ? 2 : 0);
}

export function chopHitsNeeded(g) {
  return Math.max(1, (g.upgrades.knives ? 2 : 3) - (g.upgrades.twin ? 1 : 0));
}

export function wokDuration(g) {
  return g.relics.salt ? 8 : 6;
}

export function wokPerfect(g) {
  // Crisp Mastery widens the PERFECT window by 20% each side.
  const base = g.upgrades.wok ? [0.36, 0.68] : [0.42, 0.62];
  if (!g.relics.crisp) return base;
  const mid = (base[0] + base[1]) / 2, half = (base[1] - base[0]) / 2 * 1.2;
  return [Math.max(0.05, mid - half), Math.min(0.95, mid + half)];
}

export function potDuration(g) {
  return g.upgrades.pot ? 5.6 : 8;
}

export function patienceFor(g, dish) {
  const diff = DIFFICULTIES[g.difficulty] || DIFFICULTIES.service;
  const base = dish.vip ? 70 : 55;
  const critic = dish.id === CRITIC_DISH ? 20 : 0;
  const quill = dish.id === CRITIC_DISH && g.relics.quill ? 20 : 0;
  return base + critic + quill + (g.upgrades.calm ? 12 : 0) + g.shift * 2 + diff.patience;
}

export function tipMultiplier(g) {
  return (g.upgrades.bell ? 1.5 : 1) * (1 + Math.min(g.combo, 9) * 0.1);
}

export function comboMult(g) {
  return 1 + Math.min(g.combo, 9) * 0.1;
}

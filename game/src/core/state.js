// Ember & Tide — core/state.js
// The whole game state in one factory, plus the tuning constants.
// Stations: board (chop), wok (timed PERFECT window), pot (simmer), plate,
// pass (serve bell). The hand carries one raw or prepared ingredient at a time.

import { mulberry32 } from './util.js';

export const SHIFT_LENGTH = 150; // seconds per shift
export const MAX_TICKETS_BASE = 4;
export const COMBO_WINDOW = 3; // serves in a row before the multiplier steps up

export function createGame(seed = 20261125) {
  const rng = mulberry32(seed);
  return {
    seed,
    rng,
    mode: 'title', // title | play | shop | over
    paused: false,
    time: 0, // seconds since shift start (game time)
    shift: 1,
    shiftLeft: SHIFT_LENGTH,
    coins: 0,
    earned: 0,
    served: 0,
    failed: 0,
    combo: 0,
    bestCombo: 0,
    rush: null, // { name, until } while a rush wave runs
    rushDone: { sunset: false, storm: false },
    hand: null, // { kind: 'raw'|'prepped', id } or null
    tickets: [], // order tickets on the board
    spawnIn: 1.2, // seconds until the next ticket arrives
    board: { item: null, chops: 0, chopsNeeded: 3, anim: 0 }, // chop board
    wok: { item: null, t: 0, dur: 6, perfect: [0.42, 0.62], state: 'idle', anim: 0 }, // sizzle skillet
    pot: { item: null, t: 0, dur: 8, state: 'idle' }, // simmer pot
    plate: { items: [], dishId: null }, // plating counter
    tray: [], // prepped ingredients waiting to be plated (max 4)
    upgrades: { knives: false, wok: false, pass: false, calm: false, bell: false, pot: false },
    shopChoices: [],
    ledgerOpen: false,
    helpOpen: false,
    toast: null, // { text, until }
    floats: [], // floating +coins / PERFECT! texts
    particles: [],
    muted: false,
    stats: { perfects: 0, burns: 0, vipServed: 0 },
    shot: null, // 'cover' | 'prep' | 'rush' | 'upgrades' when staging a screenshot
  };
}

export function maxTickets(g) {
  return MAX_TICKETS_BASE + (g.upgrades.pass ? 1 : 0);
}

export function chopHitsNeeded(g) {
  return g.upgrades.knives ? 2 : 3;
}

export function wokDuration(g) {
  return 6;
}

export function potDuration(g) {
  return g.upgrades.pot ? 5.6 : 8;
}

export function patienceFor(g, dish) {
  const base = dish.vip ? 70 : 55;
  return base + (g.upgrades.calm ? 12 : 0) + g.shift * 2;
}

export function tipMultiplier(g) {
  return (g.upgrades.bell ? 1.5 : 1) * (1 + Math.min(g.combo, 9) * 0.1);
}

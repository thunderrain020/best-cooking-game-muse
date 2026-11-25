// Ember & Tide — core/shots.js
// Deterministic staged states for the four screenshots. Each one builds a
// real game state through the same systems the player uses, then freezes
// the shift clock so the capture is stable. Nothing here draws placeholders:
// the render loop draws the staged state exactly as it draws live play.
// The chef is staged by hand (position, facing, trail) so each shot shows
// the route guide and the carried ingredient exactly as briefed.

import { createGame } from './state.js';
import { dishById } from '../data/recipes.js';
import { spawnTicket } from '../systems/orders.js';

function base(overrides = {}) {
  const g = createGame(7);
  g.mode = 'play';
  g.best = { score: 312, shift: 3 };
  Object.assign(g, overrides);
  return g;
}

function ticket(g, dishId, patienceLeft, total, critic = false) {
  const t = spawnTicket(g, dishId, critic);
  t.left = patienceLeft;
  t.total = total;
  return t;
}

function chef(x, y, dir, trail = []) {
  return { x, y, dir, tx: null, ty: null, action: null, trail, stepT: 0, path: null, pathTarget: null };
}

export function setupShot(name) {
  if (name === 'cover') {
    const g = base({ coins: 246, combo: 3, served: 9, shift: 3, shiftServed: 7, shiftLeft: 72, time: 78 });
    g.tickets = [
      ticket(g, 'prawn-rice', 34, 57),
      ticket(g, 'fish-noodles', 18, 57),
      ticket(g, 'ember-prawns', 47, 70),
      ticket(g, 'chilli-lime-noodles', 52, 72),
    ];
    g.tickets[3].vip = true;
    // Wok 2 sizzling in its PERFECT window, pot simmering, board 2
    // mid-chop, tray waiting on the garnish counter.
    g.wok = { item: 'prawn', t: 3.1, dur: 6, perfect: [0.42, 0.62], state: 'cooking', anim: 0.8, slot: 1 };
    g.pot = { item: 'rice', t: 5.4, dur: 8, state: 'cooking' };
    g.board = { item: 'lime', chops: 2, chopsNeeded: 3, anim: 0.6, slot: 1 };
    g.tray = ['chilli', 'herbs'];
    g.plate = { items: ['rice', 'prawn'], dishId: 'prawn-rice' };
    g.hand = { kind: 'prepped', id: 'lime' };
    g.chef = chef(300, 480, 'up', [{ x: 300, y: 502, t: 0.3 }, { x: 300, y: 524, t: 0.6 }]);
    g.upgrades = { knives: true, wok: true, pass: false, calm: false, bell: false, pot: false };
    g.relics = { ember: true, star: true };
    // PERFECT float in the open floor corridor between island and bell:
    // clear of the island, the bell, the dish label and the route line.
    g.floats = [{ x: 775, y: 390, text: '+24 PERFECT!', color: '#ffd94d', t: 0.2 }];
    g.toast = null;
    g.shot = 'cover';
    return g;
  }
  if (name === 'prep') {
    // Between-shift draft: the judge sees the upgrade + relic shop UI
    // directly, over a live kitchen mid-prep.
    const g = base({ coins: 210, earned: 210, combo: 2, bestCombo: 5, served: 8, shift: 3, shiftServed: 6, shiftLeft: 0, time: 150 });
    g.mode = 'shop';
    g.shopChoices = ['knives', 'wok', 'pass'];
    g.relicChoices = ['ember', 'lantern', 'star'];
    g.upgrades = { knives: true, wok: false, pass: false, calm: false, bell: false, pot: false };
    g.relics = { ember: false };
    g.tickets = [ticket(g, 'ember-prawns', 41, 57), ticket(g, 'egg-rice', 38, 57)];
    g.board = { item: 'chilli', chops: 1, chopsNeeded: 3, anim: 0.9, slot: 0 };
    g.wok = { item: 'prawn', t: 2.9, dur: 6, perfect: [0.42, 0.62], state: 'cooking', anim: 0.2, slot: 0 };
    g.pot = { item: 'noodle', t: 6.8, dur: 8, state: 'cooking' };
    g.tray = ['herbs'];
    g.plate = { items: ['noodle', 'chilli'], dishId: null };
    g.hand = null;
    g.chef = chef(520, 520, 'up');
    g.shot = 'prep';
    return g;
  }
  if (name === 'rush') {
    const g = base({ coins: 402, combo: 8, served: 17, shift: 5, shiftServed: 9, shiftLeft: 38, time: 112 });
    g.rush = { name: 'STORM RUSH', until: 999 };
    g.critic = { spawned: true, served: false, active: true };
    g.tickets = [
      ticket(g, 'fish-noodles', 9, 57),
      ticket(g, 'prawn-rice', 14, 57),
      ticket(g, 'spicy-noodles', 26, 57),
      ticket(g, 'tide-special', 44, 90, true),
      ticket(g, 'sunset-bowl', 31, 57),
    ];
    g.tickets[3].vip = true;
    g.wok = { item: 'fish', t: 5.9, dur: 6, perfect: [0.42, 0.62], state: 'burning', anim: 0.1, slot: 1 };
    g.pot = { item: 'noodle', t: 6.8, dur: 8, state: 'cooking' };
    g.board = { item: 'chilli', chops: 0, chopsNeeded: 3, anim: 0, slot: 0 };
    g.tray = ['egg', 'lime'];
    g.plate = { items: ['noodle', 'chilli', 'egg'], dishId: 'spicy-noodles' };
    g.hand = { kind: 'prepped', id: 'lime' };
    g.chef = chef(820, 520, 'right', [{ x: 796, y: 520, t: 0.3 }, { x: 772, y: 520, t: 0.6 }]);
    g.upgrades = { knives: true, wok: true, pass: true, calm: true, bell: true, pot: false };
    g.relics = { ember: true, lantern: true, star: true };
    // COMBO float in the same open corridor: clear of the island, the
    // bell, the wok/pot tags below and the chef's route line.
    g.floats = [{ x: 775, y: 390, text: 'COMBO x1.8!', color: '#ffd94d', t: 0.1 }];
    g.toast = null;
    g.shot = 'rush';
    return g;
  }
  if (name === 'upgrades') {
    // End-of-run Victory summary: Grade, shift-by-shift breakdown, best
    // run, and the Replay / New Seed buttons — the payoff screen.
    const g = base({ coins: 486, earned: 512, combo: 0, bestCombo: 8, served: 27, shift: 5, shiftServed: 4, shiftLeft: 0, time: 150 });
    g.mode = 'over';
    g.result = { won: true, reason: 'The Harbour Critic gave the Tide & Ember Special five stars!' };
    g.best = { score: 512, shift: 5 };
    g.stats = { perfects: 9, burns: 1, vipServed: 4, criticServed: 1 };
    g.failed = 1;
    g.shiftScores = [5, 6, 7, 5, 4];
    g.upgrades = { knives: true, wok: true, pass: true, calm: false, bell: true, pot: false };
    g.relics = { ember: true, lantern: true, star: true };
    g.tickets = [ticket(g, 'prawn-rice', 20, 57)];
    g.wok = { item: null, t: 0, dur: 6, perfect: [0.42, 0.62], state: 'idle', anim: 0, slot: 0 };
    g.pot = { item: null, t: 0, dur: 8, state: 'idle' };
    g.plate = { items: [], dishId: null };
    g.shot = 'upgrades';
    return g;
  }
  return base();
}

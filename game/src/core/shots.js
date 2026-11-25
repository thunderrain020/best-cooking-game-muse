// Ember & Tide — core/shots.js
// Deterministic staged states for the four screenshots. Each one builds a real
// game state through the same systems the player uses, then freezes the shift
// clock so the capture is stable. Nothing here draws placeholders: the render
// loop draws the staged state exactly as it draws live play.

import { createGame } from './state.js';
import { dishById } from '../data/recipes.js';
import { spawnTicket } from '../systems/orders.js';

function base(overrides = {}) {
  const g = createGame(7);
  g.mode = 'play';
  Object.assign(g, overrides);
  return g;
}

function ticket(g, dishId, patienceLeft, total) {
  const t = spawnTicket(g, dishId);
  t.left = patienceLeft;
  t.total = total;
  return t;
}

export function setupShot(name) {
  if (name === 'cover') {
    const g = base({ coins: 246, combo: 3, served: 9, shiftLeft: 72, time: 78 });
    g.tickets = [
      ticket(g, 'prawn-rice', 34, 57),
      ticket(g, 'fish-noodles', 18, 57),
      ticket(g, 'ember-prawns', 47, 70),
      ticket(g, 'chilli-lime-noodles', 52, 72),
    ];
    g.tickets[3].vip = true;
    g.wok = { item: 'prawn', t: 3.1, dur: 6, perfect: [0.42, 0.62], state: 'cooking', anim: 0.4 };
    g.pot = { item: 'rice', t: 5.4, dur: 8, state: 'cooking' };
    g.board = { item: 'lime', chops: 2, chopsNeeded: 3, anim: 0.6 };
    g.tray = ['chilli', 'herbs'];
    g.plate = { items: ['rice', 'prawn'], dishId: 'prawn-rice' };
    g.hand = { kind: 'prepped', id: 'lime' };
    g.toast = { text: 'PERFECT sear! +4', until: 999 };
    return g;
  }
  if (name === 'prep') {
    const g = base({ coins: 118, combo: 1, served: 4, shiftLeft: 104, time: 46 });
    g.tickets = [ticket(g, 'ember-prawns', 41, 57), ticket(g, 'egg-rice', 38, 57)];
    g.board = { item: 'chilli', chops: 1, chopsNeeded: 3, anim: 0.9 };
    g.wok = { item: 'prawn', t: 2.9, dur: 6, perfect: [0.42, 0.62], state: 'cooking', anim: 0.2 };
    g.pot = { item: null, t: 0, dur: 8, state: 'idle' };
    g.tray = ['herbs'];
    g.plate = { items: [], dishId: null };
    g.hand = null;
    return g;
  }
  if (name === 'rush') {
    const g = base({ coins: 402, combo: 5, served: 17, shiftLeft: 38, time: 112 });
    g.rush = { name: 'SUNSET RUSH', until: 999 };
    g.tickets = [
      ticket(g, 'fish-noodles', 9, 57),
      ticket(g, 'prawn-rice', 14, 57),
      ticket(g, 'spicy-noodles', 26, 57),
      ticket(g, 'tide-special', 44, 72),
      ticket(g, 'sunset-bowl', 31, 57),
    ];
    g.tickets[3].vip = true;
    g.wok = { item: 'fish', t: 5.9, dur: 6, perfect: [0.42, 0.62], state: 'burning', anim: 0.1 };
    g.pot = { item: 'noodle', t: 6.8, dur: 8, state: 'cooking' };
    g.board = { item: 'chilli', chops: 0, chopsNeeded: 3, anim: 0 };
    g.tray = ['egg', 'lime'];
    g.plate = { items: ['noodle'], dishId: 'spicy-noodles' };
    g.hand = { kind: 'raw', id: 'herbs' };
    return g;
  }
  if (name === 'upgrades') {
    const g = base({ coins: 486, earned: 512, combo: 0, bestCombo: 6, served: 21, shiftLeft: 0, time: 150 });
    g.mode = 'shop';
    g.shift = 2;
    g.shopChoices = ['knives', 'wok', 'bell'];
    g.tickets = [ticket(g, 'prawn-rice', 20, 57)];
    g.wok = { item: null, t: 0, dur: 6, perfect: [0.42, 0.62], state: 'idle', anim: 0 };
    g.pot = { item: null, t: 0, dur: 8, state: 'idle' };
    g.plate = { items: [], dishId: null };
    return g;
  }
  return base();
}

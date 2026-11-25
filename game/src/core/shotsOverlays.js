// Ember & Tide — core/shotsOverlays.js
// The staged states for the two overlay screenshots: the between-shift
// draft (prep) and the end-of-run victory summary (upgrades). Split out
// of core/shots.js so both files stay under the 6 KB module cap.

import { base, ticket, chef } from './shotsUtil.js';
import { generateGoals } from '../systems/goals.js';

export function setupPrep() {
  // Between-shift draft: the shop UI over a live kitchen mid-prep.
  // The draft shows the new V5 cards (Batch Prep ×2, Twin Chop,
  // Crisp Mastery, Lantern Chain) and the Reroll ($10) button.
  const g = base({ coins: 210, earned: 210, combo: 2, bestCombo: 5, served: 8, shift: 3, shiftServed: 6, shiftLeft: 0, time: 150 });
  g.mode = 'shop';
  g.shopChoices = ['batch', 'twin', 'wok'];
  g.relicChoices = ['crisp', 'chain', 'lantern'];
  g.upgrades = { knives: true, wok: false, pass: false, calm: false, bell: false, pot: false, batch: false, twin: false };
  g.relics = { ember: false, crisp: false, chain: false, lantern: false };
  g.feats = { 'first-perfect': true, 'perfect-chef': true, 'vip-maestro': true, 'combo-5': true, 'gold-rush': true };
  g.tickets = [ticket(g, 'ember-prawns', 41, 57), ticket(g, 'egg-rice', 38, 57)];
  g.board = { item: 'chilli', chops: 1, chopsNeeded: 3, anim: 0.9, slot: 0 };
  g.wok = { item: 'prawn', t: 2.9, dur: 6, perfect: [0.42, 0.62], state: 'cooking', anim: 0.2, slot: 0 };
  g.pot = { item: 'noodle', t: 6.8, dur: 8, state: 'cooking' };
  g.tray = ['herbs'];
  g.plate = { items: ['noodle', 'chilli'], dishId: null };
  g.hand = null;
  g.chef = chef(520, 520, 'up');
  generateGoals(g);
  g.shot = 'prep';
  return g;
}

export function setupUpgrades() {
  // End-of-run Victory summary: Grade S, 3 stars, 7-bar chart,
  // FEATS 12/16, Perks icon strip, Served Dishes gallery, and the
  // ENDLESS button (unlocked by the win).
  const g = base({ coins: 486, earned: 512, combo: 0, bestCombo: 8, served: 27, shift: 7, shiftServed: 1, shiftLeft: 0, time: 150 });
  g.mode = 'over';
  g.result = { won: true, reason: 'The Harbour Critic gave the Tide & Ember Special five stars!' };
  g.best = { score: 512, shift: 7 };
  g.stats = { perfects: 9, burns: 1, vipServed: 4, criticServed: 1, batchServed: 3, cleanRoutes: 2 };
  g.failed = 0;
  g.shiftScores = [5, 6, 7, 5, 4, 6, 1];
  g.servedDishes = ['prawn-rice', 'fish-noodles', 'spicy-noodles', 'tide-special', 'sunset-bowl', 'ember-prawns'];
  g.upgrades = { knives: true, wok: true, pass: true, calm: false, bell: true, pot: false, batch: true, twin: false };
  g.relics = { ember: true, lantern: true, star: true, crisp: true, chain: false };
  g.feats = {
    'first-perfect': true, 'perfect-chef': true, 'storm-survivor': true, 'zero-waste': true,
    'vip-maestro': true, 'combo-5': true, 'combo-8': true, 'clean-route': true,
    'batch-cook': true, 'critic-fan': true, 'seven-nights': true, 'gold-rush': true,
  };
  g.endlessAvailable = true;
  g.tickets = [ticket(g, 'prawn-rice', 20, 57)];
  g.wok = { item: null, t: 0, dur: 6, perfect: [0.42, 0.62], state: 'idle', anim: 0, slot: 0 };
  g.pot = { item: null, t: 0, dur: 8, state: 'idle' };
  g.plate = { items: [], dishId: null };
  g.shot = 'upgrades';
  return g;
}

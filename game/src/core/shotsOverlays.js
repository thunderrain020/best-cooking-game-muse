// Ember & Tide — core/shotsOverlays.js
// The staged states for the overlay screenshots. V11 lineup:
// prep = the illustrated Title Hub with 3 demo save slots,
// rush = the between-shift draft shop, upgrades = the victory summary.
// The demo save slots in setupTitle exist ONLY in this staged state —
// live play reads real localStorage saves and never sees them. Split
// out of core/shots.js so both files stay under the 6 KB module cap.

import { base, ticket, chef } from './shotsUtil.js';
import { generateGoals } from '../systems/goals.js';

export function setupTitle() {
  // The Title Hub shot: phase 'title', SERVICE highlighted, BEST RUN
  // $512, FEATS 12/16, Endless unlocked, 3 pre-seeded demo save slots.
  const g = base({ coins: 0, served: 0, shift: 1, shiftLeft: 150, time: 0 });
  g.mode = 'title';
  g.difficulty = 'service';
  g.seed = 4821; // V12: the staged hub's demo seed for the SEED pill
  g.best = { score: 512, shift: 7 };
  g.feats = {
    'first-perfect': true, 'perfect-chef': true, 'storm-survivor': true, 'zero-waste': true,
    'vip-maestro': true, 'combo-5': true, 'combo-8': true, 'clean-route': true,
    'batch-cook': true, 'critic-fan': true, 'seven-nights': true, 'gold-rush': true,
  };
  g.endlessAvailable = true;
  g.saveSlots = [
    { shift: 5, difficulty: 'service', coins: 380, served: 21, earned: 380, failed: 0, upgrades: { knives: true, wok: true, batch: true }, relics: { ember: true, star: true }, elapsed: 2538, savedAt: 3 },
    { shift: 3, difficulty: 'calm', coins: 210, served: 12, earned: 210, failed: 1, upgrades: { knives: true }, relics: { ember: true }, elapsed: 1245, savedAt: 2 },
    { shift: 7, difficulty: 'typhoon', coins: 486, served: 27, earned: 512, failed: 0, upgrades: { knives: true, wok: true, pass: true, bell: true, batch: true, twin: true }, relics: { ember: true, lantern: true, star: true, crisp: true }, elapsed: 3720, savedAt: 1 },
  ];
  g.shot = 'prep';
  return g;
}

export function setupPrep() {
  // Between-shift draft: the shop UI over a live kitchen mid-prep.
  // The draft shows the new V5 cards (Batch Prep ×2, Twin Chop,
  // Crisp Mastery, Lantern Chain) and the Reroll ($10) button.
  const g = base({ coins: 210, earned: 210, combo: 2, bestCombo: 5, served: 8, shift: 3, shiftServed: 6, shiftLeft: 0, time: 150 });
  g.mode = 'shop';
  g.shopChoices = ['batch', 'twin', 'wok'];
  g.relicChoices = ['crisp', 'chain', 'lantern'];
  g.upgrades = { knives: true, wok: false, pass: false, calm: false, bell: false, pot: true, batch: false, twin: false };
  // V12: knives + pot make HARBOUR 2/5, so the SET BONUSES bar
  // shows one live bonus (HARBOUR) beside two inactive ones.
  // V8: Ember Charm owned, so the draft cards show live set progress
  // (EMBER 1/6, HARBOUR 2/5 via Sharper Knives + Big Simmer Pot) on their set tags.
  g.relics = { ember: true, crisp: false, chain: false, lantern: false };
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

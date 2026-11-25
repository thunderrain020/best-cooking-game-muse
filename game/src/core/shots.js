// Ember & Tide — core/shots.js
// Deterministic staged states for the four screenshots. Each one builds a
// real game state through the same systems the player uses, then freezes
// the shift clock so the capture is stable. Nothing here draws placeholders:
// the render loop draws the staged state exactly as it draws live play.
// The chef is staged by hand (position, facing, trail) so each shot shows
// the route guide and the carried ingredient exactly as briefed.
// The overlay shots (prep, upgrades) live in core/shotsOverlays.js.

import { base, ticket, chef } from './shotsUtil.js';
import { setupPrep, setupUpgrades } from './shotsOverlays.js';
import { generateGoals } from '../systems/goals.js';

export function setupShot(name) {
  if (name === 'cover') {
    // Peak Night 4/7: numbered route stops (1->2->3), GOALS 2/3,
    // WOK FLARE, BATCH ×2 (prawn is prepped on the plate and shared
    // by the prawn-rice and ember-prawns tickets), an EXTRA SEAR
    // ticket, +24 PERFECT! on the open floor.
    const g = base({ coins: 246, combo: 3, served: 9, shift: 4, shiftServed: 7, shiftLeft: 72, time: 78 });
    g.tickets = [
      ticket(g, 'prawn-rice', 34, 57),
      ticket(g, 'fish-noodles', 18, 57),
      ticket(g, 'ember-prawns', 47, 70),
      ticket(g, 'chilli-lime-noodles', 52, 72),
    ];
    g.tickets[3].vip = true;
    g.tickets[2].mod = 'EXTRA SEAR';
    // Wok 2 sizzling in its PERFECT window, pot simmering, board 2
    // mid-chop, tray waiting on the garnish counter.
    g.wok = { item: 'prawn', t: 3.1, dur: 6, perfect: [0.42, 0.62], state: 'cooking', anim: 0.8, slot: 1 };
    g.pot = { item: 'rice', t: 5.4, dur: 8, state: 'cooking' };
    g.board = { item: 'lime', chops: 2, chopsNeeded: 3, anim: 0.6, slot: 1 };
    g.tray = ['chilli', 'herbs'];
    g.plate = { items: ['rice', 'prawn'], dishId: 'prawn-rice' };
    // Chef carries a raw fish for the urgent fish-noodles ticket, so the
    // route runs wok -> island -> bell: three numbered stops.
    g.hand = { kind: 'raw', id: 'fish' };
    g.chef = chef(300, 480, 'up', [{ x: 300, y: 502, t: 0.3 }, { x: 300, y: 524, t: 0.6 }]);
    g.upgrades = { knives: true, wok: true, pass: false, calm: false, bell: false, pot: false, batch: false, twin: false };
    g.relics = { ember: true, star: true };
    generateGoals(g);
    g.goals[0].done = true; g.goals[0].progress = g.goals[0].target;
    g.goals[1].done = true; g.goals[1].progress = g.goals[1].target;
    // PERFECT float: big two-line callout on the open floor corridor,
    // clear of island/bell/labels.
    g.floats = [{ x: 795, y: 385, text: 'PERFECT SEAR!\n+$24', color: '#ffd94d', t: 0.2 }];
    g.toast = null;
    g.event = { name: 'WOK FLARE', bonus: '+50% SEAR' };
    g.shot = 'cover';
    return g;
  }
  if (name === 'prep') return setupPrep();
  if (name === 'rush') {
    // Storm Rush + Critic Finale on Night 7: BROTH RUSH, rain and
    // lightning, COMBO x1.8!, an EXTRA SEAR ticket, BATCH ×2 (noodle
    // is prepped on the plate and shared by the fish-noodles and
    // spicy-noodles tickets), tall wok flames on the burning wok.
    const g = base({ coins: 402, combo: 8, served: 17, shift: 7, shiftServed: 0, shiftLeft: 38, time: 112 });
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
    g.tickets[2].mod = 'EXTRA SEAR';
    g.wok = { item: 'fish', t: 5.9, dur: 6, perfect: [0.42, 0.62], state: 'burning', anim: 0.1, slot: 1 };
    g.pot = { item: 'noodle', t: 6.8, dur: 8, state: 'cooking' };
    g.board = { item: 'chilli', chops: 0, chopsNeeded: 3, anim: 0, slot: 0 };
    g.tray = ['egg', 'lime'];
    g.plate = { items: ['noodle', 'chilli', 'egg'], dishId: 'spicy-noodles' };
    g.hand = { kind: 'prepped', id: 'lime' };
    // Chef staged higher in the open lane: clears the GARNISH & SAUCE tag.
    g.chef = chef(790, 470, 'right', [{ x: 766, y: 470, t: 0.3 }, { x: 742, y: 470, t: 0.6 }]);
    g.upgrades = { knives: true, wok: true, pass: true, calm: true, bell: true, pot: false, batch: true, twin: false };
    g.relics = { ember: true, lantern: true, star: true, crisp: true, chain: false };
    generateGoals(g);
    g.goals[0].done = true; g.goals[0].progress = g.goals[0].target;
    // COMBO float: big two-line callout on the open corridor, clear
    // of island/bell/tags.
    g.floats = [{ x: 795, y: 385, text: 'STORM COMBO\n×8!', color: '#ffd94d', t: 0.1 }];
    g.toast = null;
    g.event = { name: 'BROTH RUSH', bonus: '+25% TIPS' };
    g.shot = 'rush';
    return g;
  }
  if (name === 'upgrades') return setupUpgrades();
  return base();
}

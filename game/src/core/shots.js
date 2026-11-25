// Ember & Tide — core/shots.js
// Deterministic staged states for the four screenshots. Each one builds a
// real game state through the same systems the player uses, then freezes
// the shift clock so the capture is stable. Nothing here draws placeholders:
// the render loop draws the staged state exactly as it draws live play.
// The chef is staged by hand (position, facing, trail) so each shot shows
// the route guide and the carried ingredient exactly as briefed.
// The overlay shots (prep, upgrades) live in core/shotsOverlays.js.

import { base, ticket, chef } from './shotsUtil.js';
import { setupPrep, setupUpgrades, setupTitle } from './shotsOverlays.js';
import { generateGoals } from '../systems/goals.js';

export function setupShot(name) {
  if (name === 'cover') {
    // V11 cover: the most dramatic state — Storm Rush + Critic Finale
    // on Night 7: BROTH RUSH, rain and lightning, STORM COMBO ×8!,
    // an EXTRA SEAR ticket, BATCH ×2 (noodle is prepped on the plate
    // and shared by the fish-noodles and spicy-noodles tickets), fish
    // searing in the wok + prawn on the grill + lime on board 2,
    // tossed prawn + knife slash FX, and the numbered route line.
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
    // V12 cover: EVERY station firing at once in the Storm Rush —
    // wok searing fish (slot 0) AND grill searing prawn (slot 1,
    // its own cook job), pot simmering, board 2 mid-chop on lime
    // (2/3, slash + confetti), tray waiting on the garnish counter.
    g.wok = { item: 'fish', t: 2.9, dur: 6, perfect: [0.42, 0.62], state: 'cooking', anim: 0.8, slot: 0 };
    g.wok2 = { item: 'prawn', t: 3.1, dur: 6, perfect: [0.42, 0.62], state: 'cooking', anim: 0.8, slot: 1 };
    g.pot = { item: 'noodle', t: 6.8, dur: 8, state: 'cooking' };
    g.board = { item: 'lime', chops: 2, chopsNeeded: 3, anim: 0.6, slot: 1 };
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
    g.shot = 'cover';
    return g;
  }
  if (name === 'prep') return setupTitle();
  if (name === 'rush') return setupPrep();
  if (name === 'upgrades') return setupUpgrades();
  return base();
}

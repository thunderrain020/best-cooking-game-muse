// Ember & Tide — systems/run.js
// Run flow: starting a shift, ending one into the upgrade/relic draft,
// buying from the draft, and ending the run with a win or a loss.
// The summary screen records the persistent best run. V5: 7 Harbour
// Nights, the Critic Finale on Night 7, unlockable Endless Rush, a
// pick-1-of-3 draft per row with a $10 reroll, and per-shift GOALS.

import { SHIFT_LENGTH, TOTAL_SHIFTS, shiftTarget, createGame } from '../core/state.js';
import { UPGRADES, RELICS, pickDraft } from './upgrades.js';
import { recordRun } from '../core/best.js';
import { saveMeta } from '../core/meta.js';
import { assignSaveSlot, snapshotSave, clearSlot } from '../core/saves.js';
import { generateGoals, noteGoal } from './goals.js';
import { checkFeats } from '../data/feats.js';
import { toast } from './kitchen.js';

export const REROLL_COST = 10;

export function startShift(g, audio) {
  g.mode = 'play';
  g.paused = false;
  g.spawnIn = 1.2;
  g.shiftBurns = 0;
  g.shiftFailed = 0;
  g.shiftTrashed = 0;
  g.failedAtShiftStart = g.failed;
  g.routeVisited = [];
  generateGoals(g);
  audio.ensure();
  audio.click();
}

export function endShift(g, audio) {
  noteGoal(g, 'shiftEnd', null, audio);
  checkFeats(g, 'shiftEnd', null, audio);
  if (g.meta && g.meta.dirty) saveMeta(g.meta);
  // The finale: Night 7 ends in the Critic's verdict, not a shop.
  if (!g.endless && g.shift >= TOTAL_SHIFTS) {
    endRun(g, false, 'The finale target was missed — the Critic left hungry.');
    return;
  }
  if (g.shiftServed < shiftTarget(g.shift)) {
    endRun(g, false, 'Night ' + g.shift + ' target missed — served ' + g.shiftServed + ' of ' + shiftTarget(g.shift) + '.');
    return;
  }
  g.mode = 'shop';
  g.tickets = [];
  g.hand = null;
  g.plate = { items: [], dishId: null };
  g.tray = [];
  g.board = { item: null, chops: 0, chopsNeeded: 3, anim: 0, slot: 0 };
  g.wok = { item: null, t: 0, dur: 6, perfect: [0.42, 0.62], state: 'idle', anim: 0, slot: 0 };
  g.wok2 = { item: null, t: 0, dur: 6, perfect: [0.42, 0.62], state: 'idle', anim: 0, slot: 1 };
  g.pot = { item: null, t: 0, dur: 8, state: 'idle' };
  g.rush = null;
  const draft = pickDraft(g, g.rng);
  g.shopChoices = draft.upgrades;
  g.relicChoices = draft.relics;
  g.draftPicked = { upgrades: false, relics: false };
  if (g.shift <= TOTAL_SHIFTS) g.shiftScores[g.shift - 1] = g.shiftServed;
  g.shift += 1;
  g.shiftLeft = SHIFT_LENGTH;
  g.shiftServed = 0;
  g.time = 0;
  g.rushDone = { sunset: false, storm: false };
  g.combo = 0;
  audio.setSizzle(false);
  // A cleared shift autosaves into this run's slot (V11).
  snapshotSave(g);
}

export function buyUpgrade(g, id, audio) {
  const u = UPGRADES.find((x) => x.id === id);
  if (!u || g.upgrades[id]) return;
  if (g.draftPicked.upgrades) { toast(g, 'Draft picked — reroll for fresh choices.'); return; }
  if (g.coins < u.cost) { toast(g, 'Not enough coins for that yet.'); return; }
  g.coins -= u.cost;
  u.apply(g);
  g.draftPicked.upgrades = true;
  audio.coin();
}

export function buyRelic(g, id, audio) {
  const r = RELICS.find((x) => x.id === id);
  if (!r || g.relics[id]) return;
  if (g.draftPicked.relics) { toast(g, 'Draft picked — reroll for fresh choices.'); return; }
  if (g.coins < r.cost) { toast(g, 'Not enough coins for that yet.'); return; }
  g.coins -= r.cost;
  r.apply(g);
  g.draftPicked.relics = true;
  audio.coin();
}

// Reroll ($10): fresh choices for every draft row not picked yet.
export function rerollDraft(g, audio) {
  if (g.draftPicked.upgrades && g.draftPicked.relics) { toast(g, 'Both rows are picked — the draft is set.'); return; }
  if (g.coins < REROLL_COST) { toast(g, 'Reroll costs $10.'); return; }
  g.coins -= REROLL_COST;
  g.rerolls += 1;
  const draft = pickDraft(g, g.rng, g.shopChoices, g.relicChoices);
  if (!g.draftPicked.upgrades) g.shopChoices = draft.upgrades;
  if (!g.draftPicked.relics) g.relicChoices = draft.relics;
  audio.coin();
}

export function endRun(g, won, reason) {
  g.mode = 'over';
  g.result = { won, reason };
  g.rush = null;
  if (g.shift <= TOTAL_SHIFTS) g.shiftScores[g.shift - 1] = Math.max(g.shiftScores[g.shift - 1] || 0, g.shiftServed);
  if (won && g.meta && !g.meta.endlessUnlocked) {
    g.meta.endlessUnlocked = true;
    g.endlessAvailable = true;
  }
  if (g.meta && g.meta.dirty) saveMeta(g.meta);
  recordRun(g);
  // The run is over: its save slot frees up for a fresh run.
  if (g.saveSlot != null) clearSlot(g, g.saveSlot);
}

// Endless Rush: a fresh run that starts on Night 8 and never meets the
// Critic — the nights just keep coming, targets capped at 14 dishes.
export function startEndless(g, audio) {
  const keep = { best: g.best, muted: g.muted, meta: g.meta, difficulty: g.difficulty, feats: g.feats };
  const fresh = createGame(Date.now() % 100000);
  Object.assign(g, fresh);
  g.best = keep.best; g.muted = keep.muted; g.meta = keep.meta;
  g.difficulty = keep.difficulty; g.feats = { ...keep.feats };
  g.endlessAvailable = true;
  g.endless = true;
  g.shift = TOTAL_SHIFTS + 1;
  assignSaveSlot(g);
  startShift(g, audio);
}

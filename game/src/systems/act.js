// Ember & Tide — systems/act.js
// The act layer: station stand-points, the action for each station key,
// and walk-to-act (click a crate or station: act at once when already in
// reach, else stroll over and act on arrival). Every input path — mouse,
// keyboard, and the chef's own stroll — funnels through doAction, so the
// two never drift apart.

import { INGREDIENTS, INGREDIENT_ORDER } from '../data/recipes.js';
import { grabIngredient, clearHand, clickBoard, clickWok, clickPot, toast } from './kitchen.js';
import { clickTray, clickPlate, clickBell } from './plating.js';
import { servePlate } from './orders.js';
import { recordVisit } from './route.js';
import { STATION_AT, crateAt } from '../render/layout.js';
import { trayRect } from '../render/pantry.js';
import { pointInRect } from '../core/util.js';
import { trayCap } from '../core/state.js';

const REACH = 48;

// Clicking the prepped tray: grab the item if the chef is close enough
// to the garnish station, else stroll there first. Returns true when a
// tray slot was hit.
export function trayClick(g, mx, my, audio) {
  for (let i = 0; i < trayCap(g); i++) {
    if (!pointInRect(mx, my, trayRect(i, trayCap(g)))) continue;
    const at = STATION_AT.garnish;
    const c = g.chef;
    const dx = at.x - c.x, dy = at.y - c.y;
    if (dx * dx + dy * dy < REACH * REACH) doAction(g, { kind: 'tray', index: i }, audio);
    else walkTo(g, at.x, at.y, { kind: 'tray', index: i });
    return true;
  }
  return false;
}

export function stationAt(key) {
  if (key === 'plate') return STATION_AT.island;
  if (key[5] === ':') return crateAt(INGREDIENT_ORDER.indexOf(key.slice(6)));
  return STATION_AT[key] || null;
}

export function walkTo(g, x, y, action) { g.chef.tx = x; g.chef.ty = y; g.chef.action = action || null; g.chef.path = null; g.chef.pathTarget = null; }

const ACTS = {
  board0: { kind: 'board', slot: 0 }, board1: { kind: 'board', slot: 1 },
  wok0: { kind: 'wok', slot: 0 }, wok1: { kind: 'wok', slot: 1 },
  pot: { kind: 'pot' }, plate: { kind: 'plate' }, bell: { kind: 'bell' }, trash: { kind: 'trash' },
};

export function actionForKey(key, g) {
  if (key[5] === ':') return { kind: 'crate', id: key.slice(6) };
  if (key === 'garnish') {
    for (let i = 0; i < trayCap(g); i++) if (g.tray[i]) return { kind: 'tray', index: i };
    return { kind: 'tray', index: 0 };
  }
  return ACTS[key] || null;
}

export function doAction(g, action, audio) {
  if (!action) return;
  if (action.kind === 'crate') {
    if (g.hand && g.hand.id === action.id) { clearHand(g); audio.click(); }
    else grabIngredient(g, action.id, audio);
    return;
  }
  if (action.kind === 'board') { recordVisit(g, 'board'); clickBoard(g, audio, action.slot || 0); return; }
  if (action.kind === 'wok') { recordVisit(g, 'wok'); clickWok(g, audio, action.slot || 0); return; }
  if (action.kind === 'pot') { recordVisit(g, 'pot'); clickPot(g, audio); return; }
  if (action.kind === 'plate') { clickPlate(g, audio); return; }
  if (action.kind === 'bell') { clickBell(g, audio, servePlate); return; }
  if (action.kind === 'tray') { clickTray(g, action.index, audio); return; }
  if (action.kind === 'trash' && g.hand) { clearHand(g); g.shiftTrashed += 1; toast(g, 'Tossed it in the bin.'); audio.click(); }
}

export function goAct(g, key, audio) {
  const at = stationAt(key);
  if (!at) return;
  const c = g.chef;
  const dx = at.x - c.x, dy = at.y - c.y;
  if (dx * dx + dy * dy < REACH * REACH) doAction(g, actionForKey(key, g), audio);
  else walkTo(g, at.x, at.y, actionForKey(key, g));
}

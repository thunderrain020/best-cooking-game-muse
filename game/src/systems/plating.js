// Ember & Tide — systems/plating.js
// Tray, plate and pass bell: prepared food waits on the tray, the plate
// stacks components into a dish, and the bell serves the matching ticket.
// V5: a NO HERBS ticket lets its dish complete without the herb
// component, and every plate / bell action is recorded for the CLEAN
// ROUTE check (systems/route.js).

import { DISHES } from '../data/recipes.js';
import { toast, addFloat, toTray } from './kitchen.js';
import { recordVisit } from './route.js';

export function clickTray(g, index, audio) {
  if (g.hand) return false;
  const id = g.tray[index];
  if (!id) return false;
  g.tray.splice(index, 1);
  g.hand = { kind: 'prepped', id };
  audio.pickup();
  return true;
}

export function dishForPlate(items, tickets = []) {
  const sorted = [...items].sort().join('|');
  const exact = DISHES.find((d) => [...d.comps].sort().join('|') === sorted);
  if (exact) return exact;
  // NO HERBS: a ticket for this dish lets it complete without herbs.
  for (const t of tickets) {
    if (t.mod !== 'NO HERBS') continue;
    const noHerbs = t.dish.comps.filter((c) => c !== 'herbs').sort().join('|');
    if (noHerbs === sorted) return t.dish;
  }
  return null;
}

export function clickPlate(g, audio) {
  if (g.hand && g.hand.kind === 'prepped') {
    const id = g.hand.id;
    if (g.plate.items.includes(id)) {
      toast(g, 'That is already on the plate.');
      audio.fail();
      return;
    }
    g.plate.items.push(id);
    g.hand = null;
    audio.place();
    recordVisit(g, 'plate');
    const dish = dishForPlate(g.plate.items, g.tickets);
    g.plate.dishId = dish ? dish.id : null;
    if (dish) {
      // Float sits in the open corridor above the island, never on the art.
      addFloat(g, 700, 312, dish.name + ' ready!', '#ffd94d');
      audio.coin();
    }
    return;
  }
  if (!g.hand && g.plate.items.length) {
    const id = g.plate.items.pop();
    toTray(g, id);
    g.plate.dishId = null;
    if (!g.plate.items.length) g.routeVisited = [];
    audio.pickup();
  }
}

export function clickBell(g, audio, serveFn) {
  if (!g.plate.dishId) {
    if (g.plate.items.length) toast(g, 'Not a dish yet — check the ledger (L).');
    else toast(g, 'Plate a dish first.');
    audio.fail();
    return null;
  }
  recordVisit(g, 'bell');
  const res = serveFn(g, audio);
  if (res && res.ok) {
    audio.bell(); audio.serve();
    addFloat(g, 944, 520, '+' + res.pay + '  ' + res.dish.name, '#ffd94d');
    return res;
  }
  if (res && res.reason === 'no-ticket') {
    toast(g, 'No ticket wants that dish right now.');
    audio.fail();
  }
  return res;
}

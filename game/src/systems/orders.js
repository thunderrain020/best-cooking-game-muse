// Ember & Tide — systems/orders.js
// The order board: tickets arrive, lose patience, and pay out when served.
// Rush waves speed arrivals and shorten patience; combos reward streaks.
// Night 7 is the Critic Finale: a special multi-dish VIP order from the
// Harbour Critic. Serve it to win the run. V5: ticket modifiers
// (EXTRA SEAR / NO HERBS / DOUBLE CHILLI), BATCH ×2 synergy, the CLEAN
// ROUTE bonus, per-shift GOALS and 16 feats.

import { DISHES, INGREDIENTS, dishById } from '../data/recipes.js';
import { maxTickets, patienceFor, tipMultiplier, shiftTarget, CRITIC_DISH, TOTAL_SHIFTS, DIFFICULTIES, CLEAN_ROUTE_BONUS } from '../core/state.js';
import { pick } from '../core/util.js';
import { setBonusActive } from './upgrades.js';
import { batchShared, cleanRouteCheck } from './route.js';
import { noteGoal } from './goals.js';
import { checkFeats } from '../data/feats.js';

// A modifier only lands on a dish it fits: EXTRA SEAR needs a wok
// component, NO HERBS needs herbs, DOUBLE CHILLI needs chilli.
export function pickModifier(g, dish) {
  if (g.rng() > 0.28) return null;
  const opts = [];
  if (dish.comps.some((c) => INGREDIENTS[c].station === 'wok')) opts.push('EXTRA SEAR');
  if (dish.comps.includes('herbs')) opts.push('NO HERBS');
  if (dish.comps.includes('chilli')) opts.push('DOUBLE CHILLI');
  if (!opts.length) return null;
  return opts[Math.floor(g.rng() * opts.length)];
}

export function spawnTicket(g, dishId = null, critic = false) {
  const pool = DISHES.filter((d) => (g.shift < 2 ? !d.vip : true));
  const dish = dishId ? dishById(dishId) : pick(g.rng, pool);
  const total = patienceFor(g, dish);
  const mod = critic ? null : pickModifier(g, dish);
  const t = {
    id: Math.floor(g.rng() * 1e9),
    dishId: dish.id,
    dish,
    left: total - (mod === 'DOUBLE CHILLI' ? 6 : 0),
    total,
    vip: !!dish.vip || g.rng() < 0.12,
    critic,
    mod,
    born: g.time,
    flash: 0,
  };
  g.tickets.push(t);
  return t;
}

export function spawnCritic(g) {
  if (g.critic.spawned) return;
  g.critic.spawned = true;
  g.critic.active = true;
  spawnTicket(g, CRITIC_DISH, true);
}

export function ticketForDish(g, dishId) {
  return g.tickets.find((t) => t.dishId === dishId);
}

export function updateOrders(g, dt, audio) {
  const events = [];
  g.shiftLeft -= dt;
  g.time += dt;

  // Critic Finale: the Critic's order arrives at the start of Night 7.
  // In Endless Rush there is no Critic — the nights just keep coming.
  if (!g.endless && g.shift >= TOTAL_SHIFTS && !g.critic.spawned) {
    spawnCritic(g);
    events.push('critic');
  }

  // Rush waves: Sunset Rush at 60s, Storm Rush at 115s into the shift.
  if (!g.rushDone.sunset && g.time >= 60) {
    g.rushDone.sunset = true;
    g.rush = { name: 'SUNSET RUSH', until: g.time + 25 };
    events.push('rush');
  }
  if (!g.rushDone.storm && g.time >= 115) {
    g.rushDone.storm = true;
    g.rush = { name: 'STORM RUSH', until: g.time + 25 };
    events.push('rush');
  }
  if (g.rush && g.time > g.rush.until) g.rush = null;

  const diff = DIFFICULTIES[g.difficulty] || DIFFICULTIES.service;
  const rate = (g.rush ? 4.5 : 9) + diff.spawn;
  g.spawnIn -= dt;
  if (g.spawnIn <= 0) {
    g.spawnIn = Math.max(3, rate + g.rng() * 4);
    if (g.tickets.length < maxTickets(g)) {
      spawnTicket(g);
      events.push('ticket');
    } else {
      g.spawnIn = 2;
    }
  }

  const drain = (g.rush ? (g.relics.lantern ? 1.12 : 1.25) : 1) * diff.drain;
  for (const t of g.tickets) {
    t.left -= dt * drain;
    t.flash = Math.max(0, (t.flash || 0) - dt);
  }
  const expired = g.tickets.filter((t) => t.left <= 0);
  if (expired.length) {
    g.tickets = g.tickets.filter((t) => t.left > 0);
    g.failed += expired.length;
    g.shiftFailed += expired.length;
    if (g.combo > 0) events.push('comboLost');
    g.combo = 0;
    events.push('expired');
    if (g.failed >= 3) events.push('lose');
  }

  if (g.shiftLeft <= 0) events.push('shiftEnd');
  return events;
}

// Serve the plate at the pass. Pays base + patience tip, scaled by combo,
// plus the ticket modifier premium, the BATCH ×2 share and the CLEAN
// ROUTE bonus when the dish was built in recipe order.
export function servePlate(g, audio) {
  const dishId = g.plate.dishId;
  if (!dishId) return null;
  const t = ticketForDish(g, dishId);
  if (!t) return { ok: false, reason: 'no-ticket' };
  const dish = dishById(dishId);
  const patienceFrac = Math.max(0, t.left / t.total);
  const tip = Math.round((2 + 8 * patienceFrac) * tipMultiplier(g));
  const batch = !!batchShared(g);
  const cleanRoute = cleanRouteCheck(g, dish);
  let pay = dish.price + tip + (t.vip ? 6 : 0) + (t.vip && g.relics.star ? 6 : 0);
  if (t.mod === 'EXTRA SEAR') pay += 4;
  if (t.mod === 'DOUBLE CHILLI') pay += 3;
  // V8 TIDE set bonus: 2+ TIDE pieces pay +$2 tip on every serve.
  if (setBonusActive(g, 'TIDE')) pay += 2;
  if (batch) pay += 2;
  if (cleanRoute) pay += CLEAN_ROUTE_BONUS;
  if (g.rush && g.relics.chain) pay += 2;
  g.coins += pay;
  g.earned += pay;
  g.served += 1;
  g.servedDishes.push(dishId);
  if (g.servedDishes.length > 12) g.servedDishes.shift();
  g.shiftServed += 1;
  g.combo += 1;
  g.bestCombo = Math.max(g.bestCombo, g.combo);
  if (t.vip) g.stats.vipServed += 1;
  if (batch) g.stats.batchServed += 1;
  if (cleanRoute) g.stats.cleanRoutes += 1;
  const fast = g.time - (t.born || 0) <= 10;
  if (t.critic) {
    g.critic.served = true;
    g.critic.active = false;
    g.stats.criticServed += 1;
  }
  g.tickets = g.tickets.filter((x) => x !== t);
  g.plate = { items: [], dishId: null };
  g.routeVisited = [];
  const res = { ok: true, dish, pay, tip, vip: t.vip, combo: g.combo, critic: t.critic, batch, cleanRoute, fast, mod: t.mod };
  noteGoal(g, 'serve', res, audio);
  checkFeats(g, 'serve', res, audio);
  return res;
}

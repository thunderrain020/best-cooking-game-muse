// Ember & Tide — systems/orders.js
// The order board: tickets arrive, lose patience, and pay out when served.
// Rush waves speed arrivals and shorten patience; combos reward streaks.
// Shift 5 is the Critic Finale: a special multi-dish VIP order from the
// Harbour Critic. Serve it to win the run.

import { DISHES, dishById } from '../data/recipes.js';
import { maxTickets, patienceFor, tipMultiplier, shiftTarget, CRITIC_DISH, TOTAL_SHIFTS } from '../core/state.js';
import { pick } from '../core/util.js';

export function spawnTicket(g, dishId = null, critic = false) {
  const pool = DISHES.filter((d) => (g.shift < 2 ? !d.vip : true));
  const dish = dishId ? dishById(dishId) : pick(g.rng, pool);
  const total = patienceFor(g, dish);
  const t = {
    id: Math.floor(g.rng() * 1e9),
    dishId: dish.id,
    dish,
    left: total,
    total,
    vip: !!dish.vip || g.rng() < 0.12,
    critic,
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

  // Critic Finale: the Critic's order arrives at the start of Shift 5.
  if (g.shift >= TOTAL_SHIFTS && !g.critic.spawned) {
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

  const rate = g.rush ? 4.5 : 9;
  g.spawnIn -= dt;
  if (g.spawnIn <= 0) {
    g.spawnIn = rate + g.rng() * 4;
    if (g.tickets.length < maxTickets(g)) {
      spawnTicket(g);
      events.push('ticket');
    } else {
      g.spawnIn = 2;
    }
  }

  const drain = g.rush ? (g.relics.lantern ? 1.12 : 1.25) : 1;
  for (const t of g.tickets) {
    t.left -= dt * drain;
    t.flash = Math.max(0, (t.flash || 0) - dt);
  }
  const expired = g.tickets.filter((t) => t.left <= 0);
  if (expired.length) {
    g.tickets = g.tickets.filter((t) => t.left > 0);
    g.failed += expired.length;
    if (g.combo > 0) events.push('comboLost');
    g.combo = 0;
    events.push('expired');
    if (g.failed >= 3) events.push('lose');
  }

  if (g.shiftLeft <= 0) events.push('shiftEnd');
  return events;
}

// Serve the plate at the pass. Pays base + patience tip, scaled by combo.
export function servePlate(g, audio) {
  const dishId = g.plate.dishId;
  if (!dishId) return null;
  const t = ticketForDish(g, dishId);
  if (!t) return { ok: false, reason: 'no-ticket' };
  const dish = dishById(dishId);
  const patienceFrac = Math.max(0, t.left / t.total);
  const tip = Math.round((2 + 8 * patienceFrac) * tipMultiplier(g));
  const pay = dish.price + tip + (t.vip ? 6 : 0) + (t.vip && g.relics.star ? 6 : 0);
  g.coins += pay;
  g.earned += pay;
  g.served += 1;
  g.servedDishes.push(dishId);
  if (g.servedDishes.length > 12) g.servedDishes.shift();
  g.shiftServed += 1;
  g.combo += 1;
  g.bestCombo = Math.max(g.bestCombo, g.combo);
  if (t.vip) g.stats.vipServed += 1;
  if (t.critic) {
    g.critic.served = true;
    g.critic.active = false;
    g.stats.criticServed += 1;
  }
  g.tickets = g.tickets.filter((x) => x !== t);
  g.plate = { items: [], dishId: null };
  return { ok: true, dish, pay, tip, vip: t.vip, combo: g.combo, critic: t.critic };
}

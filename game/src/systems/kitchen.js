// Ember & Tide — systems/kitchen.js
// The stations: chop board, sizzle wok, simmer pot, plating counter, pass bell.
// One hand carries a single ingredient; each station holds one item at a time.
// Prepared food waits on the tray; the plate stacks components into a dish.

import { INGREDIENTS, DISHES, dishById } from '../data/recipes.js';
import { chopHitsNeeded, potDuration, wokDuration } from '../core/state.js';
import { clamp } from '../core/util.js';

export function toast(g, text) {
  g.toast = { text, until: g.time + 2.2 };
}

export function addFloat(g, x, y, text, color) {
  g.floats.push({ x, y, text, color: color || '#ffd94d', t: 0 });
}

function spawnSteam(g, x, y, n, color) {
  for (let i = 0; i < n; i++) {
    g.particles.push({
      x: x + (g.rng() - 0.5) * 36, y, vx: (g.rng() - 0.5) * 8, vy: -22 - g.rng() * 18,
      r: 3 + g.rng() * 5, t: 0, life: 0.9 + g.rng() * 0.7, color: color || 'rgba(255,244,220,0.5)',
    });
  }
}

function spawnSparks(g, x, y, n) {
  for (let i = 0; i < n; i++) {
    g.particles.push({
      x, y, vx: (g.rng() - 0.5) * 90, vy: -30 - g.rng() * 60,
      r: 1.5 + g.rng() * 2, t: 0, life: 0.4 + g.rng() * 0.3, color: '#ffb347', spark: true,
    });
  }
}

export function grabIngredient(g, id, audio) {
  if (g.hand) return false;
  g.hand = { kind: 'raw', id };
  audio.pickup();
  return true;
}

export function clearHand(g) {
  g.hand = null;
}

// --- Chop board -------------------------------------------------------------
export function clickBoard(g, audio) {
  const b = g.board;
  if (b.item) {
    chopOnce(g, audio);
    return;
  }
  if (g.hand && g.hand.kind === 'raw' && INGREDIENTS[g.hand.id].station === 'board') {
    b.item = g.hand.id;
    b.chops = 0;
    b.chopsNeeded = chopHitsNeeded(g);
    g.hand = null;
    audio.place();
    return;
  }
  if (g.hand) { toast(g, 'That goes to the wok or the pot, not the board.'); audio.fail(); }
}

export function chopOnce(g, audio) {
  const b = g.board;
  if (!b.item) return;
  b.chops += 1;
  b.anim = 1;
  audio.chop();
  if (b.chops >= b.chopsNeeded) {
    toTray(g, b.item);
    addFloat(g, 300, 300, 'Chopped!', '#a8d94a');
    b.item = null;
    b.chops = 0;
  }
}

// --- Wok --------------------------------------------------------------------
export function clickWok(g, audio) {
  const w = g.wok;
  if (w.state === 'burning') {
    w.item = null; w.state = 'idle'; w.t = 0;
    g.stats.burns += 1;
    toast(g, 'Burnt! Tossed it out.');
    audio.burn();
    return;
  }
  if (w.state === 'cooking') {
    pullWok(g, audio);
    return;
  }
  if (g.hand && g.hand.kind === 'raw' && INGREDIENTS[g.hand.id].station === 'wok') {
    w.item = g.hand.id;
    w.t = 0;
    w.dur = wokDuration(g);
    w.state = 'cooking';
    w.perfect = g.upgrades.wok ? [0.36, 0.68] : [0.42, 0.62];
    g.hand = null;
    audio.place();
  } else if (g.hand) {
    toast(g, 'The wok takes prawn, fish or egg.');
    audio.fail();
  }
}

export function pullWok(g, audio) {
  const w = g.wok;
  if (w.state !== 'cooking') return;
  const frac = w.t / w.dur;
  if (frac >= w.perfect[0] && frac <= w.perfect[1]) {
    g.stats.perfects += 1;
    g.coins += 4;
    addFloat(g, 640, 300, 'PERFECT! +4', '#ffd94d');
    audio.perfect();
  } else if (frac < w.perfect[0]) {
    addFloat(g, 640, 300, 'Early — still edible', '#e8e0cf');
    audio.flip();
  } else {
    addFloat(g, 640, 300, 'Late — chewy', '#e8e0cf');
    audio.flip();
  }
  toTray(g, w.item);
  w.item = null;
  w.state = 'idle';
  w.t = 0;
}

// --- Simmer pot -------------------------------------------------------------
export function clickPot(g, audio) {
  const p = g.pot;
  if (p.state === 'cooking') return; // it finishes itself; watch the bubbles
  if (g.hand && g.hand.kind === 'raw' && INGREDIENTS[g.hand.id].station === 'pot') {
    p.item = g.hand.id;
    p.t = 0;
    p.dur = potDuration(g);
    p.state = 'cooking';
    g.hand = null;
    audio.place();
  } else if (g.hand) {
    toast(g, 'The pot takes rice or noodles.');
    audio.fail();
  }
}

// --- Tray & plate -----------------------------------------------------------
export function toTray(g, id) {
  if (g.tray.length >= 4) {
    g.tray.shift();
    toast(g, 'Tray full — oldest item tossed.');
  }
  g.tray.push(id);
}

export function clickTray(g, index, audio) {
  if (g.hand) return false;
  const id = g.tray[index];
  if (!id) return false;
  g.tray.splice(index, 1);
  g.hand = { kind: 'prepped', id };
  audio.pickup();
  return true;
}

export function dishForPlate(items) {
  const sorted = [...items].sort().join('|');
  return DISHES.find((d) => [...d.comps].sort().join('|') === sorted) || null;
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
    const dish = dishForPlate(g.plate.items);
    g.plate.dishId = dish ? dish.id : null;
    if (dish) {
      addFloat(g, 990, 300, dish.name + ' ready!', '#ffd94d');
      audio.coin();
    }
    return;
  }
  if (!g.hand && g.plate.items.length) {
    // Take the last item back off the plate.
    const id = g.plate.items.pop();
    toTray(g, id);
    g.plate.dishId = null;
    audio.pickup();
  }
}

// --- Pass bell --------------------------------------------------------------
export function clickBell(g, audio, serveFn) {
  if (!g.plate.dishId) {
    if (g.plate.items.length) toast(g, 'Not a dish yet — check the ledger (L).');
    else toast(g, 'Plate a dish first.');
    audio.fail();
    return null;
  }
  const res = serveFn(g, audio);
  if (res && res.ok) {
    audio.bell();
    audio.serve();
    addFloat(g, 990, 260, '+' + res.pay + '  ' + res.dish.name, '#ffd94d');
    return res;
  }
  if (res && res.reason === 'no-ticket') {
    toast(g, 'No ticket wants that dish right now.');
    audio.fail();
  }
  return res;
}

// --- Per-frame station timers ----------------------------------------------
export function updateKitchen(g, dt, audio) {
  const w = g.wok;
  if (w.state === 'cooking') {
    w.t += dt;
    w.anim = Math.max(0, w.anim - dt * 2);
    if (g.rng() < dt * 6) spawnSteam(g, 640, 330, 1);
    if (g.rng() < dt * 2) spawnSparks(g, 640, 350, 1);
    if (w.t >= w.dur) {
      w.state = 'burning';
      w.t = w.dur;
      toast(g, 'The wok is burning!');
      audio.burn();
    }
  }
  if (w.state === 'burning' && g.rng() < dt * 8) {
    spawnSteam(g, 640, 330, 1, 'rgba(60,60,60,0.6)');
  }
  const p = g.pot;
  if (p.state === 'cooking') {
    p.t += dt;
    if (g.rng() < dt * 5) spawnSteam(g, 800, 330, 1);
    if (p.t >= p.dur) {
      toTray(g, p.item);
      addFloat(g, 800, 300, INGREDIENTS[p.item].name + ' simmered', '#9fd8e8');
      p.item = null;
      p.state = 'idle';
      p.t = 0;
      audio.perfect();
    }
  }
  g.board.anim = Math.max(0, g.board.anim - dt * 2.5);

  // Particles and floats age out.
  for (const pt of g.particles) {
    pt.t += dt;
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;
    pt.vy -= 12 * dt;
  }
  g.particles = g.particles.filter((pt) => pt.t < pt.life);
  for (const f of g.floats) f.t += dt;
  g.floats = g.floats.filter((f) => f.t < 1.4);

  const cooking = w.state === 'cooking' || p.state === 'cooking';
  audio.setSizzle(cooking && !g.muted && g.mode === 'play');
}

export function clampHandToStations() { /* reserved: hand never leaves the kitchen */ }

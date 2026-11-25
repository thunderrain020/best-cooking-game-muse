// Ember & Tide — systems/kitchen.js
// Chop board, sizzle wok, simmer pot, plating counter, pass bell. One hand
// carries a single ingredient; each station holds one item at a time.

import { INGREDIENTS, DISHES, dishById } from '../data/recipes.js';
import { chopHitsNeeded, potDuration, wokDuration, wokPerfect, trayCap } from '../core/state.js';
import { spawnSteam, spawnSparks, spawnFlameBurst } from '../render/particles.js';
import { noteGoal } from './goals.js';
import { checkFeats } from '../data/feats.js';

export function toast(g, text) {
  g.toast = { text, until: g.time + 2.2 };
}

export function addFloat(g, x, y, text, color) {
  g.floats.push({ x, y, text, color: color || '#ffd94d', t: 0 });
  // Celebratory two-line callouts burst sparks around the wok / bell.
  if (text.includes('\n')) spawnSparks(g, x, y, 12);
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

export function toTray(g, id) {
  if (g.tray.length >= trayCap(g)) {
    g.tray.shift();
    toast(g, 'Tray full — oldest item tossed.');
  }
  g.tray.push(id);
}

export function clickBoard(g, audio, slot) {
  const b = g.board;
  if (b.item) { chopOnce(g, audio); return; }
  if (g.hand && g.hand.kind === 'raw' && INGREDIENTS[g.hand.id].station === 'board') {
    b.item = g.hand.id; b.chops = 0; b.chopsNeeded = chopHitsNeeded(g);
    b.slot = slot || 0;
    g.hand = null; audio.place(); return;
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
    toast(g, INGREDIENTS[b.item].name + ' chopped — on the tray.');
    b.item = null;
    b.chops = 0;
  }
}

export function clickWok(g, audio, slot) {
  const w = g.wok;
  if (w.state === 'burning') {
    w.item = null; w.state = 'idle'; w.t = 0;
    g.stats.burns += 1;
    g.shiftBurns += 1;
    toast(g, 'Burnt! Tossed it out.');
    audio.burn();
    return;
  }
  if (w.state === 'cooking') { pullWok(g, audio); return; }
  if (g.hand && g.hand.kind === 'raw' && INGREDIENTS[g.hand.id].station === 'wok') {
    w.item = g.hand.id; w.t = 0; w.dur = wokDuration(g); w.state = 'cooking';
    w.perfect = wokPerfect(g);
    w.slot = slot || 0;
    g.hand = null; audio.place();
  } else if (g.hand) {
    toast(g, 'The wok takes prawn, fish, egg or scallop.');
    audio.fail();
  }
}

export function pullWok(g, audio) {
  const w = g.wok;
  if (w.state !== 'cooking') return;
  const frac = w.t / w.dur;
  // Floats sit in the open corridor above the wok's tag, clear of labels.
  const fx = w.slot === 1 ? 518 : 314, fy = 520;
  const bx = w.slot === 1 ? 518 : 314;
  if (frac >= w.perfect[0] && frac <= w.perfect[1]) {
    g.stats.perfects += 1;
    const bonus = 4 + (g.relics.ember ? 3 : 0);
    g.coins += bonus;
    addFloat(g, fx, fy, 'PERFECT SEAR!\n+$' + bonus, '#ffd94d');
    spawnFlameBurst(g, bx, 580);
    noteGoal(g, 'perfect', null, audio);
    checkFeats(g, 'perfect', null, audio);
    audio.perfect();
  } else if (frac < w.perfect[0]) {
    addFloat(g, fx, fy, 'Early — still edible', '#e8e0cf'); audio.flip();
  } else {
    addFloat(g, fx, fy, 'Late — chewy', '#e8e0cf'); audio.flip();
  }
  toTray(g, w.item);
  w.item = null;
  w.state = 'idle';
  w.t = 0;
}

export function clickPot(g, audio) {
  const p = g.pot;
  if (p.state === 'cooking') return;
  if (g.hand && g.hand.kind === 'raw' && INGREDIENTS[g.hand.id].station === 'pot') {
    p.item = g.hand.id; p.t = 0; p.dur = potDuration(g); p.state = 'cooking';
    g.hand = null; audio.place();
  } else if (g.hand) {
    toast(g, 'The pot takes rice, noodles or tofu.');
    audio.fail();
  }
}

export function updateKitchen(g, dt, audio) {
  const w = g.wok;
  const wx = w.slot === 1 ? 518 : 314;
  if (w.state === 'cooking') {
    w.t += dt;
    w.anim = Math.max(0, w.anim - dt * 2);
    if (g.rng() < dt * 6) spawnSteam(g, wx, 556, 1);
    if (g.rng() < dt * 2) spawnSparks(g, wx, 576, 1);
    if (w.t >= w.dur) {
      w.state = 'burning';
      w.t = w.dur;
      toast(g, 'The wok is burning!');
      audio.burn();
    }
  }
  if (w.state === 'burning' && g.rng() < dt * 8) {
    spawnSteam(g, wx, 556, 1, 'rgba(60,60,60,0.6)');
  }
  const p = g.pot;
  if (p.state === 'cooking') {
    p.t += dt;
    if (g.rng() < dt * 5) spawnSteam(g, 722, 556, 1);
    if (p.t >= p.dur) {
      toTray(g, p.item);
      toast(g, INGREDIENTS[p.item].name + ' simmered — on the tray.');
      p.item = null;
      p.state = 'idle';
      p.t = 0;
      audio.perfect();
    }
  }
  g.board.anim = Math.max(0, g.board.anim - dt * 2.5);
  for (const pt of g.particles) { pt.t += dt; pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.vy -= 12 * dt; }
  g.particles = g.particles.filter((pt) => pt.t < pt.life);
  for (const f of g.floats) f.t += dt;
  g.floats = g.floats.filter((f) => f.t < 1.4);
  const cooking = w.state === 'cooking' || p.state === 'cooking';
  audio.setSizzle(cooking && !g.muted && g.mode === 'play');
}

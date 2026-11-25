// Ember & Tide — main.js
// Bootstrap and game loop. `?shot=cover|prep|rush|upgrades` stages a frozen
// real game state for the screenshots; without it the game starts on the
// title screen. Input lives in ui/input.js, run flow in systems/run.js.

import { createGame } from './core/state.js';
import { loadBest } from './core/best.js';
import { loadMeta } from './core/meta.js';
import { loadSaves } from './core/saves.js';
import { setupShot } from './core/shots.js';
import { AudioSys } from './systems/audio.js';
import { updateOrders } from './systems/orders.js';
import { updateKitchen, toast } from './systems/kitchen.js';
import { updateChef } from './systems/chef.js';
import { endShift, endRun, startEndless } from './systems/run.js';
import { drawScene } from './render/canvas.js';
import { drawTitle } from './ui/titleOverlay.js';
import { drawShop } from './ui/shopOverlay.js';
import { drawLedger } from './ui/ledgerOverlay.js';
import { drawSummary } from './ui/summaryOverlay.js';
import { drawHelp } from './ui/helpOverlay.js';
import { attachInput } from './ui/input.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const audio = new AudioSys();

const params = new URLSearchParams(location.search);
const shotName = params.get('shot');
let g = shotName ? setupShot(shotName) : createGame();
if (!shotName) {
  g.best = loadBest();
  // The persisted profile: difficulty, unlocked feats, Endless Rush.
  const meta = loadMeta();
  g.meta = meta;
  g.difficulty = meta.difficulty;
  g.feats = { ...meta.feats };
  g.endlessAvailable = meta.endlessUnlocked;
  // V11: the three save slots for the title hub.
  g.saveSlots = loadSaves();
}
g.muted = false;

const view = { mouse: { x: 965, y: 215 }, now: 0, keys: new Set() };
let last = performance.now();

function restart() {
  const best = g.best, muted = g.muted, meta = g.meta;
  g = createGame(Date.now() % 100000);
  g.best = best;
  g.muted = muted;
  g.meta = meta;
  g.saveSlots = loadSaves();
  if (meta) {
    g.difficulty = meta.difficulty;
    g.feats = { ...meta.feats };
    g.endlessAvailable = meta.endlessUnlocked;
  }
  audio.setMuted(muted);
}

attachInput(canvas, { getG: () => g, setG: (ng) => { g = ng; }, audio, restart, startEndless: () => startEndless(g, audio) }, view, shotName);

// In shot mode, settle the steam and sparks, then freeze the clock.
// The settle ages floats out, so restore the staged callouts after it.
if (shotName) {
  // Deep-copy the staged callouts: the settle ages the float objects and
  // can overwrite the toast, so snapshot and restore both afterwards.
  const stagedFloats = g.floats.map((f) => ({ ...f }));
  const stagedToast = g.toast;
  const stagedWok = { ...g.wok };
  const stagedWok2 = g.wok2 ? { ...g.wok2 } : null;
  const stagedPot = { ...g.pot };
  const stagedTray = [...g.tray];
  for (let i = 0; i < 90; i++) updateKitchen(g, 1 / 60, audio);
  g.floats = stagedFloats;
  g.toast = stagedToast;
  g.wok = stagedWok;
  if (stagedWok2) g.wok2 = stagedWok2;
  g.pot = stagedPot;
  g.tray = stagedTray;
  view.mouse = null;
}

function frame(nowMs) {
  const dt = Math.min(0.05, (nowMs - last) / 1000);
  last = nowMs;
  view.now = nowMs / 1000;
  if (!shotName && g.mode === 'play' && !g.paused && !g.ledgerOpen && !g.helpOpen) {
    const events = updateOrders(g, dt, audio);
    for (const ev of events) {
      if (ev === 'rush') { toast(g, g.rush.name + '! Tickets are coming fast.'); audio.bell(); }
      if (ev === 'critic') { toast(g, 'The Harbour Critic has arrived!'); audio.bell(); }
      if (ev === 'expired') audio.fail();
      if (ev === 'comboLost') toast(g, 'Combo lost — a ticket walked out.');
      if (ev === 'lose') endRun(g, false, 'Three tickets walked out — service is over.');
      if (ev === 'shiftEnd') endShift(g, audio);
    }
    updateKitchen(g, dt, audio);
    updateChef(g, dt, view.keys, audio);
    g.elapsed = (g.elapsed || 0) + dt; // V11: run clock for save slots
    if (g.critic.served && g.mode === 'play') {
      endRun(g, true, 'The Critic loved the Tide & Ember Special — seven Harbour Nights cleared!');
    }
  }
  if (g.mode === 'title') {
    drawTitle(ctx, g, view.now);
    // Ledger / help open over the title hub, not instead of it.
    if (g.ledgerOpen) drawLedger(ctx, g);
    else if (g.helpOpen) drawHelp(ctx, g);
  }
  else if (g.mode === 'over') { drawScene(ctx, g, view); drawSummary(ctx, g); }
  else {
    drawScene(ctx, g, view);
    if (g.mode === 'shop') drawShop(ctx, g);
    else if (g.ledgerOpen) drawLedger(ctx, g);
    else if (g.helpOpen) drawHelp(ctx, g);
  }
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

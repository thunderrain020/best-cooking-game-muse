// Ember & Tide — main.js
// Bootstrap, game loop and input. Mouse and keyboard both drive the same
// station actions in systems/kitchen.js, so the two never drift apart.
// `?shot=cover|prep|rush|upgrades` stages a frozen real game state for the
// screenshots; without it the game starts on the title screen.

import { createGame, SHIFT_LENGTH } from './core/state.js';
import { setupShot } from './core/shots.js';
import { INGREDIENT_ORDER, UPGRADES } from './data/recipes.js';
import { AudioSys } from './systems/audio.js';
import { updateOrders, servePlate } from './systems/orders.js';
import {
  grabIngredient, clearHand, clickBoard, chopOnce, clickWok, pullWok,
  clickPot, clickTray, clickPlate, clickBell, updateKitchen, toast,
} from './systems/kitchen.js';
import { drawScene, LAYOUT, crateRect, trayRect, ticketRect, topBarButtons, W, H } from './render/canvas.js';
import {
  drawTitle, titleButtons, drawShop, shopButtons, drawLedger, ledgerButtons,
  drawHelp, helpButtons,
} from './ui/hud.js';
import { pointInRect } from './core/util.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const audio = new AudioSys();

const params = new URLSearchParams(location.search);
const shotName = params.get('shot');
let g = shotName ? setupShot(shotName) : createGame();
g.muted = false;

const view = { mouse: { x: 965, y: 215 }, now: 0 };
let last = performance.now();

function startShift() {
  g.mode = 'play';
  g.paused = false;
  g.spawnIn = 1.2;
  audio.ensure();
  audio.click();
}

function endShift() {
  g.mode = 'shop';
  g.tickets = [];
  g.hand = null;
  g.plate = { items: [], dishId: null };
  g.tray = [];
  g.board = { item: null, chops: 0, chopsNeeded: 3, anim: 0 };
  g.wok = { item: null, t: 0, dur: 6, perfect: [0.42, 0.62], state: 'idle', anim: 0 };
  g.pot = { item: null, t: 0, dur: 8, state: 'idle' };
  g.rush = null;
  const unowned = UPGRADES.filter((u) => !g.upgrades[u.id]);
  const pool = [...unowned];
  const choices = [];
  while (choices.length < 3 && pool.length) {
    choices.push(pool.splice(Math.floor(g.rng() * pool.length), 1)[0].id);
  }
  g.shopChoices = choices;
  g.shift += 1;
  g.shiftLeft = SHIFT_LENGTH;
  g.time = 0;
  g.rushDone = { sunset: false, storm: false };
  g.combo = 0;
  audio.setSizzle(false);
}

function buyUpgrade(id) {
  const u = UPGRADES.find((x) => x.id === id);
  if (!u || g.upgrades[id] || g.coins < u.cost) {
    if (u && !g.upgrades[id] && g.coins < u.cost) toast(g, 'Not enough coins for that yet.');
    return;
  }
  g.coins -= u.cost;
  u.apply(g);
  audio.coin();
}

function pressSpace() {
  if (g.mode !== 'play') return;
  if (g.wok.state === 'cooking') { pullWok(g, audio); return; }
  if (g.wok.state === 'burning') { clickWok(g, audio); return; }
  if (g.board.item) { chopOnce(g, audio); return; }
  if (g.plate.dishId) { clickBell(g, audio, servePlate); }
}

function stationKey(station) {
  if (g.mode !== 'play') return;
  if (station === 'board') clickBoard(g, audio);
  if (station === 'wok') clickWok(g, audio);
  if (station === 'pot') clickPot(g, audio);
  if (station === 'plate') clickPlate(g, audio);
}

function handleClick(mx, my) {
  audio.ensure();
  const p = { x: mx, y: my };
  if (g.mode === 'title') {
    if (pointInRect(mx, my, titleButtons().start)) startShift();
    return;
  }
  if (g.mode === 'shop') {
    const b = shopButtons(g);
    for (const c of b.cards) {
      if (pointInRect(mx, my, c)) { buyUpgrade(c.id); return; }
    }
    if (pointInRect(mx, my, b.next)) startShift();
    return;
  }
  if (g.ledgerOpen) {
    if (pointInRect(mx, my, ledgerButtons().close)) { g.ledgerOpen = false; audio.click(); }
    return;
  }
  if (g.helpOpen) {
    if (pointInRect(mx, my, helpButtons().close)) { g.helpOpen = false; audio.click(); }
    return;
  }
  if (g.mode !== 'play') return;

  const tb = topBarButtons();
  if (pointInRect(mx, my, tb.ledger)) { g.ledgerOpen = true; audio.click(); return; }
  if (pointInRect(mx, my, tb.help)) { g.helpOpen = true; audio.click(); return; }
  if (pointInRect(mx, my, tb.mute)) {
    g.muted = !g.muted;
    audio.setMuted(g.muted);
    audio.click();
    return;
  }
  if (pointInRect(mx, my, LAYOUT.bellRect)) { clickBell(g, audio, servePlate); return; }
  if (pointInRect(mx, my, LAYOUT.boardRect)) { clickBoard(g, audio); return; }
  if (pointInRect(mx, my, LAYOUT.wokRect)) { clickWok(g, audio); return; }
  if (pointInRect(mx, my, LAYOUT.potRect)) { clickPot(g, audio); return; }
  if (pointInRect(mx, my, LAYOUT.plateRect)) { clickPlate(g, audio); return; }
  for (let i = 0; i < 4; i++) {
    if (pointInRect(mx, my, trayRect(i))) { clickTray(g, i, audio); return; }
  }
  for (let i = 0; i < 8; i++) {
    if (pointInRect(mx, my, crateRect(i))) {
      if (g.hand && g.hand.id === INGREDIENT_ORDER[i]) { clearHand(g); audio.click(); }
      else grabIngredient(g, INGREDIENT_ORDER[i], audio);
      return;
    }
  }
  // Clicking empty kitchen space drops the hand.
  if (g.hand) { clearHand(g); audio.click(); }
}

canvas.addEventListener('mousemove', (e) => {
  const r = canvas.getBoundingClientRect();
  view.mouse = {
    x: (e.clientX - r.left) * (W / r.width),
    y: (e.clientY - r.top) * (H / r.height),
  };
});

canvas.addEventListener('click', (e) => {
  const r = canvas.getBoundingClientRect();
  handleClick(
    (e.clientX - r.left) * (W / r.width),
    (e.clientY - r.top) * (H / r.height),
  );
});

window.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const k = e.key.toLowerCase();
  if (shotName) return; // staged shots ignore input
  audio.ensure();
  if (k === 'enter') {
    if (g.mode === 'title') startShift();
    else if (g.mode === 'shop') startShift();
    return;
  }
  if (k === 'l') {
    if (g.mode === 'play') { g.ledgerOpen = !g.ledgerOpen; g.helpOpen = false; audio.click(); }
    return;
  }
  if (k === 'm') { g.muted = !g.muted; audio.setMuted(g.muted); return; }
  if (k === 'escape') {
    if (g.ledgerOpen || g.helpOpen) { g.ledgerOpen = false; g.helpOpen = false; }
    else clearHand(g);
    return;
  }
  if (g.mode !== 'play' || g.ledgerOpen || g.helpOpen) return;
  if (k >= '1' && k <= '8') {
    const id = INGREDIENT_ORDER[Number(k) - 1];
    if (g.hand && g.hand.id === id) clearHand(g);
    else grabIngredient(g, id, audio);
    return;
  }
  if (k === ' ') { e.preventDefault(); pressSpace(); return; }
  if (k === 'q') stationKey('board');
  if (k === 'w') stationKey('wok');
  if (k === 'e') stationKey('pot');
  if (k === 'r') stationKey('plate');
});

// In shot mode, settle the steam and sparks, then freeze the clock.
// setupShot already set the mode ('play', or 'shop' for the upgrades shot).
if (shotName) {
  for (let i = 0; i < 90; i++) updateKitchen(g, 1 / 60, audio);
}

function frame(nowMs) {
  const dt = Math.min(0.05, (nowMs - last) / 1000);
  last = nowMs;
  view.now = nowMs / 1000;
  if (!shotName && g.mode === 'play' && !g.paused && !g.ledgerOpen && !g.helpOpen) {
    const events = updateOrders(g, dt, audio);
    for (const ev of events) {
      if (ev === 'rush') { toast(g, g.rush.name + '! Tickets are coming fast.'); audio.bell(); }
      if (ev === 'expired') audio.fail();
      if (ev === 'comboLost') toast(g, 'Combo lost — a ticket walked out.');
      if (ev === 'shiftEnd') endShift();
    }
    updateKitchen(g, dt, audio);
  }
  if (g.mode === 'title') drawTitle(ctx, g);
  else {
    drawScene(ctx, g, view);
    if (g.mode === 'shop') drawShop(ctx, g);
    else if (g.ledgerOpen) drawLedger(ctx, g);
    else if (g.helpOpen) drawHelp(ctx, g);
  }
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

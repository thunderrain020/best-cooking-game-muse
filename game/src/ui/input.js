// Ember & Tide — ui/input.js
// Mouse and keyboard input. Both drive the same station actions in
// systems/kitchen.js and systems/plating.js, so the two never drift apart.
// The api object bridges to main.js: getG/setG read and replace the live
// game state (restart creates a fresh one), the rest are the run actions.

import { INGREDIENT_ORDER } from '../data/recipes.js';
import { servePlate } from '../systems/orders.js';
import { grabIngredient, clearHand, clickBoard, chopOnce, clickWok, pullWok, clickPot } from '../systems/kitchen.js';
import { clickTray, clickPlate, clickBell } from '../systems/plating.js';
import { startShift, buyUpgrade, buyRelic } from '../systems/run.js';
import { LAYOUT, crateRect, trayRect, topBarButtons, W, H } from '../render/canvas.js';
import { titleButtons } from './titleOverlay.js';
import { shopButtons } from './shopOverlay.js';
import { ledgerButtons } from './ledgerOverlay.js';
import { summaryButtons } from './summaryOverlay.js';
import { helpButtons } from './helpOverlay.js';
import { pointInRect } from '../core/util.js';
import { trayCap } from '../core/state.js';

function pressSpace(g, audio) {
  if (g.mode !== 'play') return;
  if (g.wok.state === 'cooking') { pullWok(g, audio); return; }
  if (g.wok.state === 'burning') { clickWok(g, audio); return; }
  if (g.board.item) { chopOnce(g, audio); return; }
  if (g.plate.dishId) { clickBell(g, audio, servePlate); }
}

function stationKey(g, audio, station) {
  if (g.mode !== 'play') return;
  if (station === 'board') clickBoard(g, audio);
  if (station === 'wok') clickWok(g, audio);
  if (station === 'pot') clickPot(g, audio);
  if (station === 'plate') clickPlate(g, audio);
}

function handleClick(api, mx, my) {
  const g = api.getG();
  const audio = api.audio;
  audio.ensure();
  if (g.mode === 'title') {
    if (pointInRect(mx, my, titleButtons().start)) startShift(g, audio);
    return;
  }
  if (g.mode === 'over') {
    const b = summaryButtons();
    if (pointInRect(mx, my, b.again)) api.restart();
    else if (pointInRect(mx, my, b.seed)) api.restart();
    return;
  }
  if (g.mode === 'shop') {
    const b = shopButtons(g);
    for (const c of b.cards) if (pointInRect(mx, my, c)) { buyUpgrade(g, c.id, audio); return; }
    for (const c of b.relicCards) if (pointInRect(mx, my, c)) { buyRelic(g, c.id, audio); return; }
    if (pointInRect(mx, my, b.next)) startShift(g, audio);
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
  if (pointInRect(mx, my, tb.mute)) { g.muted = !g.muted; audio.setMuted(g.muted); audio.click(); return; }
  if (pointInRect(mx, my, LAYOUT.bellRect)) { clickBell(g, audio, servePlate); return; }
  if (pointInRect(mx, my, LAYOUT.boardRect)) { clickBoard(g, audio); return; }
  if (pointInRect(mx, my, LAYOUT.wokRect)) { clickWok(g, audio); return; }
  if (pointInRect(mx, my, LAYOUT.potRect)) { clickPot(g, audio); return; }
  if (pointInRect(mx, my, LAYOUT.plateRect)) { clickPlate(g, audio); return; }
  for (let i = 0; i < trayCap(g); i++) {
    if (pointInRect(mx, my, trayRect(i, trayCap(g)))) { clickTray(g, i, audio); return; }
  }
  for (let i = 0; i < 8; i++) {
    if (pointInRect(mx, my, crateRect(i))) {
      if (g.hand && g.hand.id === INGREDIENT_ORDER[i]) { clearHand(g); audio.click(); }
      else grabIngredient(g, INGREDIENT_ORDER[i], audio);
      return;
    }
  }
  if (g.hand) { clearHand(g); audio.click(); }
}

export function attachInput(canvas, api, view, shotName) {
  canvas.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    view.mouse = {
      x: (e.clientX - r.left) * (W / r.width),
      y: (e.clientY - r.top) * (H / r.height),
    };
  });
  canvas.addEventListener('click', (e) => {
    const r = canvas.getBoundingClientRect();
    handleClick(api, (e.clientX - r.left) * (W / r.width), (e.clientY - r.top) * (H / r.height));
  });
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const k = e.key.toLowerCase();
    if (shotName) return;
    const g = api.getG();
    const audio = api.audio;
    audio.ensure();
    if (k === 'enter') {
      if (g.mode === 'title') startShift(g, audio);
      else if (g.mode === 'shop') startShift(g, audio);
      else if (g.mode === 'over') api.restart();
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
    if (k === ' ') { e.preventDefault(); pressSpace(g, audio); return; }
    if (k === 'q') stationKey(g, audio, 'board');
    if (k === 'w') stationKey(g, audio, 'wok');
    if (k === 'e') stationKey(g, audio, 'pot');
    if (k === 'r') stationKey(g, audio, 'plate');
  });
}

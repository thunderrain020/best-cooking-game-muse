// Ember & Tide — ui/input.js
// Mouse and keyboard input. WASD / arrows walk; Space / E uses the
// nearest station; Q / F / G / T / R stroll to a station and act;
// 1-9 and 0 grab from crates. Clicking a crate or station strolls
// there and acts on arrival.

import { INGREDIENT_ORDER } from '../data/recipes.js';
import { clearHand } from '../systems/kitchen.js';
import { startShift, buyUpgrade, buyRelic, rerollDraft } from '../systems/run.js';
import { goAct, walkTo, trayClick } from '../systems/act.js';
import { interactNearest } from '../systems/pathingActions.js';
import { LAYOUT, crateRect, topBarButtons, W, H } from '../render/canvas.js';
import { obstacles } from '../render/layout.js';
import { handleTitleClick, handleTitleKey } from './titleMenu.js';
import { shopButtons } from './shopOverlay.js';
import { ledgerButtons } from './ledgerOverlay.js';
import { summaryButtons } from './summaryOverlay.js';
import { helpButtons } from './helpOverlay.js';
import { pointInRect } from '../core/util.js';

function handleClick(api, mx, my) {
  const g = api.getG();
  const audio = api.audio;
  audio.ensure();
  if (g.mode === 'title') {
    // V11: menu buttons, difficulty pills and save slots (ui/titleMenu.js).
    handleTitleClick(g, api, mx, my);
    return;
  }
  if (g.mode === 'over') {
    const b = summaryButtons(g);
    if (pointInRect(mx, my, b.again)) api.restart();
    else if (pointInRect(mx, my, b.seed)) api.restart();
    else if (b.endless && pointInRect(mx, my, b.endless)) api.startEndless();
    return;
  }
  if (g.mode === 'shop') {
    const b = shopButtons(g);
    for (const c of b.cards) if (pointInRect(mx, my, c)) { buyUpgrade(g, c.id, audio); return; }
    for (const c of b.relicCards) if (pointInRect(mx, my, c)) { buyRelic(g, c.id, audio); return; }
    if (pointInRect(mx, my, b.reroll)) { rerollDraft(g, audio); return; }
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
  if (pointInRect(mx, my, LAYOUT.bellRect)) { goAct(g, 'bell', audio); return; }
  if (pointInRect(mx, my, LAYOUT.boardRect)) { goAct(g, 'board0', audio); return; }
  if (pointInRect(mx, my, LAYOUT.boardRect2)) { goAct(g, 'board1', audio); return; }
  if (pointInRect(mx, my, LAYOUT.wokRect)) { goAct(g, 'wok0', audio); return; }
  if (pointInRect(mx, my, LAYOUT.wokRect2)) { goAct(g, 'wok1', audio); return; }
  if (pointInRect(mx, my, LAYOUT.potRect)) { goAct(g, 'pot', audio); return; }
  if (pointInRect(mx, my, LAYOUT.plateRect)) { goAct(g, 'plate', audio); return; }
  if (pointInRect(mx, my, LAYOUT.trashRect)) { goAct(g, 'trash', audio); return; }
  if (trayClick(g, mx, my, audio)) return;
  for (let i = 0; i < 10; i++) {
    if (pointInRect(mx, my, crateRect(i))) { goAct(g, 'crate:' + INGREDIENT_ORDER[i], audio); return; }
  }
  // Open floor: stroll there.
  if (mx >= 10 && mx <= 1030 && my >= 176 && my <= 660) {
    const inside = obstacles().some((r) => pointInRect(mx, my, r));
    if (!inside) walkTo(g, mx, my, null);
  }
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
    const k = e.key.toLowerCase();
    if (view.keys && ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
      view.keys.add(k);
      if (e.repeat) return;
    }
    if (e.repeat) return;
    if (shotName) return;
    const g = api.getG();
    const audio = api.audio;
    audio.ensure();
    // V11: the title hub owns its keys (Enter/N/C/E/L/F/H/1-3).
    if (g.mode === 'title') { handleTitleKey(g, api, k); return; }
    if (k === 'enter') {
      if (g.mode === 'shop') startShift(g, audio);
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
      else { clearHand(g); g.chef.tx = null; g.chef.ty = null; g.chef.action = null; }
      return;
    }
    if (g.mode !== 'play' || g.ledgerOpen || g.helpOpen) return;
    if ((k >= '1' && k <= '9') || k === '0') { goAct(g, 'crate:' + INGREDIENT_ORDER[k === '0' ? 9 : Number(k) - 1], audio); return; }
    if (k === ' ' || k === 'e') { e.preventDefault(); interactNearest(g, audio); return; }
    if (k === 'q') goAct(g, 'board0', audio);
    if (k === 'f') goAct(g, 'wok0', audio);
    // V8: G strolls to the charcoal grill (wok slot 1).
    if (k === 'g') goAct(g, 'wok1', audio);
    if (k === 't') goAct(g, 'pot', audio);
    if (k === 'r') goAct(g, 'plate', audio);
  });
  window.addEventListener('keyup', (e) => {
    if (view.keys) view.keys.delete(e.key.toLowerCase());
  });
}

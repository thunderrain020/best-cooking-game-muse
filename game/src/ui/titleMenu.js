// Ember & Tide — ui/titleMenu.js
// Title hub input: clicks and keys for the menu buttons, difficulty
// pills and save slots. Split out of ui/titleOverlay.js so both files
// stay under the 6 KB module cap. CONTINUE loads the most recent save,
// a slot card loads that slot, NEW RUN assigns a fresh slot, and ✕
// deletes a slot — all real localStorage behaviour (core/saves.js).

import { pointInRect } from '../core/util.js';
import { saveMeta } from '../core/meta.js';
import { assignSaveSlot, applySlot, clearSlot } from '../core/saves.js';
import { startShift } from '../systems/run.js';
import { titleButtons } from './titleOverlay.js';
import { FEATS_CLOSE } from './titleBackdrop.js';
import { ledgerButtons } from './ledgerOverlay.js';
import { helpButtons } from './helpOverlay.js';

function doMenu(g, api, id) {
  const audio = api.audio;
  if (id === 'continue') {
    const slots = g.saveSlots || [];
    let best = -1;
    slots.forEach((s, i) => { if (s && (best < 0 || s.savedAt > slots[best].savedAt)) best = i; });
    if (best < 0) return true;
    applySlot(g, slots[best], best);
    startShift(g, audio);
    return true;
  }
  if (id === 'new') { assignSaveSlot(g); startShift(g, audio); return true; }
  if (id === 'endless') {
    if (!titleButtons(g).endless) { audio.click(); return true; }
    api.startEndless();
    return true;
  }
  if (id === 'ledger') { g.ledgerOpen = true; audio.click(); return true; }
  if (id === 'feats') { g.featsOpen = true; audio.click(); return true; }
  if (id === 'help') { g.helpOpen = true; audio.click(); return true; }
  return true;
}

function setDifficulty(g, audio, id) {
  g.difficulty = id;
  if (g.meta) { g.meta.difficulty = id; g.meta.dirty = true; saveMeta(g.meta); }
  audio.click();
}

export function handleTitleClick(g, api, mx, my) {
  const audio = api.audio;
  if (g.ledgerOpen) {
    if (pointInRect(mx, my, ledgerButtons().close)) { g.ledgerOpen = false; audio.click(); }
    return true;
  }
  if (g.helpOpen) {
    if (pointInRect(mx, my, helpButtons().close)) { g.helpOpen = false; audio.click(); }
    return true;
  }
  if (g.featsOpen) {
    if (pointInRect(mx, my, FEATS_CLOSE)) { g.featsOpen = false; audio.click(); }
    return true;
  }
  const b = titleButtons(g);
  const slots = g.saveSlots || [null, null, null];
  for (let i = 0; i < 3; i++) {
    if (slots[i] && pointInRect(mx, my, b.slotDel[i])) { clearSlot(g, i); audio.click(); return true; }
  }
  for (let i = 0; i < 3; i++) {
    if (slots[i] && pointInRect(mx, my, b.slotRects[i])) { applySlot(g, slots[i], i); startShift(g, audio); return true; }
  }
  for (const d of b.diff) {
    if (pointInRect(mx, my, d)) { setDifficulty(g, audio, d.id); return true; }
  }
  for (const m of b.menu) if (pointInRect(mx, my, m.rect)) return doMenu(g, api, m.id);
  return false;
}

export function handleTitleKey(g, api, k) {
  if (g.ledgerOpen || g.helpOpen) {
    if (k === 'escape' || k === 'l' || k === 'h') { g.ledgerOpen = false; g.helpOpen = false; }
    return true;
  }
  if (g.featsOpen) {
    if (k === 'escape' || k === 'f') g.featsOpen = false;
    return true;
  }
  if (k === 'enter') return doMenu(g, api, (g.saveSlots || []).some(Boolean) ? 'continue' : 'new');
  if (k === 'n') return doMenu(g, api, 'new');
  if (k === 'c') return doMenu(g, api, 'continue');
  if (k === 'e') return doMenu(g, api, 'endless');
  if (k === 'l') return doMenu(g, api, 'ledger');
  if (k === 'f') return doMenu(g, api, 'feats');
  if (k === 'h') return doMenu(g, api, 'help');
  if (k === '1' || k === '2' || k === '3') {
    setDifficulty(g, api.audio, ['calm', 'service', 'typhoon'][Number(k) - 1]);
    return true;
  }
  return false;
}

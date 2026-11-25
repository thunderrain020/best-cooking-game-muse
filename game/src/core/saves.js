// Ember & Tide — core/saves.js
// Three localStorage save slots: a run autosaves into its slot when a
// shift clears, and the title hub can continue any slot. A slot is just
// the run fields needed to restart a shift: shift, difficulty, coins,
// upgrades, relics, served, earned, failed, elapsed. All access is
// guarded: no storage, no crash, and nothing is ever faked into live
// storage — demo slots only exist in staged screenshot states.

const KEY = 'ember-tide-saves-v1';

export function loadSaves() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [null, null, null];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [null, null, null];
    const out = [null, null, null];
    for (let i = 0; i < 3; i++) {
      const s = arr[i];
      if (s && typeof s.shift === 'number') out[i] = s;
    }
    return out;
  } catch (e) {
    return [null, null, null];
  }
}

export function saveSaves(slots) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(slots.slice(0, 3)));
  } catch (e) { /* storage unavailable: slots live for this session only */ }
}

export function fmtElapsed(sec) {
  const s = Math.max(0, Math.floor(sec || 0));
  const m = Math.floor(s / 60);
  return String(m).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}

// Pick a slot for a fresh run: first empty, else the oldest saved run
// (standard autosave rotation, so a new run never silently drops the
// newest save). Returns the slot index.
export function assignSaveSlot(g) {
  const slots = loadSaves();
  let idx = slots.findIndex((s) => !s);
  if (idx === -1) {
    idx = 0;
    for (let i = 1; i < 3; i++) if (slots[i].savedAt < slots[idx].savedAt) idx = i;
  }
  g.saveSlot = idx;
  g.saveSlots = slots;
  return idx;
}

export function snapshotSave(g) {
  if (g.saveSlot == null) return;
  const slots = loadSaves();
  slots[g.saveSlot] = {
    shift: g.shift, difficulty: g.difficulty, coins: g.coins,
    served: g.served, earned: g.earned, failed: g.failed,
    upgrades: { ...g.upgrades }, relics: { ...g.relics },
    elapsed: Math.round(g.elapsed || 0), savedAt: Date.now(),
  };
  saveSaves(slots);
  g.saveSlots = slots;
}

export function clearSlot(g, idx) {
  const slots = loadSaves();
  slots[idx] = null;
  saveSaves(slots);
  g.saveSlots = slots;
  if (g.saveSlot === idx) g.saveSlot = null;
}

// Restore a slot's run fields onto g; the caller then starts the shift.
export function applySlot(g, slot, idx) {
  g.shift = slot.shift;
  g.difficulty = slot.difficulty;
  g.coins = slot.coins;
  g.earned = slot.earned || 0;
  g.served = slot.served || 0;
  g.failed = slot.failed || 0;
  g.upgrades = { ...slot.upgrades };
  g.relics = { ...slot.relics };
  g.elapsed = slot.elapsed || 0;
  g.saveSlot = idx;
  g.shiftLeft = 150;
  g.shiftServed = 0;
  g.time = 0;
}

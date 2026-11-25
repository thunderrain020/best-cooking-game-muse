// Ember & Tide — core/best.js
// Persistent best run, kept in localStorage so a player's record survives
// between visits. All access is guarded: no storage, no crash.

const KEY = 'ember-tide-best-v1';

export function loadBest() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { score: 0, shift: 0 };
    const b = JSON.parse(raw);
    return { score: Number(b.score) || 0, shift: Number(b.shift) || 0 };
  } catch (e) {
    return { score: 0, shift: 0 };
  }
}

export function saveBest(best) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(best));
  } catch (e) { /* storage unavailable: best lives for this session only */ }
}

// Fold a finished run into the stored best and return the new best.
export function recordRun(g) {
  const best = {
    score: Math.max(g.best.score, g.earned),
    shift: Math.max(g.best.shift, g.shift),
  };
  g.best = best;
  saveBest(best);
  return best;
}

// Ember & Tide — core/meta.js
// The roguelite profile: difficulty tier, unlocked feats and the Endless
// Rush unlock, kept in localStorage so progression survives between
// visits. All access is guarded: no storage, no crash. The game never
// invents a profile — an empty one is just Calm-less Service with no
// feats and Endless locked.

const KEY = 'ember-tide-meta-v1';

export function defaultMeta() {
  return { difficulty: 'service', feats: {}, endlessUnlocked: false, dirty: false };
}

export function loadMeta() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultMeta();
    const m = JSON.parse(raw);
    const out = defaultMeta();
    if (['calm', 'service', 'typhoon'].includes(m.difficulty)) out.difficulty = m.difficulty;
    if (m.feats && typeof m.feats === 'object') out.feats = m.feats;
    if (m.endlessUnlocked) out.endlessUnlocked = true;
    return out;
  } catch (e) {
    return defaultMeta();
  }
}

export function saveMeta(meta) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({
      difficulty: meta.difficulty,
      feats: meta.feats,
      endlessUnlocked: meta.endlessUnlocked,
    }));
    meta.dirty = false;
  } catch (e) { /* storage unavailable: profile lives for this session only */ }
}

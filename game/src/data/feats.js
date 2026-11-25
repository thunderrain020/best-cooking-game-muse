// Ember & Tide — data/feats.js
// 16 feats: the roguelite record. Each has a stable id, a name and the
// one-line rule that earns it. checkFeats(g, event) is called from the
// serve / perfect / shift-end paths; it unlocks each feat once per
// profile (persisted through core/meta.js) and toasts the unlock.

export const FEATS = [
  { id: 'first-perfect', name: 'First Perfect', desc: 'Pull one wok item in the PERFECT window.' },
  { id: 'perfect-chef', name: 'Perfect Chef', desc: '5 PERFECT pulls in one run.' },
  { id: 'storm-survivor', name: 'Storm Survivor', desc: 'Serve a dish during a Storm Rush.' },
  { id: 'zero-waste', name: 'Zero Waste', desc: 'Clear a shift with no burns and no lost tickets.' },
  { id: 'vip-maestro', name: 'VIP Maestro', desc: 'Serve 3 VIP dishes in one run.' },
  { id: 'combo-5', name: 'Combo x5', desc: 'Reach a 5-serve combo.' },
  { id: 'combo-8', name: 'Combo x8', desc: 'Reach an 8-serve combo.' },
  { id: 'clean-route', name: 'Clean Route', desc: 'Earn a CLEAN ROUTE bonus.' },
  { id: 'batch-cook', name: 'Batch Cook', desc: 'Serve a BATCH ×2 dish.' },
  { id: 'critic-fan', name: 'Critic’s Fan', desc: 'Serve the Harbour Critic.' },
  { id: 'seven-nights', name: 'Seven Nights', desc: 'Reach Night 7, the Critic Finale.' },
  { id: 'endless-10', name: 'Endless Ten', desc: 'Serve 10 dishes in Endless Rush.' },
  { id: 'no-toss', name: 'No Toss', desc: 'Clear a shift without trashing anything.' },
  { id: 'speed-serve', name: 'Speed Serve', desc: 'Serve a dish within 10s of its ticket arriving.' },
  { id: 'gold-rush', name: 'Gold Rush', desc: 'Earn $500 in one run.' },
  { id: 'full-house', name: 'Full House', desc: 'Serve 5 different dishes in one run.' },
];

export function featCount(g) {
  return FEATS.filter((f) => g.feats && g.feats[f.id]).length;
}

export function unlock(g, id, audio) {
  if (!g.feats) g.feats = {};
  if (g.feats[id]) return false;
  g.feats[id] = true;
  const f = FEATS.find((x) => x.id === id);
  if (f && g.toast) g.toast = { text: '★ FEAT: ' + f.name + '!', until: g.time + 3 };
  if (audio && audio.coin) audio.coin();
  if (g.meta) g.meta.dirty = true;
  return true;
}

// event: 'perfect' | 'serve' | 'shiftEnd' | 'critic' | 'endless'.
// res carries the serve result; g.stats carries the run counters.
export function checkFeats(g, event, res, audio) {
  const s = g.stats;
  if (event === 'perfect') {
    if (s.perfects >= 1) unlock(g, 'first-perfect', audio);
    if (s.perfects >= 5) unlock(g, 'perfect-chef', audio);
  }
  if (event === 'serve' && res && res.ok) {
    if (s.vipServed >= 3) unlock(g, 'vip-maestro', audio);
    if (g.combo >= 5) unlock(g, 'combo-5', audio);
    if (g.combo >= 8) unlock(g, 'combo-8', audio);
    if (res.cleanRoute) unlock(g, 'clean-route', audio);
    if (res.batch) unlock(g, 'batch-cook', audio);
    if (res.critic) unlock(g, 'critic-fan', audio);
    if (g.rush && g.rush.name.includes('STORM')) unlock(g, 'storm-survivor', audio);
    if (g.endless && g.served >= 10) unlock(g, 'endless-10', audio);
    if (g.earned >= 500) unlock(g, 'gold-rush', audio);
    if (res.fast) unlock(g, 'speed-serve', audio);
    const distinct = new Set(g.servedDishes).size;
    if (distinct >= 5) unlock(g, 'full-house', audio);
  }
  if (event === 'shiftEnd') {
    if (g.shiftBurns === 0 && g.shiftFailed === 0) unlock(g, 'zero-waste', audio);
    if (g.shiftTrashed === 0) unlock(g, 'no-toss', audio);
    if (g.shift >= 7) unlock(g, 'seven-nights', audio);
  }
}

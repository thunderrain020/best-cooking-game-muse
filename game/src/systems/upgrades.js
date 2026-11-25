// Ember & Tide — systems/upgrades.js
// Between-shift progression: 8 permanent kitchen upgrades and 8 relics
// (kitchen perks), 16 in all. Each is bought once per run. Upgrades tune
// the stations; relics are the roguelite spice: wider burn windows,
// richer tips, a bigger tray, and help against the Harbour Critic.

export const UPGRADES = [
  { id: 'knives', icon: 'KN', short: 'Knife', name: 'Sharper Knives', cost: 30, desc: 'Chopping takes 2 hits instead of 3.', apply: (g) => { g.upgrades.knives = true; } },
  { id: 'wok', icon: 'WK', short: 'Wide Wok', name: 'Copper Wok', cost: 35, desc: 'The wok PERFECT window is 60% wider.', apply: (g) => { g.upgrades.wok = true; } },
  { id: 'pass', icon: 'PS', short: 'Long Pass', name: 'Longer Pass', cost: 40, desc: 'The order board holds one more ticket.', apply: (g) => { g.upgrades.pass = true; } },
  { id: 'calm', icon: 'CW', short: 'Calm', name: 'Calm Waters', cost: 30, desc: 'Every ticket gets +12s of patience.', apply: (g) => { g.upgrades.calm = true; } },
  { id: 'bell', icon: 'GB', short: 'Gold Bell', name: 'Golden Bell', cost: 45, desc: 'Tips pay 50% more on every serve.', apply: (g) => { g.upgrades.bell = true; } },
  { id: 'pot', icon: 'PT', short: 'Big Pot', name: 'Big Simmer Pot', cost: 25, desc: 'Rice and noodles simmer 30% faster.', apply: (g) => { g.upgrades.pot = true; } },
  { id: 'batch', icon: 'BP', short: 'Batch', name: 'Batch Prep ×2', cost: 35, desc: 'The prepped tray holds 2 extra items.', apply: (g) => { g.upgrades.batch = true; } },
  { id: 'twin', icon: 'TC', short: 'Twin', name: 'Twin Chop', cost: 30, desc: 'Chopping takes 1 fewer hit, every time.', apply: (g) => { g.upgrades.twin = true; } },
];

export const RELICS = [
  { id: 'ember', icon: 'EM', short: 'Ember', name: 'Ember Charm', cost: 25, desc: 'Every PERFECT pull pays +$3 extra.', apply: (g) => { g.relics.ember = true; } },
  { id: 'lantern', icon: 'LN', short: 'Lantern', name: 'Storm Lantern', cost: 30, desc: 'Rush waves drain patience half as fast.', apply: (g) => { g.relics.lantern = true; } },
  { id: 'ladle', icon: 'LD', short: 'Ladle', name: 'Golden Ladle', cost: 25, desc: 'The prepped tray holds 2 extra items.', apply: (g) => { g.relics.ladle = true; } },
  { id: 'star', icon: 'ST', short: 'Harbour Star', name: 'Harbour Star', cost: 35, desc: 'VIP tickets pay +$6 on top of the tip.', apply: (g) => { g.relics.star = true; } },
  { id: 'salt', icon: 'SL', short: 'Salt', name: 'Salt of the Tide', cost: 30, desc: 'The wok gives you 2 extra seconds before it burns.', apply: (g) => { g.relics.salt = true; } },
  { id: 'quill', icon: 'CQ', short: 'Quill', name: "Critic's Quill", cost: 40, desc: 'The Harbour Critic waits +20s for the finale dish.', apply: (g) => { g.relics.quill = true; } },
  { id: 'crisp', icon: 'CM', short: 'Crisp', name: 'Crisp Mastery', cost: 35, desc: 'The wok PERFECT window grows 20% wider.', apply: (g) => { g.relics.crisp = true; } },
  { id: 'chain', icon: 'LC', short: 'Chain', name: 'Lantern Chain', cost: 30, desc: 'Every serve during a rush pays +$2 extra.', apply: (g) => { g.relics.chain = true; } },
];

export function ownedBadges(g) {
  const out = [];
  for (const u of UPGRADES) if (g.upgrades[u.id]) out.push({ id: u.id, icon: u.icon, short: u.short, name: u.name, kind: 'upgrade' });
  for (const r of RELICS) if (g.relics[r.id]) out.push({ id: r.id, icon: r.icon, short: r.short, name: r.name, kind: 'relic' });
  return out;
}

export function pickDraft(g, rng, excludeU = [], excludeR = []) {
  const unownedU = UPGRADES.filter((u) => !g.upgrades[u.id] && !excludeU.includes(u.id));
  const unownedR = RELICS.filter((r) => !g.relics[r.id] && !excludeR.includes(r.id));
  const draw = (pool, n) => {
    const p = [...pool];
    const out = [];
    while (out.length < n && p.length) out.push(p.splice(Math.floor(rng() * p.length), 1)[0].id);
    return out;
  };
  return { upgrades: draw(unownedU, 3), relics: draw(unownedR, 3) };
}

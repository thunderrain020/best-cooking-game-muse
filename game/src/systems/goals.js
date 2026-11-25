// Ember & Tide — systems/goals.js
// The per-shift GOALS checklist: three live objectives per Harbour Night,
// drawn in the HUD panel and paying $10 + a star each when completed.
// Progress is fed from the serve / perfect / combo / shift-end paths.

import { shiftTarget } from '../core/state.js';

export const GOAL_REWARD = 10;

const POOL = [
  { id: 'serve', text: 'Serve %n dishes', target: (g) => Math.min(6, shiftTarget(g.shift)) },
  { id: 'vip', text: 'Serve %n VIPs', target: () => 2 },
  { id: 'perfect', text: '%n PERFECT pulls', target: () => 3 },
  { id: 'clean', text: 'Clean Route bonus', target: () => 1 },
  { id: 'batch', text: 'Serve a BATCH dish', target: () => 1 },
  { id: 'combo', text: 'Reach combo x4', target: () => 1 },
  { id: 'noexpire', text: 'Lose no tickets', target: () => 1 },
];

export function generateGoals(g) {
  const pool = [...POOL];
  const goals = [];
  while (goals.length < 3 && pool.length) {
    const def = pool.splice(Math.floor(g.rng() * pool.length), 1)[0];
    const target = def.target(g);
    goals.push({ id: def.id, text: def.text.replace('%n', String(target)), target, progress: 0, done: false });
  }
  g.goals = goals;
}

export function goalsDone(g) {
  return (g.goals || []).filter((x) => x.done).length;
}

function bump(g, id, n, audio) {
  const goal = (g.goals || []).find((x) => x.id === id);
  if (!goal || goal.done) return;
  goal.progress = Math.min(goal.target, goal.progress + (n || 1));
  if (goal.progress >= goal.target) {
    goal.done = true;
    g.coins += GOAL_REWARD;
    g.earned += GOAL_REWARD;
    if (g.floats) g.floats.push({ x: 114, y: 600, text: 'GOAL +$' + GOAL_REWARD, color: '#a8d94a', t: 0 });
    if (audio && audio.coin) audio.coin();
  }
}

// event: 'serve' (res), 'perfect', 'combo' (combo count), 'shiftEnd'.
export function noteGoal(g, event, res, audio) {
  if (event === 'serve' && res && res.ok) {
    bump(g, 'serve', 1, audio);
    if (res.vip) bump(g, 'vip', 1, audio);
    if (res.batch) bump(g, 'batch', 1, audio);
    if (res.cleanRoute) bump(g, 'clean', 1, audio);
    if (g.combo >= 4) bump(g, 'combo', 1, audio);
  }
  if (event === 'perfect') bump(g, 'perfect', 1, audio);
  if (event === 'shiftEnd') {
    if (g.shiftFailed === 0) bump(g, 'noexpire', 1, audio);
    g.lastGoalsDone = goalsDone(g);
  }
}

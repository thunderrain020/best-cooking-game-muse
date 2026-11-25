// Ember & Tide — render/goals.js
// The GOALS checklist panel: in the empty floor corner below CHOP
// BOARD 2 (bottom-left), clear of every station. Three live shift
// objectives with a gold check when done. Pays $10 per goal; the count
// also rides in the Route Planner pill up top. V6: moved here from the
// garnish station, where it covered the sauce bottles and tray slots.

import { roundRectPath } from '../core/util.js';
import { GOAL_REWARD } from '../systems/goals.js';

export const GOALS_RECT = { x: 16, y: 576, w: 196, h: 84 };

export function drawGoals(ctx, g) {
  const r = GOALS_RECT;
  ctx.fillStyle = 'rgba(24,12,8,0.78)';
  roundRectPath(ctx, r.x, r.y, r.w, r.h, 10); ctx.fill();
  ctx.strokeStyle = '#d4a017';
  ctx.lineWidth = 1.5;
  roundRectPath(ctx, r.x, r.y, r.w, r.h, 10); ctx.stroke();
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.textAlign = 'left';
  const done = (g.goals || []).filter((x) => x.done).length;
  ctx.fillText('GOALS ' + done + '/' + (g.goals ? g.goals.length : 3), r.x + 10, r.y + 18);
  ctx.font = '11px system-ui, sans-serif';
  const goals = g.goals || [];
  for (let i = 0; i < 3; i++) {
    const goal = goals[i];
    const y = r.y + 36 + i * 15;
    if (!goal) continue;
    ctx.fillStyle = goal.done ? '#a8d94a' : '#fdf6e3';
    ctx.fillText((goal.done ? '✓ ' : '· ') + goal.text + '  +$' + GOAL_REWARD, r.x + 10, y);
  }
}

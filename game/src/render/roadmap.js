// Ember & Tide — render/roadmap.js
// The roadmap strip beneath the top bar: the 7-Harbour-Nights roadmap
// (S1..S6 + CRITIC finale), the compact Route Planner pill (stops,
// estimated walk time, BATCH ×2, GOALS progress), and the PERKS strip.
// WIN / LOSE rules live on the Title screen now; the strip keeps only
// what the chef needs mid-shift.

import { roundRectPath } from '../core/util.js';
import { TOTAL_SHIFTS, shiftTarget } from '../core/state.js';
import { ownedBadges } from '../systems/upgrades.js';
import { routeSummary } from '../systems/route.js';
import { goalsDone } from '../systems/goals.js';
import { pill } from './palette.js';

export function drawRoadmap(ctx, g, now) {
  ctx.fillStyle = 'rgba(19,17,38,0.35)';
  ctx.fillRect(0, 46, 1280, 32);
  // Roadmap nodes: short labels (S1 ✓, S2… CRITIC) measured from the
  // full drawn text, with a gap, so nothing is ever clipped.
  let x = 16;
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.textAlign = 'left';
  for (let s = 1; s <= TOTAL_SHIFTS; s++) {
    const done = s < g.shift;
    const cur = s === g.shift;
    const label = (done ? '✓ ' : '') + (s === TOTAL_SHIFTS ? 'CRITIC' : 'S' + s);
    const w = ctx.measureText(label).width + 20;
    ctx.fillStyle = done ? '#4caf6d' : cur ? '#ffd94d' : 'rgba(255,246,227,0.25)';
    roundRectPath(ctx, x, 52, w, 20, 10); ctx.fill();
    ctx.strokeStyle = '#1a120b';
    ctx.lineWidth = 1.5;
    roundRectPath(ctx, x, 52, w, 20, 10); ctx.stroke();
    ctx.fillStyle = done || cur ? '#1a120b' : '#e8dcc2';
    ctx.fillText(label, x + 10, 66);
    x += w + 6;
    if (s < TOTAL_SHIFTS) {
      ctx.fillStyle = '#c9b48a';
      ctx.fillText('›', x - 2, 66);
      x += 8;
    }
  }
  // Route Planner pill, centred: stops, walk time, BATCH, GOALS, target.
  const r = routeSummary(g);
  let plan = 'ROUTE: ' + r.stops + (r.stops === 1 ? ' stop' : ' stops') + ' · ' + r.seconds.toFixed(1) + 's';
  if (r.batch) plan += '  |  BATCH ×2';
  const gd = goalsDone(g);
  plan += '  |  GOALS ' + gd + '/' + (g.goals ? g.goals.length : 3);
  plan += '  |  TARGET ' + g.shiftServed + '/' + shiftTarget(g.shift);
  ctx.font = 'bold 12px system-ui, sans-serif';
  const ow = ctx.measureText(plan).width + 28;
  pill(ctx, 640 - ow / 2, 51, ow, 22, 'rgba(24,12,8,0.88)', '#d4a017');
  ctx.fillStyle = '#ffe6a8';
  ctx.textAlign = 'center';
  ctx.fillText(plan, 640, 66);
  ctx.textAlign = 'left';
  // Perks: readable short labels in a framed strip, max 3 shown + overflow.
  const badges = ownedBadges(g);
  const shown = badges.slice(0, 3);
  const overflow = badges.length - shown.length;
  ctx.font = 'bold 11px system-ui, sans-serif';
  const labelW = (b) => ctx.measureText(b.short).width + 26;
  let stripW = shown.reduce((a, b) => a + labelW(b) + 4, 0);
  if (overflow > 0) stripW += 44;
  stripW += 46; // PERKS caption
  let bx = 1270 - stripW;
  ctx.strokeStyle = '#d4a017';
  ctx.lineWidth = 1.5;
  roundRectPath(ctx, bx - 4, 50, stripW + 8, 24, 8);
  ctx.stroke();
  ctx.fillStyle = '#c9b48a';
  ctx.font = 'bold 10px system-ui, sans-serif';
  ctx.fillText('PERKS', bx + 2, 66);
  bx += 46;
  for (const b of shown) {
    const w = labelW(b);
    ctx.fillStyle = b.kind === 'relic' ? '#7a3b9e' : '#2e7d32';
    roundRectPath(ctx, bx, 52, w, 20, 6); ctx.fill();
    ctx.strokeStyle = '#1a120b';
    ctx.lineWidth = 1.5;
    roundRectPath(ctx, bx, 52, w, 20, 6); ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(b.short, bx + w / 2, 66);
    ctx.textAlign = 'left';
    bx += w + 4;
  }
  if (overflow > 0) {
    ctx.fillStyle = 'rgba(255,246,227,0.25)';
    roundRectPath(ctx, bx, 52, 40, 20, 6); ctx.fill();
    ctx.fillStyle = '#fff6e5';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('+' + overflow, bx + 20, 66);
    ctx.textAlign = 'left';
  }
  ctx.textAlign = 'left';
}

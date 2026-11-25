// Ember & Tide — ui/summaryChart.js
// The end-of-run shift chart: one bar per Harbour Night (S1..S6 +
// CRITIC finale), scaled to the best night — plus the FEATS badge
// (unlocked feats out of 16). Split out of ui/summaryOverlay.js so
// both files stay under the 6 KB module cap.

import { roundRectPath } from '../core/util.js';
import { TOTAL_SHIFTS } from '../core/state.js';
import { featCount } from '../data/feats.js';

export function drawFeatsBadge(ctx, g) {
  ctx.fillStyle = '#7a3b9e';
  roundRectPath(ctx, 880, 148, 132, 26, 13); ctx.fill();
  ctx.strokeStyle = '#e8a0f0'; ctx.lineWidth = 1.5;
  roundRectPath(ctx, 880, 148, 132, 26, 13); ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FEATS ' + featCount(g) + '/16', 946, 166);
}

// Post-shift quote line for the victory card: the regulars react to
// the run. Sits between the stars and the stats, clear of both.
export function drawVictoryQuote(ctx, g, won) {
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'italic 14px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    won ? '“Crisp sear!” — Critic Lin' : '“The harbour is still hungry…” — Capt. Budi',
    640, 188,
  );
}

export function drawShiftChart(ctx, g) {
  const scores = g.shiftScores || Array(TOTAL_SHIFTS).fill(0);
  const maxS = Math.max(1, ...scores);
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DISHES PER SHIFT', 640, 306);
  scores.forEach((s, i) => {
    const bx = 386 + i * 76, bh = 10 + (s / maxS) * 44;
    ctx.fillStyle = i === TOTAL_SHIFTS - 1 ? '#7a3b9e' : '#2e7d32';
    roundRectPath(ctx, bx, 380 - bh, 52, bh, 6); ctx.fill();
    ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 1.5;
    roundRectPath(ctx, bx, 380 - bh, 52, bh, 6); ctx.stroke();
    if (bh >= 18) {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillText(String(s), bx + 26, 380 - bh + 16);
    } else {
      // Short bar (the finale is a single dish): number above it.
      ctx.fillStyle = '#ffd94d';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillText(String(s), bx + 26, 380 - bh - 6);
    }
    ctx.fillStyle = '#b8a67c';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillText(i === TOTAL_SHIFTS - 1 ? 'CRITIC' : 'S' + (i + 1), bx + 26, 394);
  });
}

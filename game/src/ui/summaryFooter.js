// Ember & Tide — ui/summaryFooter.js
// Victory-card footer, split out of ui/summarySections.js (V13) so
// both stay under 5.5 KB: the BEST RUN gold pill and the COOK AGAIN /
// NEW SEED / ENDLESS buttons, plus their hit-test rects.

import { fmtCoins, roundRectPath } from '../core/util.js';
import { SUMMARY_SECTIONS } from './summarySections.js';

// BEST RUN gold pill: text centred in the 26px pill.
export function drawBestRunPill(ctx, g, y) {
  const best = 'BEST RUN: ' + fmtCoins(g.best.score) + ' earned · reached Shift ' + g.best.shift;
  ctx.font = 'bold 15px system-ui, sans-serif';
  const bw = ctx.measureText(best).width + 28;
  ctx.fillStyle = '#d4a017';
  roundRectPath(ctx, 640 - bw / 2, y, bw, 26, 13);
  ctx.fill();
  ctx.strokeStyle = '#1a120b';
  ctx.lineWidth = 1.5;
  roundRectPath(ctx, 640 - bw / 2, y, bw, 26, 13);
  ctx.stroke();
  ctx.fillStyle = '#1a120b';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(best, 640, y + 13);
  ctx.textBaseline = 'alphabetic';
}

// COOK AGAIN / NEW SEED / ENDLESS: text centred in the 48px buttons.
export function drawSummaryButtons(ctx, g, y) {
  const btn = (x, label, fill) => {
    ctx.fillStyle = fill;
    roundRectPath(ctx, x, y, 200, 48, 12);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 19px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + 100, y + 24);
    ctx.textBaseline = 'alphabetic';
  };
  btn(340, 'COOK AGAIN', '#e8703f');
  btn(560, 'NEW SEED', '#2e7d32');
  if (g.endlessAvailable || g.meta && g.meta.endlessUnlocked) btn(780, 'ENDLESS', '#7a3b9e');
}

export function summaryButtons(g) {
  const y = SUMMARY_SECTIONS.buttonsY;
  const btns = {
    again: { x: 340, y, w: 200, h: 48 },
    seed: { x: 560, y, w: 200, h: 48 },
  };
  if (g.endlessAvailable || g.meta && g.meta.endlessUnlocked) btns.endless = { x: 780, y, w: 200, h: 48 };
  return btns;
}

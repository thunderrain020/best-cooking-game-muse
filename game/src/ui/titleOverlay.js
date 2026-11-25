// Ember & Tide — ui/titleOverlay.js
// Title screen: the game name, the promise, the controls, and the
// persistent best run. Drawn over the kitchen backdrop.

import { fmtCoins, roundRectPath } from '../core/util.js';
import { TOTAL_SHIFTS, LOSE_MISSES } from '../core/state.js';

function dim(ctx) {
  ctx.fillStyle = 'rgba(16,8,4,0.72)';
  ctx.fillRect(0, 0, 1280, 720);
}

function panel(ctx, x, y, w, h) {
  ctx.fillStyle = '#fdf6e3';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 6;
  roundRectPath(ctx, x, y, w, h, 16);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
}

export function drawTitle(ctx, g) {
  dim(ctx);
  panel(ctx, 240, 90, 800, 540);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#e8703f';
  ctx.font = 'bold 64px Georgia, serif';
  ctx.fillText('EMBER & TIDE', 640, 190);
  ctx.fillStyle = '#7a3b5e';
  ctx.font = 'italic 24px Georgia, serif';
  ctx.fillText('a rooftop harbour kitchen at sunset', 640, 232);
  ctx.fillStyle = '#2a1a12';
  ctx.font = '17px system-ui, sans-serif';
  const lines = [
    'The dinner crowd is coming up the stairs. Take their orders,',
    'chop, sizzle and simmer, plate it beautiful, and ring the bell.',
    'Serve fast for tips, chain serves for combos, and mind the wok —',
    'a perfect pull pays extra, a burnt one pays nothing.',
  ];
  lines.forEach((l, i) => ctx.fillText(l, 640, 290 + i * 26));
  ctx.fillStyle = '#7a3b5e';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.fillText('WIN: clear ' + TOTAL_SHIFTS + ' shifts and impress the Harbour Critic  ·  LOSE: ' + LOSE_MISSES + ' tickets walk out', 640, 412);
  if (g.best.score > 0) {
    ctx.fillStyle = '#b8860b';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText('BEST RUN: ' + fmtCoins(g.best.score) + ' earned · reached Shift ' + g.best.shift, 640, 442);
  }
  ctx.fillStyle = '#5d3a1e';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillText('CLICK TO PLAY — or press Enter', 640, 478);
  ctx.fillStyle = '#7a5a34';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('1–8 pantry · Q chop · W wok · E pot · R plate · Space chop / pull / ring · L ledger', 640, 506);
  ctx.fillText('Mouse works for everything. Sound is synthesized live — no audio files.', 640, 528);
  ctx.fillStyle = '#e8703f';
  roundRectPath(ctx, 520, 548, 240, 56, 12);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText('START SHIFT 1', 640, 584);
}

export function titleButtons() {
  return { start: { x: 520, y: 548, w: 240, h: 56 } };
}

export { dim, panel };

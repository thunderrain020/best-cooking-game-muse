// Ember & Tide — ui/titleOverlay.js
// Title screen: the game name, the promise, the WIN / LOSE rules for the
// 7 Harbour Nights, the difficulty tiers, Endless Rush once unlocked,
// the controls, and the persistent best run. Drawn over the kitchen
// backdrop.

import { fmtCoins, roundRectPath } from '../core/util.js';
import { TOTAL_SHIFTS, LOSE_MISSES, DIFFICULTIES } from '../core/state.js';

function dim(ctx) {
  ctx.fillStyle = 'rgba(8,6,12,0.92)';
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

export const DIFF_BUTTONS = [
  { id: 'calm', x: 448, y: 478, w: 120, h: 32 },
  { id: 'service', x: 584, y: 478, w: 120, h: 32 },
  { id: 'typhoon', x: 720, y: 478, w: 120, h: 32 },
];

export function drawTitle(ctx, g) {
  dim(ctx);
  panel(ctx, 240, 90, 800, 560);
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
  ctx.fillText('WIN: clear ' + TOTAL_SHIFTS + ' Harbour Nights and impress the Harbour Critic  ·  LOSE: ' + LOSE_MISSES + ' tickets walk out', 640, 412);
  if (g.best.score > 0) {
    ctx.fillStyle = '#b8860b';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText('BEST RUN: ' + fmtCoins(g.best.score) + ' earned · reached Shift ' + g.best.shift, 640, 442);
  }
  // Difficulty tiers: Calm (patient crowd), Service (the classic
  // rush), Typhoon (tight patience, fast tickets). Persisted with the
  // profile, so the choice survives a reload.
  ctx.fillStyle = '#7a3b5e';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.fillText('DIFFICULTY', 640, 470);
  for (const b of DIFF_BUTTONS) {
    const d = DIFFICULTIES[b.id];
    const sel = g.difficulty === b.id;
    ctx.fillStyle = sel ? '#2e7d32' : '#e8dcc2';
    roundRectPath(ctx, b.x, b.y, b.w, b.h, 10); ctx.fill();
    ctx.strokeStyle = sel ? '#1a120b' : '#b8a67c'; ctx.lineWidth = 2;
    roundRectPath(ctx, b.x, b.y, b.w, b.h, 10); ctx.stroke();
    ctx.fillStyle = sel ? '#fff' : '#2a1a12';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText(d.name.toUpperCase(), b.x + b.w / 2, b.y + 21);
  }
  ctx.fillStyle = '#5d3a1e';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillText('CLICK TO PLAY — or press Enter', 640, 536);
  ctx.fillStyle = '#7a5a34';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('WASD walk · Space / E interact · 1–9, 0 pantry · Q chop · F wok · T pot · R plate · L ledger', 640, 558);
  const endless = g.endlessAvailable || (g.meta && g.meta.endlessUnlocked);
  const startBtn = endless ? { x: 420, y: 576, w: 220, h: 52 } : { x: 520, y: 576, w: 240, h: 52 };
  ctx.fillStyle = '#e8703f';
  roundRectPath(ctx, startBtn.x, startBtn.y, startBtn.w, startBtn.h, 12);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText('START NIGHT 1', 640 - (endless ? 110 : 0), 610);
  if (endless) {
    ctx.fillStyle = '#7a3b9e';
    roundRectPath(ctx, 660, 576, 220, 52, 12);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText('ENDLESS RUSH', 770, 610);
  }
}

export function titleButtons(g) {
  const endless = g.endlessAvailable || (g.meta && g.meta.endlessUnlocked);
  const btns = {
    start: endless ? { x: 420, y: 576, w: 220, h: 52 } : { x: 520, y: 576, w: 240, h: 52 },
    diff: DIFF_BUTTONS,
  };
  if (endless) btns.endless = { x: 660, y: 576, w: 220, h: 52 };
  return btns;
}

export { dim, panel };

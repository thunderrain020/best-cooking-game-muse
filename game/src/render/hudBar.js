// Ember & Tide — render/hudBar.js
// The top bar: bold high-legibility essentials only — title, shift,
// coins, combo and the shift timer, plus BOOK / ? / SND. V7: SERVED
// and BEST micro-text removed from the top bar (BEST still lives in
// the Shop subtitle and the Victory card). The roadmap strip lives in
// render/roadmap.js.

import { fmtClock, fmtCoins, fmtMult, roundRectPath } from '../core/util.js';
import { TOTAL_SHIFTS, comboMult } from '../core/state.js';
import { drawHudSetBadges } from './setBadges.js';

export function topBarButtons() {
  return {
    ledger: { x: 1100, y: 8, w: 52, h: 32 },
    help: { x: 1160, y: 8, w: 52, h: 32 },
    mute: { x: 1220, y: 8, w: 52, h: 32 },
  };
}

export function drawTopBar(ctx, g) {
  ctx.fillStyle = 'rgba(24,12,8,0.72)';
  ctx.fillRect(0, 0, 1280, 46);
  ctx.fillStyle = '#ffe6a8';
  ctx.font = 'bold 22px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('EMBER & TIDE', 16, 30);
  // Essentials, left to right, all bold and roomy: shift, coins, combo.
  ctx.fillStyle = '#c9b48a';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SHIFT ' + g.shift + '/' + TOTAL_SHIFTS, 330, 30);
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText(fmtCoins(g.coins), 440, 30);
  ctx.fillStyle = g.combo > 1 ? '#ffd94d' : '#c9b48a';
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.fillText(g.combo > 1 ? 'COMBO ' + fmtMult(comboMult(g)) + ' (' + g.combo + ')' : 'COMBO —', 600, 30);
  // V8: live set-bonus badges (2+ pieces) between the combo and the
  // timer — compact, and they stop before the timer's left edge.
  drawHudSetBadges(ctx, g, 682, 12, 984);
  const low = g.shiftLeft < 30;
  ctx.fillStyle = low ? '#ff6b4a' : '#fdf6e3';
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(fmtClock(g.shiftLeft), 1060, 32);
  ctx.fillStyle = '#c9b48a';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText('SHIFT ENDS', 1060, 44);
  ctx.textAlign = 'left';
  for (const [key, label] of [['ledger', 'BOOK'], ['help', '?'], ['mute', g.muted ? 'OFF' : 'SND']]) {
    const b = topBarButtons()[key];
    ctx.fillStyle = '#5d3a1e';
    roundRectPath(ctx, b.x, b.y, b.w, b.h, 8); ctx.fill();
    ctx.fillStyle = '#ffe6a8';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, b.x + b.w / 2, b.y + 22);
  }
  ctx.textAlign = 'left';
}

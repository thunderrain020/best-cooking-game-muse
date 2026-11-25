// Ember & Tide — render/hudBar.js
// The top bar and the roadmap strip beneath it: WIN / LOSE objective pill,
// the 5-Shift Service Roadmap (Shift 1..4 + Critic Finale), active upgrade
// and relic badges, coins, best score, combo and the shift timer.

import { fmtClock, fmtCoins, fmtMult, roundRectPath } from '../core/util.js';
import { TOTAL_SHIFTS, LOSE_MISSES, shiftTarget, comboMult } from '../core/state.js';
import { ownedBadges } from '../systems/upgrades.js';
import { pill } from './palette.js';

export function topBarButtons() {
  return {
    ledger: { x: 1100, y: 12, w: 52, h: 32 },
    help: { x: 1160, y: 12, w: 52, h: 32 },
    mute: { x: 1220, y: 12, w: 52, h: 32 },
  };
}

export function drawTopBar(ctx, g) {
  ctx.fillStyle = 'rgba(24,12,8,0.72)';
  ctx.fillRect(0, 0, 1280, 56);
  ctx.fillStyle = '#ffe6a8';
  ctx.font = 'bold 22px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('EMBER & TIDE', 16, 35);
  ctx.fillStyle = '#fdf6e3';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(fmtCoins(g.coins), 392, 35);
  ctx.fillStyle = '#c9b48a';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText('SHIFT ' + g.shift + '/' + TOTAL_SHIFTS, 330, 35);
  ctx.fillText('SERVED ' + g.served, 470, 35);
  ctx.fillStyle = g.best.score > 0 ? '#ffd94d' : '#c9b48a';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.fillText('BEST ' + fmtCoins(g.best.score) + ' · SHIFT ' + g.best.shift, 580, 35);
  ctx.fillStyle = g.combo > 1 ? '#ffd94d' : '#c9b48a';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillText(g.combo > 1 ? 'COMBO ' + fmtMult(comboMult(g)) + ' (' + g.combo + ')' : 'COMBO —', 760, 35);
  const low = g.shiftLeft < 30;
  ctx.fillStyle = low ? '#ff6b4a' : '#fdf6e3';
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(fmtClock(g.shiftLeft), 1060, 38);
  ctx.fillStyle = '#c9b48a';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText('SHIFT ENDS', 1060, 52);
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

export function drawRoadmap(ctx, g, now) {
  ctx.fillStyle = 'rgba(19,17,38,0.35)';
  ctx.fillRect(0, 56, 1280, 32);
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
    roundRectPath(ctx, x, 62, w, 20, 10); ctx.fill();
    ctx.strokeStyle = '#1a120b';
    ctx.lineWidth = 1.5;
    roundRectPath(ctx, x, 62, w, 20, 10); ctx.stroke();
    ctx.fillStyle = done || cur ? '#1a120b' : '#e8dcc2';
    ctx.fillText(label, x + 10, 76);
    x += w + 6;
    if (s < TOTAL_SHIFTS) {
      ctx.fillStyle = '#c9b48a';
      ctx.fillText('›', x - 2, 76);
      x += 8;
    }
  }
  // WIN / LOSE objective pill, centred — target folded in so the right
  // side keeps clear room for the perk strip.
  const obj = 'WIN: 5 Shifts + Critic  ·  LOSE: ' + LOSE_MISSES + ' Missed  ·  TARGET ' + g.shiftServed + '/' + shiftTarget(g.shift);
  ctx.font = 'bold 12px system-ui, sans-serif';
  const ow = ctx.measureText(obj).width + 28;
  pill(ctx, 640 - ow / 2, 61, ow, 22, 'rgba(24,12,8,0.88)', '#d4a017');
  ctx.fillStyle = '#ffe6a8';
  ctx.textAlign = 'center';
  ctx.fillText(obj, 640, 76);
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
  roundRectPath(ctx, bx - 4, 60, stripW + 8, 24, 8);
  ctx.stroke();
  ctx.fillStyle = '#c9b48a';
  ctx.font = 'bold 10px system-ui, sans-serif';
  ctx.fillText('PERKS', bx + 2, 76);
  bx += 46;
  for (const b of shown) {
    const w = labelW(b);
    ctx.fillStyle = b.kind === 'relic' ? '#7a3b9e' : '#2e7d32';
    roundRectPath(ctx, bx, 62, w, 20, 6); ctx.fill();
    ctx.strokeStyle = '#1a120b';
    ctx.lineWidth = 1.5;
    roundRectPath(ctx, bx, 62, w, 20, 6); ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(b.short, bx + w / 2, 76);
    ctx.textAlign = 'left';
    bx += w + 4;
  }
  if (overflow > 0) {
    ctx.fillStyle = 'rgba(255,246,227,0.25)';
    roundRectPath(ctx, bx, 62, 40, 20, 6); ctx.fill();
    ctx.fillStyle = '#fff6e5';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('+' + overflow, bx + 20, 76);
    ctx.textAlign = 'left';
  }
  ctx.textAlign = 'left';
}

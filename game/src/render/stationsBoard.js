// Ember & Tide — render/stationsBoard.js
// The two chop boards on the left wall: butcher blocks with a steel knife,
// chop-progress pips and the slash arc. Both boards share one logical
// board (g.board); the item is drawn on the board the chef last used
// (g.board.slot), the other rests idle.

import { drawIngredientIcon } from './foodArt.js';
import { roundRectPath } from '../core/util.js';
import { stationTag } from './palette.js';
import { drawSlash, contactShadow } from './feel.js';
import { drawChopAction } from './actionFx.js';
import { BOARD_RECTS } from './layout.js';

function drawKnife(ctx, x, y, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = '#dfe6ec';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(34, -6); ctx.lineTo(34, 6); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(34, -6); ctx.lineTo(34, 6); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = '#5a3a1e'; ctx.fillRect(-13, -4, 15, 8);
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1; ctx.strokeRect(-13, -4, 15, 8);
  ctx.restore();
}

function drawCleaver(ctx, x, y, rot) {
  // Heavy rectangular cleaver — a different silhouette from the
  // slim chef's knife on board 1, so the two boards never read as twins.
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = '#dfe6ec';
  ctx.fillRect(-2, -8, 34, 16);
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
  ctx.strokeRect(-2, -8, 34, 16);
  ctx.fillStyle = '#5a3a1e'; ctx.fillRect(-16, -5, 15, 10);
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1; ctx.strokeRect(-16, -5, 15, 10);
  ctx.restore();
}

export function drawBoardStation(ctx, g, now, slot) {
  const r = BOARD_RECTS[slot];
  const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
  stationTag(ctx, cx, r.y, slot === 0 ? 'CHOP' : 'CHOP 2', 'Q');
  contactShadow(ctx, cx, r.y + r.h - 6, 82, 8);
  const b = g.board;
  if (slot === 1) {
    // V8: board 2 is a round bamboo board, not a clone of board 1 —
    // pale bamboo, radial slats, a heavy cleaver. Same chop rules.
    ctx.fillStyle = '#d9b06a';
    ctx.beginPath(); ctx.arc(cx - 6, cy + 2, 48, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(cx - 6, cy + 2, 48, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(120,70,20,0.4)'; ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy + 2);
      ctx.lineTo(cx - 6 + Math.cos(a) * 44, cy + 2 + Math.sin(a) * 44);
      ctx.stroke();
    }
    ctx.fillStyle = '#231b18';
    ctx.beginPath(); ctx.ellipse(r.x + r.w - 22, r.y + 56, 8, 12, 0, 0, Math.PI * 2); ctx.fill();
    if (b.item && b.slot === slot) {
      drawIngredientIcon(ctx, b.item, cx - 12, cy + 2, 28);
      for (let i = 0; i < b.chopsNeeded; i++) {
        ctx.fillStyle = i < b.chops ? '#4caf6d' : '#e8dcc2';
        ctx.beginPath();
        ctx.arc(cx - (b.chopsNeeded - 1) * 11 + i * 22, r.y + r.h - 8, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      drawCleaver(ctx, cx + 52, cy - 4, -0.5 - b.anim * 0.9);
      drawSlash(ctx, cx - 12, cy + 2, b.anim, now);
      // V10: slash + confetti while a chop is in progress — keyed off
      // mid-chop state, not the anim (the settle ages anim to zero).
      if (b.chops < b.chopsNeeded) drawChopAction(ctx, cx - 12, cy + 2, now);
    } else {
      drawCleaver(ctx, cx + 40, cy + 2, -0.4);
      ctx.fillStyle = 'rgba(255,246,227,0.5)';
      ctx.beginPath(); ctx.ellipse(cx - 12, cy + 2, 24, 7, 0, 0, Math.PI * 2); ctx.fill();
    }
    return;
  }
  ctx.fillStyle = '#c89a5e';
  roundRectPath(ctx, r.x + 8, r.y + 14, r.w - 16, r.h - 28, 8); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2.5;
  roundRectPath(ctx, r.x + 8, r.y + 14, r.w - 16, r.h - 28, 8); ctx.stroke();
  ctx.fillStyle = 'rgba(120,70,20,0.35)';
  ctx.fillRect(r.x + 16, r.y + 40, r.w - 32, 2);
  ctx.fillRect(r.x + 16, r.y + 66, r.w - 32, 2);
  ctx.fillStyle = '#231b18';
  ctx.beginPath(); ctx.ellipse(r.x + r.w - 22, r.y + 56, 8, 12, 0, 0, Math.PI * 2); ctx.fill();
  if (b.item && b.slot === slot) {
    drawIngredientIcon(ctx, b.item, cx - 12, cy + 2, 28);
    for (let i = 0; i < b.chopsNeeded; i++) {
      ctx.fillStyle = i < b.chops ? '#4caf6d' : '#e8dcc2';
      ctx.beginPath();
      ctx.arc(cx - (b.chopsNeeded - 1) * 11 + i * 22, r.y + r.h - 8, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    drawKnife(ctx, cx + 52, cy - 4, -0.5 - b.anim * 0.9);
    drawSlash(ctx, cx - 12, cy + 2, b.anim, now);
    // V10: slash + confetti while a chop is in progress — keyed off
    // mid-chop state, not the anim (the settle ages anim to zero).
    if (b.chops < b.chopsNeeded) drawChopAction(ctx, cx - 12, cy + 2, now);
  } else {
    drawKnife(ctx, cx + 40, cy + 2, -0.4);
    ctx.fillStyle = 'rgba(255,246,227,0.5)';
    ctx.beginPath(); ctx.ellipse(cx - 12, cy + 2, 24, 7, 0, 0, Math.PI * 2); ctx.fill();
  }
}

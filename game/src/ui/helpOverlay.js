// Ember & Tide — ui/helpOverlay.js
// How to cook, in six steps, plus the win / lose conditions.

import { roundRectPath } from '../core/util.js';
import { TOTAL_SHIFTS, LOSE_MISSES } from '../core/state.js';
import { dim, panel } from './titleOverlay.js';

export function drawHelp(ctx, g) {
  dim(ctx);
  panel(ctx, 300, 110, 680, 500);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#2a1a12';
  ctx.font = 'bold 30px Georgia, serif';
  ctx.fillText('HOW TO COOK', 640, 168);
  ctx.fillStyle = '#3a2a1a';
  ctx.font = '16px system-ui, sans-serif';
  const lines = [
    'Walk with WASD or the arrow keys. Click a crate or station and',
    'the chef strolls over and does it. Space / E uses the nearest station.',
    '1. Click a pantry crate (or press 1–8) to take an ingredient.',
    '2. Chilli, lime, herbs → CHOP BOARD — Q to chop.',
    '3. Prawn, fish, egg, scallop → WOK (F) or CHARCOAL GRILL (G) — pull in the green PERFECT window.',
    '4. Rice, noodles → SIMMER POT — it finishes itself.',
    '5. Click the tray, then the PLATING ISLAND, to stack a dish.',
    '6. Ring the PASS BELL to serve the matching ticket.',
    '',
    'Follow the golden route line: chef → next station → island → bell.',
    'Serve fast for tips; chain serves for combos; spend coins',
    'on upgrades and relics between shifts.',
    'WIN: clear ' + TOTAL_SHIFTS + ' shifts and serve the Harbour Critic.',
    'LOSE: ' + LOSE_MISSES + ' tickets walk out, or the finale target is missed.',
  ];
  lines.forEach((l, i) => ctx.fillText(l, 640, 206 + i * 24));
  ctx.fillStyle = '#5d3a1e';
  roundRectPath(ctx, 540, 540, 200, 44, 10);
  ctx.fill();
  ctx.fillStyle = '#ffe6a8';
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.fillText('CLOSE', 640, 568);
}

export function helpButtons() {
  return { close: { x: 540, y: 540, w: 200, h: 44 } };
}

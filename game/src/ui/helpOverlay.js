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
    '1. Click a pantry crate (or press 1–8) to take an ingredient.',
    '2. Chilli, lime and herbs go to the CHOP BOARD — click to chop.',
    '3. Prawn, fish and egg go to the WOK — pull them out in the green',
    '    PERFECT window. Leave them and they burn.',
    '4. Rice and noodles go in the SIMMER POT — it finishes itself.',
    '5. Click the tray, then the PLATING COUNTER, to stack a dish.',
    '6. Ring the PASS BELL to serve the matching ticket.',
    '',
    'Tickets lose patience. Serve fast for tips, chain serves for',
    'combos, and spend coins on upgrades and relics between shifts.',
    '',
    'WIN: clear ' + TOTAL_SHIFTS + ' shifts and serve the Harbour Critic.',
    'LOSE: ' + LOSE_MISSES + ' tickets walk out, or the finale target is missed.',
  ];
  lines.forEach((l, i) => ctx.fillText(l, 640, 210 + i * 26));
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

// Ember & Tide — ui/titleArt.js
// The Harbour Rooftop Title Hub chrome: the 7-tile feature strip,
// save-slot cards, and the menu buttons (keycap + centred label).
// The backdrop and hero dish live in ui/titleBackdrop.js. Split out of
// ui/titleOverlay.js so every file stays under the 6 KB module cap.
// All pill/button text is drawn with textBaseline 'middle' at the exact
// vertical + horizontal centre.

import { roundRectPath } from '../core/util.js';
import { DIFFICULTIES } from '../core/state.js';
import { fmtElapsed } from '../core/saves.js';

// Shared layout: the left menu column and the right save-slot panel.
export const MENU = { x: 48, w: 320, y0: 168, h: 46, gap: 10 };
export const SLOTS = { x: 880, y: 150, w: 352, h: 396 };
export const FEATURES = [
  ['7', 'NIGHTS'], ['18', 'DISHES'], ['10', 'CRATES'], ['7', 'STATIONS'],
  ['16', 'PERKS'], ['16', 'FEATS'], ['3', 'SETS'],
];

export function centreText(ctx, text, cx, cy, font, color) {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, cx, cy);
}

function pill(ctx, x, y, w, h, fill, stroke, r) {
  ctx.fillStyle = fill;
  roundRectPath(ctx, x, y, w, h, r); ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke; ctx.lineWidth = 1.5;
    roundRectPath(ctx, x, y, w, h, r); ctx.stroke();
  }
}

// Label centre for a button with a keycap block of width keyW on its
// left: the label sits dead-centre in the remaining pill area.
export function menuLabelCx(x, w, keyW) {
  return x + keyW + (w - keyW) / 2;
}

export function menuButton(ctx, r, keycap, label, opts = {}) {
  const fill = opts.disabled ? '#241a30' : (opts.accent ? '#e8703f' : '#2a1e4e');
  const stroke = opts.disabled ? 'rgba(212,160,23,0.35)' : '#d4a017';
  pill(ctx, r.x, r.y, r.w, r.h, fill, stroke, 12);
  // Gold keycap square, letter dead-centre.
  pill(ctx, r.x + 10, r.y + r.h / 2 - 13, 26, 26, '#d4a017', '#1a120b', 6);
  centreText(ctx, keycap, r.x + 23, r.y + r.h / 2, 'bold 15px system-ui, sans-serif', '#1a120b');
  // The label centres in the free area: keycap to right edge, or to
  // the lock badge when one is drawn, so it never reads right-shifted.
  const labelCx = opts.lock ? menuLabelCx(r.x, r.w - 40, 46) : menuLabelCx(r.x, r.w, 46);
  centreText(ctx, label, labelCx, r.y + r.h / 2,
    'bold 16px system-ui, sans-serif', opts.disabled ? '#8a7a5c' : '#ffe6a8');
  // V12: lock badge at the button's right end — a crisp padlock when
  // locked, a gold open padlock once unlocked. The label stays centred
  // in the keycap-to-right-edge area, clear of the badge.
  if (opts.lock) {
    const bx = r.x + r.w - 34, by = r.y + r.h / 2 - 9;
    const locked = opts.lock === 'locked';
    ctx.fillStyle = locked ? '#8a7a5c' : '#ffd94d';
    roundRectPath(ctx, bx, by + 7, 18, 13, 3); ctx.fill();
    ctx.strokeStyle = locked ? '#8a7a5c' : '#ffd94d'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (locked) ctx.arc(bx + 9, by + 8, 6, Math.PI, 0);
    else ctx.arc(bx + 9, by + 8, 6, Math.PI, -0.4);
    ctx.stroke();
  }
}

export function diffPill(ctx, r, id, selected) {
  const d = DIFFICULTIES[id];
  pill(ctx, r.x, r.y, r.w, r.h, selected ? '#2e7d32' : '#e8dcc2', selected ? '#1a120b' : '#b8a67c', 10);
  centreText(ctx, d.name.toUpperCase(), r.x + r.w / 2, r.y + r.h / 2,
    'bold 14px system-ui, sans-serif', selected ? '#fff' : '#2a1a12');
}

export function drawFeatureStrip(ctx) {
  const y = 606, h = 56, x0 = 48, w = 1184, n = FEATURES.length;
  const tw = (w - (n - 1) * 7) / n;
  for (let i = 0; i < n; i++) {
    const x = x0 + i * (tw + 7);
    pill(ctx, x, y, tw, h, 'rgba(24,12,8,0.78)', '#d4a017', 10);
    centreText(ctx, FEATURES[i][0], x + tw / 2, y + 20, 'bold 20px system-ui, sans-serif', '#ffd94d');
    centreText(ctx, FEATURES[i][1], x + tw / 2, y + 42, 'bold 11px system-ui, sans-serif', '#c9b48a');
  }
}

const DIFF_FILL = { calm: '#2e7d32', service: '#d4a017', typhoon: '#b03a2e' };
export function drawSlotCard(ctx, slot, r, idx, now) {
  if (!slot) {
    ctx.setLineDash([6, 5]);
    pill(ctx, r.x, r.y, r.w, r.h, 'rgba(24,12,8,0.45)', 'rgba(212,160,23,0.5)', 10);
    ctx.setLineDash([]);
    centreText(ctx, 'EMPTY SLOT', r.x + r.w / 2, r.y + r.h / 2 - 10, 'bold 14px system-ui, sans-serif', '#c9b48a');
    centreText(ctx, 'Start a run to fill it', r.x + r.w / 2, r.y + r.h / 2 + 12, '12px system-ui, sans-serif', '#8a7a5c');
    return { del: null };
  }
  pill(ctx, r.x, r.y, r.w, r.h, '#241a3a', '#d4a017', 10);
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText('SLOT ' + (idx + 1), r.x + 14, r.y + 20);
  // Difficulty badge + delete button, top-right.
  const d = DIFFICULTIES[slot.difficulty] || DIFFICULTIES.service;
  pill(ctx, r.x + r.w - 126, r.y + 9, 86, 22, DIFF_FILL[slot.difficulty] || '#d4a017', null, 11);
  centreText(ctx, d.name.toUpperCase(), r.x + r.w - 83, r.y + 21, 'bold 11px system-ui, sans-serif', '#fff');
  const del = { x: r.x + r.w - 30, y: r.y + 9, w: 20, h: 22 };
  pill(ctx, del.x, del.y, del.w, del.h, 'rgba(255,107,74,0.25)', 'rgba(255,107,74,0.7)', 6);
  centreText(ctx, '✕', del.x + 10, del.y + 12, 'bold 12px system-ui, sans-serif', '#ff8a6b');
  // Shift progress bar.
  centreText(ctx, 'SHIFT ' + slot.shift + '/7', r.x + 52, r.y + 50, 'bold 12px system-ui, sans-serif', '#fdf6e3');
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  roundRectPath(ctx, r.x + 104, r.y + 44, 190, 12, 6); ctx.fill();
  ctx.fillStyle = '#2e7d32';
  roundRectPath(ctx, r.x + 104, r.y + 44, 190 * Math.min(1, slot.shift / 7), 12, 6); ctx.fill();
  // Coins + elapsed time.
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('$' + slot.coins, r.x + 14, r.y + 84);
  ctx.fillStyle = '#c9b48a';
  ctx.font = '12px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('⏱ ' + fmtElapsed(slot.elapsed), r.x + r.w - 14, r.y + 84);
  ctx.textAlign = 'left';
  return { del };
}

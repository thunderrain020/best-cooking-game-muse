// Ember & Tide — ui/titleOverlay.js
// The Harbour Rooftop Title Hub: a dark-indigo & gold production hub
// with a menu column (keycap buttons + difficulty pills), the hero dish
// and chef mascot, 3 interactive localStorage save slots, and a 7-tile
// feature strip. Art lives in ui/titleArt.js / ui/titleBackdrop.js;
// clicks and keys live in ui/titleMenu.js. Menu buttons and save slots
// really work in live play; demo slots only ever exist in staged
// screenshot states, never in live storage.

import { fmtCoins, roundRectPath } from '../core/util.js';
import { TOTAL_SHIFTS, LOSE_MISSES } from '../core/state.js';
import { featCount } from '../data/feats.js';
import { centreText, menuButton, diffPill, drawFeatureStrip, drawSlotCard, MENU, SLOTS } from './titleArt.js';
import { drawTitleBackdrop, drawHero, drawFeatsPanel, FEATS_CLOSE } from './titleBackdrop.js';

export function titleButtons(g) {
  const slots = g.saveSlots || [null, null, null];
  const hasSave = slots.some(Boolean);
  const endless = g.endlessAvailable || (g.meta && g.meta.endlessUnlocked);
  const items = [];
  let y = MENU.y0;
  const push = (id, key, label, opts) => {
    items.push({ id, key, label, opts, rect: { x: MENU.x, y, w: MENU.w, h: MENU.h } });
    y += MENU.h + MENU.gap;
  };
  if (hasSave) push('continue', '⏎', 'CONTINUE', { accent: true });
  push('new', 'N', 'NEW RUN', { accent: !hasSave });
  push('endless', 'E', 'ENDLESS RUSH', { disabled: !endless, lock: endless ? 'unlocked' : 'locked' });
  push('ledger', 'L', 'RECIPE LEDGER (18)', {});
  push('feats', 'F', 'FEATS (' + featCount(g) + '/16)', {});
  push('help', 'H', 'HOW TO PLAY', {});
  const diffLabelY = y + 12;
  const diffY = diffLabelY + 14;
  const diff = ['calm', 'service', 'typhoon'].map((id, i) => ({ id, x: MENU.x + i * 110, y: diffY, w: 100, h: 34 }));
  const filled = slots.filter(Boolean).length;
  const slotRects = [0, 1, 2].map((i) => ({ x: SLOTS.x + 14, y: 192 + i * 116, w: SLOTS.w - 28, h: 104 }));
  const slotDel = slotRects.map((r) => ({ x: r.x + r.w - 30, y: r.y + 9, w: 20, h: 22 }));
  return { menu: items, diff, diffLabelY, slotRects, slotDel, filled, endless, hasSave, featsClose: FEATS_CLOSE };
}

export function drawTitle(ctx, g, now) {
  const t = now || 0;
  drawTitleBackdrop(ctx, t);
  centreText(ctx, 'EMBER & TIDE', 640, 78, 'bold 54px Georgia, serif', '#ffd94d');
  centreText(ctx, 'a rooftop harbour kitchen at sunset', 640, 112, 'italic 20px Georgia, serif', '#ffe6a8');
  const b = titleButtons(g);
  // V12: the run's real seed, top-right of the hub — clear of the
  // setting sun above and the lighthouse below.
  if (g.seed != null) {
    ctx.fillStyle = 'rgba(24,12,8,0.78)';
    roundRectPath(ctx, 1090, 116, 140, 24, 12); ctx.fill();
    ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 1.5;
    roundRectPath(ctx, 1090, 116, 140, 24, 12); ctx.stroke();
    centreText(ctx, 'SEED #' + g.seed, 1160, 128, 'bold 12px system-ui, sans-serif', '#ffd94d');
  }
  for (const m of b.menu) menuButton(ctx, m.rect, m.key, m.label, m.opts);
  centreText(ctx, 'DIFFICULTY', MENU.x + MENU.w / 2, b.diffLabelY, 'bold 13px system-ui, sans-serif', '#ffe6a8');
  for (const d of b.diff) diffPill(ctx, d, d.id, g.difficulty === d.id);
  // Hero: chef mascot + steaming Tide & Ember Special, centre column.
  drawHero(ctx, t);
  centreText(ctx, "TONIGHT'S SPECIAL", 628, 430, 'bold 13px system-ui, sans-serif', '#ffd94d');
  centreText(ctx, 'Tide & Ember Special · $22', 628, 454, '15px system-ui, sans-serif', '#fdf6e3');
  centreText(ctx, 'WIN: clear 7 nights & impress the Critic · LOSE: 3 tickets walk out', 628, 488, '12px system-ui, sans-serif', '#c9b48a');
  if (g.best.score > 0) {
    centreText(ctx, 'BEST RUN: ' + fmtCoins(g.best.score) + ' earned · reached Shift ' + g.best.shift, 628, 514, 'bold 14px system-ui, sans-serif', '#ffd94d');
  }
  // Saved runs panel, right.
  ctx.fillStyle = 'rgba(24,12,8,0.72)';
  roundRectPath(ctx, SLOTS.x, SLOTS.y, SLOTS.w, SLOTS.h, 16); ctx.fill();
  ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 2;
  roundRectPath(ctx, SLOTS.x, SLOTS.y, SLOTS.w, SLOTS.h, 16); ctx.stroke();
  centreText(ctx, 'SAVED RUNS (' + b.filled + '/3)', SLOTS.x + SLOTS.w / 2, 178, 'bold 16px system-ui, sans-serif', '#ffd94d');
  const slots = g.saveSlots || [null, null, null];
  for (let i = 0; i < 3; i++) drawSlotCard(ctx, slots[i], b.slotRects[i], i, t);
  drawFeatureStrip(ctx);
  // Single-line control hint bar, like the gameplay footer.
  ctx.fillStyle = 'rgba(24,12,8,0.85)';
  ctx.fillRect(0, 676, 1280, 44);
  centreText(ctx, 'WASD walk · Space / E interact · 1–9, 0 pantry · Q chop · F wok · G grill · T pot · R plate · L ledger', 640, 698, '13px system-ui, sans-serif', '#fdf6e3');
  if (g.featsOpen) drawFeatsPanel(ctx, g);
}

export function dim(ctx) {
  ctx.fillStyle = 'rgba(8,6,12,0.92)';
  ctx.fillRect(0, 0, 1280, 720);
}

// Cream panel with a soft shadow, shared by the ledger/help overlays.
export function panel(ctx, x, y, w, h) {
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

export { TOTAL_SHIFTS, LOSE_MISSES };

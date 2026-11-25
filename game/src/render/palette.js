// Ember & Tide — render/palette.js
// One palette and the shared pill / outlined-text helpers, so every badge,
// toast and callout in the game uses the same high-contrast look.

import { roundRectPath } from '../core/util.js';

export const C = {
  ink: '#1a120b',
  cream: '#fdf6e3',
  paper: '#fff8e6',
  crate: '#f7eedc',
  gold: '#d4a017',
  goldLight: '#ffd94d',
  sunset: '#ff8c42',
  plum: '#7a3b5e',
  slate: '#23232c',
  slateDeck: '#1e1b26',
  counter: '#231b18',
  counterDark: '#17100d',
  brass: '#c9a24a',
  wood: '#8a5a33',
  woodDark: '#5d3a1e',
  walnut: '#2b221e',
  marble: '#f4efe4',
  red: '#e8442e',
  redHot: '#ff5a2e',
  green: '#4caf6d',
  teal: '#3f7d92',
  skyTop: '#131126',
  skyMid: '#2c1d42',
};

// Dark pill with light text: the one badge style for labels, toasts, alarms.
export function pill(ctx, x, y, w, h, fill, stroke) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;
  roundRectPath(ctx, x, y, w, h, h / 2);
  ctx.fill();
  ctx.restore();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    roundRectPath(ctx, x, y, w, h, h / 2);
    ctx.stroke();
  }
}

export function pillText(ctx, text, cx, y, font, fill, bg) {
  ctx.save();
  ctx.font = font;
  const w = ctx.measureText(text).width + 28;
  pill(ctx, cx - w / 2, y, w, 26, bg || 'rgba(24,12,8,0.88)', '#d4a017');
  ctx.fillStyle = fill || '#ffe6a8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, cx, y + 13);
  ctx.restore();
  return w;
}

// Bold text with a dark outline so it stays crisp over busy art.
export function outlineText(ctx, text, x, y, font, fill, outline) {
  ctx.save();
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 4;
  ctx.strokeStyle = outline || 'rgba(24,12,8,0.9)';
  ctx.lineJoin = 'round';
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
  ctx.restore();
}

export function stationLabel(ctx, x, y, w, label, key) {  // Crisp #fff6e5 bold text on its own dark pill: >= 7:1 contrast, and
  // the pill keeps the header clear of the station art below it.
  ctx.save();
  ctx.font = 'bold 15px Georgia, serif';
  const lw = ctx.measureText(label).width + 24;
  const lx = x + (w - lw) / 2;
  ctx.fillStyle = 'rgba(18,10,6,0.88)';
  roundRectPath(ctx, lx, y + 2, lw, 26, 13);
  ctx.fill();
  ctx.strokeStyle = '#d4a017';
  ctx.lineWidth = 1.5;
  roundRectPath(ctx, lx, y + 2, lw, 26, 13);
  ctx.stroke();
  ctx.fillStyle = '#fff6e5';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + w / 2, y + 15);
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.fillText(key, x + w / 2, y + 44);
  ctx.restore();
}

// V2 top-down station tag: one compact pill with the keycap badge
// fused into it — the key ([Q], [F], [T], [R], [SPC], [G]) sits in a
// gold square at the pill's left edge, so there is no second line of
// hint text under the pill and the floor around every station stays
// clean. `keycap` may be null (trash, garnish) for a bare label pill.
// `y` is the top of the equipment rect.
export function stationTag(ctx, cx, y, label, keycap) {
  ctx.save();
  ctx.font = 'bold 10px system-ui, sans-serif';
  const kw = keycap ? Math.max(20, ctx.measureText(keycap).width + 10) : 0;
  ctx.font = 'bold 14px Georgia, serif';
  const lw = ctx.measureText(label).width;
  // V10: balanced padding — the label sits dead-centre in the dark pill
  // area between the gold keycap and the right pill border (12px each
  // side), instead of drifting right as the old math did.
  const pad = 12;
  const w = (keycap ? 3 + kw : 0) + pad + lw + pad;
  const x0 = cx - w / 2;
  const innerLeft = keycap ? (x0 + 3 + kw) : x0;
  const labelCx = innerLeft + (w - (innerLeft - x0)) / 2;
  ctx.fillStyle = 'rgba(18,10,6,0.88)';
  roundRectPath(ctx, x0, y - 30, w, 24, 12);
  ctx.fill();
  ctx.strokeStyle = '#d4a017';
  ctx.lineWidth = 1.5;
  roundRectPath(ctx, x0, y - 30, w, 24, 12);
  ctx.stroke();
  if (keycap) {
    ctx.fillStyle = '#ffd94d';
    roundRectPath(ctx, x0 + 3, y - 27, kw, 18, 4);
    ctx.fill();
    ctx.fillStyle = '#1a120b';
    ctx.font = 'bold 10px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(keycap, x0 + 3 + kw / 2, y - 18);
  }
  ctx.fillStyle = '#fff6e5';
  ctx.font = 'bold 14px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, labelCx, y - 18);
  ctx.restore();
}

// Dark-indigo panel with a warm-gold frame and glowing lantern dots along
// the top edge: the shared overlay panel for the shop and victory card.
export function darkPanel(ctx, x, y, w, h) {
  ctx.fillStyle = '#1e1b3a';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 6;
  roundRectPath(ctx, x, y, w, h, 16);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = '#d4a017';
  ctx.lineWidth = 3;
  roundRectPath(ctx, x, y, w, h, 16);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(212,160,23,0.35)';
  ctx.lineWidth = 1;
  roundRectPath(ctx, x + 7, y + 7, w - 14, h - 14, 12);
  ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const lx = x + 60 + i * ((w - 120) / 11);
    ctx.fillStyle = 'rgba(255,180,80,0.25)';
    ctx.beginPath(); ctx.arc(lx, y + 14, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffcd6e';
    ctx.beginPath(); ctx.arc(lx, y + 14, 3.5, 0, Math.PI * 2); ctx.fill();
  }
}

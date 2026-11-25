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

// A station deck: solid fill plus a 2.5px dark ink outline so the station
// pops off the counter instead of melting into it.
export function stationDeck(ctx, r, fill) {
  ctx.fillStyle = fill;
  roundRectPath(ctx, r.x, r.y + 56, r.w, 118, 10);
  ctx.fill();
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 2.5;
  roundRectPath(ctx, r.x, r.y + 56, r.w, 118, 10);
  ctx.stroke();
}

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
  ctx.fillText(text, cx, y + 14);
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

export function stationLabel(ctx, x, y, w, label, key) {
  // Crisp #fff6e5 bold text on its own dark pill: >= 7:1 contrast, and
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
  ctx.fillText(label, x + w / 2, y + 20);
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.fillText(key, x + w / 2, y + 44);
  ctx.restore();
}

// Ember & Tide — render/palette.js
// One palette and the shared pill / outlined-text helpers, so every badge,
// toast and callout in the game uses the same high-contrast look.

import { roundRectPath } from '../core/util.js';

export const C = {
  ink: '#241608',
  cream: '#fdf6e3',
  paper: '#fff8e6',
  gold: '#d4a017',
  goldLight: '#ffd94d',
  sunset: '#e8703f',
  plum: '#7a3b5e',
  slate: '#23232c',
  slateDeck: '#2e2a33',
  wood: '#8a5a33',
  woodDark: '#5d3a1e',
  marble: '#f4efe4',
  red: '#e8442e',
  redHot: '#ff5a2e',
  green: '#4caf6d',
  teal: '#3f7d92',
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
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff6e3';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.fillText(label, x + w / 2, y + 20);
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.fillText(key, x + w / 2, y + 36);
  ctx.restore();
}

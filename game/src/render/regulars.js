// Ember & Tide — render/regulars.js
// The named harbour regulars: Capt. Budi, Chef Mei and Critic Lin,
// with short reactive quotes. Kept apart from render/diners.js so both
// files stay under the 6 KB module cap.

import { roundRectPath } from '../core/util.js';

// Small dark pill with gold 9px text under a diner.
export function drawNameTag(ctx, x, y, name) {
  ctx.save();
  ctx.font = 'bold 9px system-ui, sans-serif';
  const w = ctx.measureText(name).width + 12;
  ctx.fillStyle = 'rgba(18,10,6,0.85)';
  roundRectPath(ctx, x - w / 2, y, w, 13, 6); ctx.fill();
  ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 1;
  roundRectPath(ctx, x - w / 2, y, w, 13, 6); ctx.stroke();
  ctx.fillStyle = '#ffd94d';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, x, y + 7);
  ctx.restore();
}

// Reactive quote: tiny italic gold text under a name tag.
export function drawQuote(ctx, x, y, text) {
  ctx.save();
  ctx.fillStyle = '#ffe6a8';
  ctx.font = 'italic 10px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
  ctx.restore();
}

// Names, quotes and the critic's name pill, drawn over the terrace
// tables. Table 1: Capt. Budi (straw hat) and Chef Mei (bun). The
// critic's table: Critic Lin, whose quote reacts to the critic ticket.
export function drawRegulars(ctx, g) {
  const urgent = g.tickets.some((t) => t.left / t.total < 0.3);
  drawNameTag(ctx, 1086, 492, 'Capt. Budi');
  drawNameTag(ctx, 1154, 492, 'Chef Mei');
  drawQuote(ctx, 1086, 516, g.tickets.length ? '“Crisp sear!”' : '“So good!”');
  drawQuote(ctx, 1154, 516, urgent ? '“So fast!”' : '“Lovely!”');
  // Critic Lin's name pill over the purple CRITIC tag, and his quote
  // to the left of his seat, over the open sky — clear of the wall,
  // the lighthouse and the skyline sheds.
  ctx.save();
  ctx.fillStyle = '#7a3b9e';
  roundRectPath(ctx, 1110, 158, 100, 15, 7); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 9px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Critic Lin ★★★', 1160, 169);
  ctx.restore();
  const served = g.critic && g.critic.served;
  const live = g.tickets.some((t) => t.critic);
  drawQuote(ctx, 1100, 238, served ? '“Five stars!”' : live ? '“Impress me.”' : '“Crisp sear!”');
}

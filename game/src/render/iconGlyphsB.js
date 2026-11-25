// Ember & Tide — render/iconGlyphsB.js
// The V5 glyphs (Batch Prep, Twin Chop, Crisp Mastery, Lantern Chain),
// drawn in a -20..20 box like iconGlyphs.js. Kept in its own file so
// both glyph files stay under the 6 KB module cap.

import { roundRectPath } from '../core/util.js';

// Returns true when it drew the glyph, false for an unknown id.
export function glyphExtra(ctx, id) {
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (id === 'batch') {
    // Two stacked plates: the batch tray.
    ctx.fillStyle = '#fdf6e3';
    ctx.beginPath(); ctx.ellipse(0, 8, 15, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, -8, 15, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ff8a5c';
    ctx.beginPath(); ctx.arc(-5, -10, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#a8d94a';
    ctx.beginPath(); ctx.arc(5, -10, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd94d';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('×2', 0, 8);
    return true;
  }
  if (id === 'twin') {
    // Two crossed knives, side by side.
    for (const [dx, a] of [[-7, 0.45], [7, -0.45]]) {
      ctx.save(); ctx.translate(dx, 0); ctx.rotate(a);
      ctx.fillStyle = '#e8e8ec';
      ctx.beginPath(); ctx.moveTo(-2.5, -18); ctx.lineTo(2.5, -18); ctx.lineTo(0, -6); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = '#8a5a33'; ctx.fillRect(-2.5, -6, 5, 12);
      ctx.restore();
    }
    return true;
  }
  if (id === 'crisp') {
    // A flame with a crisp checkmark: mastery of the sear.
    ctx.fillStyle = '#ff7a2e';
    ctx.beginPath(); ctx.moveTo(0, 14);
    ctx.quadraticCurveTo(-12, 2, -5, -7);
    ctx.quadraticCurveTo(-1, -12, 0, -16);
    ctx.quadraticCurveTo(4, -9, 8, -3);
    ctx.quadraticCurveTo(12, 4, 0, 14);
    ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-6, 2); ctx.lineTo(-1, 7); ctx.lineTo(7, -3); ctx.stroke();
    return true;
  }
  if (id === 'chain') {
    // Three linked lanterns: the chain that keeps the light going.
    for (const [x, y] of [[-12, 4], [0, -6], [12, 4]]) {
      ctx.fillStyle = '#ffb347'; roundRectPath(ctx, x - 6, y - 8, 12, 16, 4); ctx.fill();
      ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = '#fff3c4';
      ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-12, -4); ctx.lineTo(0, -12); ctx.lineTo(12, -4); ctx.stroke();
    return true;
  }
  return false;
}

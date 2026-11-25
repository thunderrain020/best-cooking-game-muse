// Ember & Tide — render/iconGlyphs.js
// One illustrated glyph per upgrade / relic id, drawn in a -20..20 box
// (the caller scales u = r / 24). Kept apart from iconBadges.js so both
// files stay under the 6 KB module cap.

import { roundRectPath } from '../core/util.js';
import { glyphExtra } from './iconGlyphsB.js';

export function starPath(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

export function glyph(ctx, id) {
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (id === 'knives') {
    for (const a of [0.7, -0.7]) {
      ctx.save(); ctx.rotate(a);
      ctx.fillStyle = '#e8e8ec';
      ctx.beginPath(); ctx.moveTo(-2.5, -18); ctx.lineTo(2.5, -18); ctx.lineTo(0, -6); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = '#8a5a33'; ctx.fillRect(-2.5, -6, 5, 12);
      ctx.restore();
    }
    return;
  }
  if (id === 'wok') {
    ctx.fillStyle = '#c96a3a';
    ctx.beginPath(); ctx.arc(0, 2, 13, 0, Math.PI); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.strokeStyle = '#5d3a1e'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(13, 2); ctx.lineTo(21, -3); ctx.stroke();
    return;
  }
  if (id === 'pass') {
    ctx.fillStyle = '#8a5a33'; roundRectPath(ctx, -18, 2, 36, 9, 3); ctx.fill();
    ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath(); ctx.arc(0, -4, 7, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.stroke();
    ctx.fillRect(-9, -5, 18, 3);
    return;
  }
  if (id === 'calm') {
    ctx.strokeStyle = '#7fd4e8'; ctx.lineWidth = 2.5;
    for (const y of [-9, 0, 9]) {
      ctx.beginPath(); ctx.moveTo(-16, y);
      ctx.quadraticCurveTo(-8, y - 5, 0, y);
      ctx.quadraticCurveTo(8, y + 5, 16, y);
      ctx.stroke();
    }
    return;
  }
  if (id === 'bell') {
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath(); ctx.arc(0, 2, 12, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#d4a017'; ctx.fillRect(-13, 2, 26, 4);
    ctx.fillStyle = '#5d3a1e';
    ctx.beginPath(); ctx.arc(0, 10, 3, 0, Math.PI * 2); ctx.fill();
    return;
  }
  if (id === 'pot') {
    ctx.fillStyle = '#9aa2ad'; roundRectPath(ctx, -13, -4, 26, 16, 6); ctx.fill();
    ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#e8e8ec'; ctx.fillRect(-15, -7, 30, 4);
    ctx.strokeStyle = 'rgba(255,244,220,0.9)'; ctx.lineWidth = 2;
    for (const x of [-5, 5]) {
      ctx.beginPath(); ctx.moveTo(x, -10); ctx.quadraticCurveTo(x - 3, -15, x, -19); ctx.stroke();
    }
    return;
  }
  if (id === 'ember') {
    ctx.fillStyle = '#ff7a2e';
    ctx.beginPath(); ctx.moveTo(0, 16);
    ctx.quadraticCurveTo(-13, 2, -6, -8);
    ctx.quadraticCurveTo(-2, -13, 0, -18);
    ctx.quadraticCurveTo(4, -10, 9, -4);
    ctx.quadraticCurveTo(13, 4, 0, 16);
    ctx.fill();
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath(); ctx.moveTo(0, 12);
    ctx.quadraticCurveTo(-6, 4, -2, -3);
    ctx.quadraticCurveTo(1, -7, 3, -2);
    ctx.quadraticCurveTo(7, 4, 0, 12);
    ctx.fill();
    return;
  }
  if (id === 'lantern') {
    ctx.fillStyle = '#ffb347'; roundRectPath(ctx, -9, -11, 18, 24, 6); ctx.fill();
    ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.strokeStyle = '#8a5a1e'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-9, -3); ctx.lineTo(9, -3); ctx.moveTo(-9, 5); ctx.lineTo(9, 5); ctx.stroke();
    ctx.fillStyle = '#fff3c4';
    ctx.beginPath(); ctx.arc(0, 1, 4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, -13, 4, Math.PI, 0); ctx.stroke();
    return;
  }
  if (id === 'ladle') {
    ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-4, 2); ctx.lineTo(16, -15); ctx.stroke();
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath(); ctx.arc(-8, 7, 8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#fff3c4';
    ctx.beginPath(); ctx.arc(-8, 7, 4, 0, Math.PI * 2); ctx.fill();
    return;
  }
  if (id === 'star') {
    starPath(ctx, 0, 0, 15);
    ctx.fillStyle = '#ffd94d'; ctx.fill();
    ctx.strokeStyle = '#8a6410'; ctx.lineWidth = 1.5; ctx.stroke();
    return;
  }
  if (id === 'salt') {
    ctx.fillStyle = '#f4efe4';
    ctx.beginPath(); ctx.moveTo(-8, 12); ctx.lineTo(8, 12); ctx.lineTo(5, -8); ctx.lineTo(-5, -8); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#9aa2ad'; ctx.fillRect(-6, -13, 12, 5);
    ctx.fillStyle = '#fff';
    for (const [x, y] of [[-10, 16], [0, 18], [10, 15]]) { ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill(); }
    return;
  }
  if (id === 'quill') {
    ctx.save(); ctx.rotate(-0.6);
    ctx.fillStyle = '#fdf6e3';
    ctx.beginPath(); ctx.ellipse(0, -2, 7, 15, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.strokeStyle = '#5d3a1e'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, 13); ctx.lineTo(0, -17); ctx.stroke();
    ctx.restore();
    return;
  }
  // V5 glyphs live in iconGlyphsB.js (batch, twin, crisp, chain).
  if (glyphExtra(ctx, id)) return;
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(id.charAt(0).toUpperCase(), 0, 1);
}

export { glyphExtra };

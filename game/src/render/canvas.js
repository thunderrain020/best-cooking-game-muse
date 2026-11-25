// Ember & Tide — render/canvas.js
// Draws the whole kitchen scene on one canvas: sunset harbour backdrop, order
// board, stations, tray, ingredient crates, HUD and live feedback. Layout rects
// are exported so main.js can hit-test clicks against exactly what is drawn.

import { INGREDIENTS, INGREDIENT_ORDER, dishById } from '../data/recipes.js';
import { drawIngredientIcon, drawDishPlate, drawPlateInProgress } from './foodArt.js';
import { fmtClock, fmtCoins, roundRectPath, clamp } from '../core/util.js';

export const W = 1280;
export const H = 720;

export const LAYOUT = {
  topBar: { x: 0, y: 0, w: 1280, h: 56 },
  board: { x: 14, y: 68, w: 244, h: 580 },
  boardRect: { x: 300, y: 120, w: 170, h: 190 },
  wokRect: { x: 490, y: 120, w: 170, h: 190 },
  potRect: { x: 680, y: 120, w: 170, h: 190 },
  plateRect: { x: 870, y: 120, w: 190, h: 190 },
  bellRect: { x: 1080, y: 120, w: 186, h: 190 },
  tray: { x: 300, y: 340, w: 420, h: 76 },
  crates: { x: 300, y: 450, w: 966, h: 150 },
  hintBar: { x: 0, y: 664, w: 1280, h: 56 },
};

export function crateRect(i) {
  const { x, y, w, h } = LAYOUT.crates;
  const cw = w / 8;
  return { x: x + i * cw + 4, y: y + 6, w: cw - 8, h: h - 12 };
}

export function trayRect(i) {
  const { x, y } = LAYOUT.tray;
  return { x: x + 10 + i * 100, y: y + 26, w: 88, h: 40 };
}

export function ticketRect(i) {
  return { x: 22, y: 108 + i * 104, w: 228, h: 96 };
}

function stationLabel(ctx, x, y, w, label, key) {
  ctx.fillStyle = '#2a1a12';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, x + w / 2, y + 22);
  ctx.fillStyle = '#ffe6a8';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.fillText(key, x + w / 2, y + 38);
}

function drawBackground(ctx, g, now) {
  const sky = ctx.createLinearGradient(0, 0, 0, 720);
  sky.addColorStop(0, '#2b1e4e');
  sky.addColorStop(0.35, '#7a3b5e');
  sky.addColorStop(0.6, '#e8703f');
  sky.addColorStop(0.78, '#f2a54a');
  sky.addColorStop(1, '#3a2a3a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 1280, 720);

  // Sun low over the harbour.
  const sun = ctx.createRadialGradient(1010, 180, 10, 1010, 180, 220);
  sun.addColorStop(0, 'rgba(255,214,130,0.95)');
  sun.addColorStop(0.4, 'rgba(255,170,80,0.55)');
  sun.addColorStop(1, 'rgba(255,170,80,0)');
  ctx.fillStyle = sun;
  ctx.fillRect(760, 0, 520, 420);
  ctx.fillStyle = '#ffe6a8';
  ctx.beginPath();
  ctx.arc(1010, 185, 52, 0, Math.PI * 2);
  ctx.fill();

  // Harbour skyline + masts, sea shimmer.
  ctx.fillStyle = '#241a33';
  ctx.fillRect(0, 300, 1280, 60);
  for (let i = 0; i < 14; i++) {
    const bx = 40 + i * 92;
    const bh = 26 + ((i * 37) % 44);
    ctx.fillRect(bx, 300 - bh, 54, bh + 60);
    ctx.fillStyle = '#ffd94d';
    ctx.fillRect(bx + 8, 300 - bh + 8, 6, 6);
    ctx.fillRect(bx + 28, 300 - bh + 16, 6, 6);
    ctx.fillStyle = '#241a33';
  }
  ctx.fillStyle = '#1d3a4d';
  ctx.fillRect(0, 360, 1280, 360);
  ctx.strokeStyle = 'rgba(255,190,110,0.35)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const y = 380 + i * 42;
    const off = Math.sin(now * 0.7 + i * 1.7) * 14;
    ctx.beginPath();
    ctx.moveTo(60 + off, y);
    ctx.lineTo(1220 - off, y);
    ctx.stroke();
  }

  // String lights across the top.
  ctx.strokeStyle = 'rgba(40,20,10,0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 8);
  ctx.quadraticCurveTo(640, 52, 1280, 8);
  ctx.stroke();
  for (let i = 0; i < 26; i++) {
    const t = i / 25;
    const x = t * 1280;
    const y = 8 + Math.sin(t * Math.PI) * 40;
    const glow = 0.6 + 0.4 * Math.sin(now * 2 + i);
    ctx.fillStyle = `rgba(255,205,110,${0.5 + 0.4 * glow})`;
    ctx.beginPath();
    ctx.arc(x, y + 8, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCounter(ctx) {
  // Warm wooden counter band the stations sit on.
  const grad = ctx.createLinearGradient(0, 96, 0, 660);
  grad.addColorStop(0, '#8a5a33');
  grad.addColorStop(1, '#5d3a1e');
  ctx.fillStyle = grad;
  roundRectPath(ctx, 272, 96, 994, 548, 18);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,220,160,0.16)';
  roundRectPath(ctx, 272, 96, 994, 26, 18);
  ctx.fill();
  ctx.fillStyle = '#6d4526';
  ctx.fillRect(272, 428, 994, 8);
}

function drawTicket(ctx, t, i, now) {
  const r = ticketRect(i);
  const frac = clamp(t.left / t.total, 0, 1);
  const urgent = frac < 0.3;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = t.vip ? '#fff3c4' : '#fdf6e3';
  roundRectPath(ctx, r.x, r.y, r.w, r.h, 10);
  ctx.fill();
  ctx.restore();
  if (t.vip) {
    ctx.strokeStyle = '#d4a017';
    ctx.lineWidth = 3;
    roundRectPath(ctx, r.x + 1.5, r.y + 1.5, r.w - 3, r.h - 3, 9);
    ctx.stroke();
  }
  if (urgent && Math.sin(now * 6) > 0) {
    ctx.strokeStyle = '#e8442e';
    ctx.lineWidth = 3;
    roundRectPath(ctx, r.x + 1.5, r.y + 1.5, r.w - 3, r.h - 3, 9);
    ctx.stroke();
  }
  drawDishPlate(ctx, t.dish, r.x + 44, r.y + 40, 30);
  ctx.fillStyle = '#2a1a12';
  ctx.font = 'bold 14px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText(t.dish.name, r.x + 82, r.y + 26, 140);
  ctx.fillStyle = '#7a5a34';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText(t.dish.comps.map((c) => INGREDIENTS[c].name).join(' + '), r.x + 82, r.y + 44, 140);
  ctx.fillStyle = t.vip ? '#b8860b' : '#5a7a3a';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.fillText((t.vip ? '★ VIP  ' : '') + fmtCoins(t.dish.price) + ' + tip', r.x + 82, r.y + 62);
  // Patience bar.
  ctx.fillStyle = '#e8dcc2';
  roundRectPath(ctx, r.x + 12, r.y + 76, r.w - 24, 10, 5);
  ctx.fill();
  ctx.fillStyle = frac > 0.5 ? '#4caf6d' : frac > 0.3 ? '#f2a54a' : '#e8442e';
  roundRectPath(ctx, r.x + 12, r.y + 76, (r.w - 24) * frac, 10, 5);
  ctx.fill();
  ctx.fillStyle = '#2a1a12';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(Math.ceil(t.left) + 's', r.x + r.w - 12, r.y + 74);
  ctx.textAlign = 'left';
}

function drawBoardStation(ctx, g, now) {
  const r = LAYOUT.boardRect;
  ctx.fillStyle = '#d9b380';
  roundRectPath(ctx, r.x, r.y + 60, r.w, 110, 10);
  ctx.fill();
  ctx.fillStyle = '#b98d54';
  ctx.fillRect(r.x + 6, r.y + 60, r.w - 12, 8);
  stationLabel(ctx, r.x, r.y, r.w, 'CHOP BOARD', 'Q · click or Space');
  const b = g.board;
  if (b.item) {
    drawIngredientIcon(ctx, b.item, r.x + r.w / 2, r.y + 118, 34);
    // Chop pips.
    for (let i = 0; i < b.chopsNeeded; i++) {
      ctx.fillStyle = i < b.chops ? '#4caf6d' : '#e8dcc2';
      ctx.beginPath();
      ctx.arc(r.x + r.w / 2 - (b.chopsNeeded - 1) * 12 + i * 24, r.y + 156, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    // Knife mid-swing.
    ctx.save();
    ctx.translate(r.x + r.w / 2 + 44, r.y + 100);
    ctx.rotate(-0.5 - b.anim * 0.9);
    ctx.fillStyle = '#cfd6dd';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(34, -6);
    ctx.lineTo(34, 6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#5a3a1e';
    ctx.fillRect(-14, -4, 16, 8);
    ctx.restore();
  } else {
    ctx.fillStyle = 'rgba(60,35,15,0.55)';
    ctx.font = 'italic 13px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('empty board', r.x + r.w / 2, r.y + 118);
  }
}

function drawWokStation(ctx, g, now) {
  const r = LAYOUT.wokRect;
  stationLabel(ctx, r.x, r.y, r.w, 'SIZZLE WOK', 'W · Space to pull');
  const w = g.wok;
  // Wok bowl.
  const grad = ctx.createRadialGradient(r.x + r.w / 2, r.y + 110, 6, r.x + r.w / 2, r.y + 110, 62);
  grad.addColorStop(0, w.state === 'burning' ? '#3a2a24' : '#4a4a55');
  grad.addColorStop(1, '#23232c');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(r.x + r.w / 2, r.y + 112, 62, 40, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#777';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(r.x + r.w / 2, r.y + 112, 62, 40, 0, Math.PI, Math.PI * 2);
  ctx.stroke();
  if (w.item) {
    drawIngredientIcon(ctx, w.item, r.x + r.w / 2, r.y + 104, 30);
    if (w.state === 'cooking') {
      // Timing bar with PERFECT window.
      const bx = r.x + 6, by = r.y + 168, bw = r.w - 12, bh = 12;
      ctx.fillStyle = '#2a1a12';
      roundRectPath(ctx, bx, by, bw, bh, 6);
      ctx.fill();
      ctx.fillStyle = '#e8442e';
      roundRectPath(ctx, bx + bw * 0.85, by, bw * 0.15, bh, 6);
      ctx.fill();
      ctx.fillStyle = '#4caf6d';
      ctx.fillRect(bx + bw * w.perfect[0], by, bw * (w.perfect[1] - w.perfect[0]), bh);
      const frac = clamp(w.t / w.dur, 0, 1);
      ctx.fillStyle = '#ffd94d';
      ctx.beginPath();
      ctx.moveTo(bx + bw * frac, by - 5);
      ctx.lineTo(bx + bw * frac - 6, by - 14);
      ctx.lineTo(bx + bw * frac + 6, by - 14);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffd94d';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PERFECT', bx + bw * 0.52, by + 26);
    } else if (w.state === 'burning') {
      ctx.fillStyle = '#ff6b4a';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BURNING! click to toss', r.x + r.w / 2, r.y + 186);
    }
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = 'italic 13px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('wok is cold', r.x + r.w / 2, r.y + 112);
  }
}

function drawPotStation(ctx, g, now) {
  const r = LAYOUT.potRect;
  stationLabel(ctx, r.x, r.y, r.w, 'SIMMER POT', 'E · it finishes itself');
  const p = g.pot;
  const grad = ctx.createLinearGradient(r.x, r.y + 70, r.x, r.y + 170);
  grad.addColorStop(0, '#7a7d88');
  grad.addColorStop(1, '#3c3e48');
  ctx.fillStyle = grad;
  roundRectPath(ctx, r.x + 18, r.y + 66, r.w - 36, 92, 12);
  ctx.fill();
  ctx.fillStyle = p.state === 'cooking' ? '#c98f2e' : '#555';
  ctx.beginPath();
  ctx.ellipse(r.x + r.w / 2, r.y + 70, (r.w - 36) / 2, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  if (p.state === 'cooking') {
    for (let i = 0; i < 4; i++) {
      const bx = r.x + r.w / 2 - 30 + i * 20 + Math.sin(now * 3 + i * 2) * 3;
      const by = r.y + 66 - ((now * 14 + i * 9) % 22);
      ctx.fillStyle = 'rgba(255,240,200,0.8)';
      ctx.beginPath();
      ctx.arc(bx, by, 3 + (i % 2), 0, Math.PI * 2);
      ctx.fill();
    }
    const frac = clamp(p.t / p.dur, 0, 1);
    ctx.fillStyle = '#2a1a12';
    roundRectPath(ctx, r.x + 6, r.y + 168, r.w - 12, 10, 5);
    ctx.fill();
    ctx.fillStyle = '#f2a54a';
    roundRectPath(ctx, r.x + 6, r.y + 168, (r.w - 12) * frac, 10, 5);
    ctx.fill();
    if (p.item) drawIngredientIcon(ctx, p.item, r.x + r.w / 2, r.y + 112, 22);
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = 'italic 13px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('pot is empty', r.x + r.w / 2, r.y + 118);
  }
}

function drawPlateStation(ctx, g) {
  const r = LAYOUT.plateRect;
  const dish = g.plate.dishId ? dishById(g.plate.dishId) : null;
  const total = dish ? dish.comps.length : Math.max(3, g.plate.items.length);
  stationLabel(ctx, r.x, r.y, r.w, 'PLATING COUNTER', 'R · click to stack');
  drawPlateInProgress(ctx, g.plate.items, total, r.x + r.w / 2, r.y + 118, 62);
  ctx.fillStyle = dish ? '#2e7d32' : '#ffe6a8';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    dish ? dish.name : g.plate.items.length ? `${g.plate.items.length} on the plate…` : 'plate is empty',
    r.x + r.w / 2, r.y + 186,
  );
}

function drawBellStation(ctx, g, now) {
  const r = LAYOUT.bellRect;
  stationLabel(ctx, r.x, r.y, r.w, 'PASS · SERVE', 'Space · ring the bell');
  const ready = !!g.plate.dishId;
  const cx = r.x + r.w / 2;
  const pulse = ready ? 1 + 0.06 * Math.sin(now * 6) : 1;
  ctx.save();
  ctx.translate(cx, r.y + 108);
  ctx.scale(pulse, pulse);
  const grad = ctx.createRadialGradient(-8, -14, 4, 0, 0, 46);
  grad.addColorStop(0, '#ffe9a8');
  grad.addColorStop(0.6, '#d4a017');
  grad.addColorStop(1, '#8a6410');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(-34, 26);
  ctx.quadraticCurveTo(-34, -26, 0, -30);
  ctx.quadraticCurveTo(34, -26, 34, 26);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8a6410';
  ctx.fillRect(-40, 24, 80, 7);
  ctx.fillStyle = '#5d3a1e';
  ctx.beginPath();
  ctx.arc(0, 36, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = ready ? '#ffd94d' : '#c9b48a';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(ready ? 'RING IT!' : 'serve a full dish', cx, r.y + 186);
}

function drawTray(ctx, g) {
  const t = LAYOUT.tray;
  ctx.fillStyle = 'rgba(20,10,5,0.35)';
  roundRectPath(ctx, t.x, t.y, t.w, t.h, 10);
  ctx.fill();
  ctx.fillStyle = '#ffe6a8';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('PREPPED TRAY — click to take', t.x + 12, t.y + 18);
  for (let i = 0; i < 4; i++) {
    const r = trayRect(i);
    ctx.fillStyle = 'rgba(255,246,227,0.14)';
    roundRectPath(ctx, r.x, r.y, r.w, r.h, 8);
    ctx.fill();
    if (g.tray[i]) {
      drawIngredientIcon(ctx, g.tray[i], r.x + r.w / 2, r.y + r.h / 2, 15);
    }
  }
}

function drawCrates(ctx, g) {
  const c = LAYOUT.crates;
  ctx.fillStyle = '#ffe6a8';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('PANTRY — click a crate, or press 1–8', c.x + 4, c.y - 6);
  INGREDIENT_ORDER.forEach((id, i) => {
    const r = crateRect(i);
    const ing = INGREDIENTS[id];
    const held = g.hand && g.hand.id === id;
    ctx.fillStyle = held ? '#ffe9a8' : '#fdf6e3';
    ctx.strokeStyle = held ? '#d4a017' : '#b98d54';
    ctx.lineWidth = held ? 3 : 2;
    roundRectPath(ctx, r.x, r.y, r.w, r.h, 10);
    ctx.fill();
    ctx.stroke();
    drawIngredientIcon(ctx, id, r.x + r.w / 2, r.y + 52, 30);
    ctx.fillStyle = '#2a1a12';
    ctx.font = 'bold 13px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(ing.name, r.x + r.w / 2, r.y + 98);
    ctx.fillStyle = '#7a5a34';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText(ing.station === 'board' ? 'chop' : ing.station === 'wok' ? 'wok' : 'pot', r.x + r.w / 2, r.y + 114);
    ctx.fillStyle = '#8a6410';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(ing.key, r.x + 8, r.y + 18);
  });
}

function drawTopBar(ctx, g) {
  const b = LAYOUT.topBar;
  ctx.fillStyle = 'rgba(24,12,8,0.72)';
  ctx.fillRect(b.x, b.y, b.w, b.h);
  ctx.fillStyle = '#ffe6a8';
  ctx.font = 'bold 24px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('EMBER & TIDE', 16, 36);
  ctx.fillStyle = '#f2a54a';
  ctx.font = 'italic 13px Georgia, serif';
  ctx.fillText('rooftop harbour kitchen', 196, 36);
  ctx.fillStyle = '#fdf6e3';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(fmtCoins(g.coins), 560, 35);
  ctx.fillStyle = '#c9b48a';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText('SHIFT ' + g.shift, 470, 35);
  ctx.fillText('SERVED ' + g.served, 660, 35);
  const combo = g.combo > 1 ? 'COMBO ×' + (1 + Math.min(g.combo, 9) * 0.1).toFixed(1) + '  (' + g.combo + ')' : 'COMBO —';
  ctx.fillStyle = g.combo > 1 ? '#ffd94d' : '#c9b48a';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillText(combo, 800, 35);
  // Shift timer, big and readable.
  const low = g.shiftLeft < 30;
  ctx.fillStyle = low ? '#ff6b4a' : '#fdf6e3';
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(fmtClock(g.shiftLeft), 1060, 38);
  ctx.fillStyle = '#c9b48a';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText('SHIFT ENDS', 1060, 52);
  ctx.textAlign = 'left';
  // Buttons: ledger, help, mute.
  ctx.fillStyle = '#5d3a1e';
  roundRectPath(ctx, 1100, 12, 52, 32, 8);
  ctx.fill();
  ctx.fillStyle = '#ffe6a8';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BOOK', 1126, 34);
  ctx.fillStyle = '#5d3a1e';
  roundRectPath(ctx, 1160, 12, 52, 32, 8);
  ctx.fill();
  ctx.fillStyle = '#ffe6a8';
  ctx.fillText('?', 1186, 34);
  ctx.fillStyle = '#5d3a1e';
  roundRectPath(ctx, 1220, 12, 52, 32, 8);
  ctx.fill();
  ctx.fillStyle = '#ffe6a8';
  ctx.fillText(g.muted ? 'OFF' : 'SND', 1246, 34);
}

export function topBarButtons() {
  return {
    ledger: { x: 1100, y: 12, w: 52, h: 32 },
    help: { x: 1160, y: 12, w: 52, h: 32 },
    mute: { x: 1220, y: 12, w: 52, h: 32 },
  };
}

function drawParticles(ctx, g) {
  for (const p of g.particles) {
    const a = 1 - p.t / p.life;
    ctx.globalAlpha = a * 0.8;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * (p.spark ? 1 : 1 + p.t), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawFloats(ctx, g) {
  ctx.textAlign = 'center';
  for (const f of g.floats) {
    ctx.globalAlpha = 1 - f.t / 1.4;
    ctx.fillStyle = f.color;
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText(f.text, f.x, f.y - f.t * 40);
  }
  ctx.globalAlpha = 1;
}

export function drawScene(ctx, g, view) {
  const now = view.now;
  drawBackground(ctx, g, now);
  drawCounter(ctx);

  // Order board.
  ctx.fillStyle = 'rgba(24,12,8,0.55)';
  roundRectPath(ctx, LAYOUT.board.x, LAYOUT.board.y, LAYOUT.board.w, LAYOUT.board.h, 14);
  ctx.fill();
  ctx.fillStyle = '#ffe6a8';
  ctx.font = 'bold 17px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('ORDER BOARD', 24, 96);
  ctx.fillStyle = '#f2a54a';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText(g.tickets.length + ' ticket' + (g.tickets.length === 1 ? '' : 's') + ' · serve before the bar runs out', 24, 640);
  if (!g.tickets.length) {
    ctx.fillStyle = 'rgba(255,246,227,0.6)';
    ctx.font = 'italic 14px Georgia, serif';
    ctx.fillText('No orders yet —', 24, 140);
    ctx.fillText('the evening crowd', 24, 160);
    ctx.fillText('is on its way…', 24, 180);
  }
  g.tickets.forEach((t, i) => drawTicket(ctx, t, i, now));

  drawBoardStation(ctx, g, now);
  drawWokStation(ctx, g, now);
  drawPotStation(ctx, g, now);
  drawPlateStation(ctx, g);
  drawBellStation(ctx, g, now);
  drawTray(ctx, g);
  drawCrates(ctx, g);
  drawParticles(ctx, g);
  drawFloats(ctx, g);

  // Rush banner.
  if (g.rush) {
    ctx.save();
    ctx.globalAlpha = 0.85 + 0.15 * Math.sin(now * 8);
    ctx.fillStyle = '#e8442e';
    roundRectPath(ctx, 480, 66, 320, 40, 10);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('» ' + g.rush.name + ' «', 640, 94);
    ctx.restore();
  }

  drawTopBar(ctx, g);

  // Toast.
  if (g.toast && g.time < g.toast.until) {
    ctx.fillStyle = 'rgba(24,12,8,0.8)';
    const tw = ctx.measureText(g.toast.text).width + 36;
    roundRectPath(ctx, 640 - tw / 2, 620, tw, 30, 15);
    ctx.fill();
    ctx.fillStyle = '#ffe6a8';
    ctx.font = '14px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(g.toast.text, 640, 640);
  }

  // Hand follows the cursor.
  if (g.hand && view.mouse) {
    ctx.save();
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = 'rgba(24,12,8,0.6)';
    ctx.beginPath();
    ctx.arc(view.mouse.x, view.mouse.y, 26, 0, Math.PI * 2);
    ctx.fill();
    drawIngredientIcon(ctx, g.hand.id, view.mouse.x, view.mouse.y, 20);
    ctx.restore();
  }

  // Hint bar.
  ctx.fillStyle = 'rgba(24,12,8,0.72)';
  ctx.fillRect(0, 664, 1280, 56);
  ctx.fillStyle = '#e8dcc2';
  ctx.font = '14px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('1–8 grab ingredient · Q chop board · W wok · E pot · R plate · Space chop / pull / ring · L recipe ledger · click everything too', 640, 686);
  ctx.fillStyle = '#f2a54a';
  ctx.font = 'italic 13px Georgia, serif';
  ctx.fillText('Ember & Tide — a rooftop harbour kitchen. No network, no build step, just dinner service.', 640, 706);
}

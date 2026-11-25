// Ember & Tide — ui/hud.js
// Full-screen overlays drawn over the kitchen: title screen, between-shift
// upgrade shop, recipe ledger and help. Each overlay also exports the button
// rects main.js hit-tests, so clicks land exactly on what is drawn.

import { DISHES, UPGRADES, INGREDIENTS } from '../data/recipes.js';
import { drawDishPlate } from '../render/foodArt.js';
import { fmtCoins, roundRectPath } from '../core/util.js';

function dim(ctx) {
  ctx.fillStyle = 'rgba(16,8,4,0.72)';
  ctx.fillRect(0, 0, 1280, 720);
}

function panel(ctx, x, y, w, h) {
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

export function drawTitle(ctx, g) {
  dim(ctx);
  panel(ctx, 240, 90, 800, 540);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#e8703f';
  ctx.font = 'bold 64px Georgia, serif';
  ctx.fillText('EMBER & TIDE', 640, 190);
  ctx.fillStyle = '#7a3b5e';
  ctx.font = 'italic 24px Georgia, serif';
  ctx.fillText('a rooftop harbour kitchen at sunset', 640, 232);
  ctx.fillStyle = '#2a1a12';
  ctx.font = '17px system-ui, sans-serif';
  const lines = [
    'The dinner crowd is coming up the stairs. Take their orders,',
    'chop, sizzle and simmer, plate it beautiful, and ring the bell.',
    'Serve fast for tips, chain serves for combos, and mind the wok —',
    'a perfect pull pays extra, a burnt one pays nothing.',
  ];
  lines.forEach((l, i) => ctx.fillText(l, 640, 290 + i * 26));
  ctx.fillStyle = '#5d3a1e';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillText('CLICK TO PLAY — or press Enter', 640, 440);
  ctx.fillStyle = '#7a5a34';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('1–8 pantry · Q chop · W wok · E pot · R plate · Space chop / pull / ring · L ledger', 640, 472);
  ctx.fillText('Mouse works for everything. Sound is synthesized live — no audio files.', 640, 496);
  // Start button.
  ctx.fillStyle = '#e8703f';
  roundRectPath(ctx, 520, 530, 240, 56, 12);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText('START SHIFT 1', 640, 566);
}

export function titleButtons() {
  return { start: { x: 520, y: 530, w: 240, h: 56 } };
}

export function drawShop(ctx, g) {
  dim(ctx);
  panel(ctx, 140, 70, 1000, 580);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#2a1a12';
  ctx.font = 'bold 34px Georgia, serif';
  ctx.fillText('Shift ' + (g.shift - 1) + ' done — the kitchen rests', 640, 130);
  ctx.fillStyle = '#7a5a34';
  ctx.font = '17px system-ui, sans-serif';
  ctx.fillText(
    'Served ' + g.served + ' dishes · earned ' + fmtCoins(g.earned) + ' · best combo ×' + g.bestCombo + ' · wallet ' + fmtCoins(g.coins),
    640, 162,
  );
  ctx.fillStyle = '#2a1a12';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.fillText('KITCHEN UPGRADES — pick one, or save your coins', 640, 205);
  const choices = g.shopChoices.map((id) => UPGRADES.find((u) => u.id === id));
  choices.forEach((u, i) => {
    const x = 190 + i * 310;
    const y = 230;
    const owned = g.upgrades[u.id];
    ctx.fillStyle = owned ? '#e8e0cf' : '#fff8e6';
    ctx.strokeStyle = owned ? '#b8a67c' : '#d4a017';
    ctx.lineWidth = 2;
    roundRectPath(ctx, x, y, 280, 190, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#2a1a12';
    ctx.font = 'bold 19px Georgia, serif';
    ctx.fillText(u.name, x + 140, y + 40);
    ctx.fillStyle = '#7a5a34';
    ctx.font = '14px system-ui, sans-serif';
    const words = wrap(u.desc, 34);
    words.forEach((w, j) => ctx.fillText(w, x + 140, y + 74 + j * 20));
    ctx.fillStyle = owned ? '#8a8a8a' : '#b8860b';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText(owned ? 'OWNED' : fmtCoins(u.cost), x + 140, y + 160);
  });
  ctx.fillStyle = '#5d3a1e';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('Upgrades stay for the whole run. The next shift brings more tickets, faster.', 640, 460);
  ctx.fillStyle = '#2e7d32';
  roundRectPath(ctx, 500, 500, 280, 56, 12);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText('START SHIFT ' + g.shift, 640, 536);
  ctx.fillStyle = '#7a5a34';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('or press Enter', 640, 590);
}

export function shopButtons(g) {
  const btns = { next: { x: 500, y: 500, w: 280, h: 56 }, cards: [] };
  g.shopChoices.forEach((id, i) => {
    btns.cards.push({ id, x: 190 + i * 310, y: 230, w: 280, h: 190 });
  });
  return btns;
}

export function drawLedger(ctx, g) {
  dim(ctx);
  panel(ctx, 180, 60, 920, 600);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#2a1a12';
  ctx.font = 'bold 30px Georgia, serif';
  ctx.fillText('RECIPE LEDGER', 220, 112);
  ctx.fillStyle = '#7a5a34';
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillText('Every dish is pantry ingredients, prepared and stacked. VIP dishes pay more and ask for four.', 220, 138);
  DISHES.forEach((d, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 220 + col * 450;
    const y = 168 + row * 78;
    drawDishPlate(ctx, d, x + 34, y + 26, 26);
    ctx.fillStyle = '#2a1a12';
    ctx.font = 'bold 15px Georgia, serif';
    ctx.fillText((d.vip ? '★ ' : '') + d.name, x + 72, y + 18);
    ctx.fillStyle = '#7a5a34';
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillText(d.comps.map((c) => INGREDIENTS[c].name).join(' + '), x + 72, y + 38);
    ctx.fillStyle = '#b8860b';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillText(fmtCoins(d.price) + ' + tip', x + 72, y + 56);
  });
  ctx.fillStyle = '#5d3a1e';
  roundRectPath(ctx, 540, 600, 200, 44, 10);
  ctx.fill();
  ctx.fillStyle = '#ffe6a8';
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CLOSE  (L)', 640, 628);
}

export function ledgerButtons() {
  return { close: { x: 540, y: 600, w: 200, h: 44 } };
}

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
    'combos, and spend coins on upgrades between shifts.',
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

function wrap(text, width) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > width) {
      lines.push(line.trim());
      line = w;
    } else {
      line += ' ' + w;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

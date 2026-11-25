// Ember & Tide — render/canvas.js
// Scene orchestrator: floor, terrace, counter band, ticket rail, crates,
// stations, island, bell, garnish tray, chef + route guide, particles,
// floats, rush banner, HUD and hint bar. Each part is drawn by its own
// focused module; this file only composes them. Layout rects come from
// render/layout.js so input hit-testing matches exactly what is drawn.

import { drawBackdrop, drawCounter } from './backdrop.js';
import { drawTerrace } from './window.js';
import { drawBoardPanel, ticketRect } from './tickets.js';
import { drawBoardStation } from './stationsBoard.js';
import { drawWokStation } from './stations.js';
import { drawPotStation } from './stationsPot.js';
import { drawPlateStation, drawBellStation } from './serve.js';
import { drawTray, drawCrates, drawTrash, crateRect, trayRect } from './pantry.js';
import { drawParticles, drawFloats } from './particles.js';
import { drawTopBar, drawRoadmap, topBarButtons } from './hudBar.js';
import { drawRoute, drawChef } from './chef.js';
import { pillText } from './palette.js';
import { roundRectPath } from '../core/util.js';
import { FLOOR, TERRACE, BOARD_RECTS, WOK_RECTS, POT_RECT, GARNISH_RECT, ISLAND_RECT, BELL_RECT, TRASH_RECT } from './layout.js';

export const W = 1280;
export const H = 720;

export const LAYOUT = {
  topBar: { x: 0, y: 0, w: 1280, h: 56 },
  board: { x: 14, y: 92, w: 1024, h: 80 },
  boardRect: BOARD_RECTS[0],
  boardRect2: BOARD_RECTS[1],
  wokRect: WOK_RECTS[0],
  wokRect2: WOK_RECTS[1],
  potRect: POT_RECT,
  garnishRect: GARNISH_RECT,
  plateRect: ISLAND_RECT,
  bellRect: BELL_RECT,
  trashRect: TRASH_RECT,
  tray: { x: GARNISH_RECT.x, y: GARNISH_RECT.y, w: GARNISH_RECT.w, h: GARNISH_RECT.h },
  crates: { x: 16, y: 200, w: 864, h: 82 },
  hintBar: { x: 0, y: 664, w: 1280, h: 56 },
  floor: FLOOR,
  terrace: TERRACE,
};

export { crateRect, trayRect, ticketRect, topBarButtons };

export function drawScene(ctx, g, view) {
  const now = view.now;
  drawBackdrop(ctx, now);
  drawTerrace(ctx, g, now);
  drawCounter(ctx);
  drawBoardPanel(ctx, g, now);
  drawCrates(ctx, g);
  drawTrash(ctx, g);
  drawBoardStation(ctx, g, now, 0);
  drawBoardStation(ctx, g, now, 1);
  drawWokStation(ctx, g, now, 0);
  drawWokStation(ctx, g, now, 1);
  drawPotStation(ctx, g, now);
  drawPlateStation(ctx, g, now);
  drawBellStation(ctx, g, now);
  drawTray(ctx, g);
  drawRoute(ctx, g);
  drawChef(ctx, g, now);
  drawParticles(ctx, g);
  drawFloats(ctx, g);

  // Rush banner: a floating pill in the seam between the ticket rail
  // and the counter band — clear of cards, crates and station tags.
  if (g.rush || (g.critic.active && !g.critic.served)) {
    const storm = g.rush && g.rush.name.includes('STORM');
    const text = g.rush ? '» ' + g.rush.name + ' «' : 'CRITIC FINALE — serve the Tide & Ember Special!';
    ctx.save();
    ctx.globalAlpha = 0.85 + 0.15 * Math.sin(now * 8);
    ctx.fillStyle = storm || g.critic.active ? '#7a3b9e' : '#e8442e';
    roundRectPath(ctx, 640 - 200, 163, 400, 26, 12); ctx.fill();
    ctx.strokeStyle = '#1a120b';
    ctx.lineWidth = 2.5;
    roundRectPath(ctx, 640 - 200, 163, 400, 26, 12); ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, 640, 181);
    ctx.restore();
  }

  // Kitchen event modifier badge: a second live modifier, in the open
  // seam left of the rush banner — clear of tickets, crates and tags.
  if (g.event) {
    const t = '★ ' + g.event.name + ' · ' + g.event.bonus + ' ★';
    ctx.save();
    ctx.font = 'bold 13px system-ui, sans-serif';
    const w = ctx.measureText(t).width + 30;
    ctx.fillStyle = '#7a3b10';
    roundRectPath(ctx, 16, 170, w, 24, 12); ctx.fill();
    ctx.strokeStyle = '#ffd94d'; ctx.lineWidth = 2;
    roundRectPath(ctx, 16, 170, w, 24, 12); ctx.stroke();
    ctx.fillStyle = '#ffd94d';
    ctx.textAlign = 'center';
    ctx.fillText(t, 16 + w / 2, 186);
    ctx.restore();
  }

  drawTopBar(ctx, g);
  drawRoadmap(ctx, g, now);

  // Toast in its own dark pill, in the open corridor between the island
  // and the bottom row — never over a station.
  if (g.toast && g.time < g.toast.until) {
    pillText(ctx, g.toast.text, 640, 520, '14px system-ui, sans-serif', '#ffe6a8');
  }

  // Hint bar, dark enough that the footer text is always legible.
  ctx.fillStyle = 'rgba(19,17,38,0.78)';
  ctx.fillRect(0, 664, 1280, 56);
  ctx.fillStyle = '#fff6e5';
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('WASD / arrows walk · Space / E interact · 1–8 grab ingredient · Q chop · F wok · T pot · R plate · L recipe ledger · click a crate or station to stroll there', 640, 686);
  ctx.fillStyle = '#ffd94d';
  ctx.font = 'italic 13px Georgia, serif';
  ctx.fillText('Ember & Tide — a rooftop harbour kitchen. No network, no build step, just dinner service.', 640, 706);
}

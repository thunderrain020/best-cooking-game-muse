// Ember & Tide — render/canvas.js
// Scene orchestrator: backdrop, counter, order board, stations, tray,
// crates, particles, floats, rush banner, HUD and hint bar. Each part is
// drawn by its own focused module; this file only composes them. Layout
// rects are exported so main.js can hit-test exactly what is drawn.

import { drawIngredientIcon } from './foodArt.js';
import { drawBackdrop, drawCounter } from './backdrop.js';
import { drawBoardPanel, ticketRect } from './tickets.js';
import { drawBoardStation, drawWokStation, drawPotStation, STATION_RECTS } from './stations.js';
import { drawPlateStation, drawBellStation } from './serve.js';
import { drawTray, drawCrates, crateRect, trayRect } from './pantry.js';
import { drawParticles, drawFloats } from './particles.js';
import { drawTopBar, drawRoadmap, topBarButtons } from './hudBar.js';
import { pillText } from './palette.js';
import { roundRectPath } from '../core/util.js';

export const W = 1280;
export const H = 720;

export const LAYOUT = {
  topBar: { x: 0, y: 0, w: 1280, h: 56 },
  board: { x: 14, y: 92, w: 244, h: 556 },
  boardRect: STATION_RECTS.boardRect,
  wokRect: STATION_RECTS.wokRect,
  potRect: STATION_RECTS.potRect,
  plateRect: STATION_RECTS.plateRect,
  bellRect: STATION_RECTS.bellRect,
  tray: { x: 300, y: 340, w: 420, h: 76 },
  crates: { x: 300, y: 450, w: 966, h: 150 },
  hintBar: { x: 0, y: 664, w: 1280, h: 56 },
};

export { crateRect, trayRect, ticketRect, topBarButtons };

export function drawScene(ctx, g, view) {
  const now = view.now;
  drawBackdrop(ctx, now);
  drawCounter(ctx);
  drawBoardPanel(ctx, g, now);
  drawBoardStation(ctx, g, now);
  drawWokStation(ctx, g, now);
  drawPotStation(ctx, g, now);
  drawPlateStation(ctx, g);
  drawBellStation(ctx, g, now);
  drawTray(ctx, g);
  drawCrates(ctx, g);
  drawParticles(ctx, g);
  drawFloats(ctx, g);

  // Rush banner: a pill floating just under the roadmap strip.
  if (g.rush) {
    ctx.save();
    ctx.globalAlpha = 0.85 + 0.15 * Math.sin(now * 8);
    ctx.fillStyle = g.rush.name.includes('STORM') ? '#7a3b9e' : '#e8442e';
    roundRectPath(ctx, 480, 92, 320, 36, 10); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('» ' + g.rush.name + ' «', 640, 117);
    ctx.restore();
  }
  // Critic callout sits above the board when the finale order is live.
  if (g.critic.active && !g.critic.served && !g.rush) {
    pillText(ctx, 'CRITIC FINALE — serve the Tide & Ember Special!', 640, 92, 'bold 13px system-ui, sans-serif', '#e8c8ff');
  }

  drawTopBar(ctx, g);
  drawRoadmap(ctx, g, now);

  // Toast in its own dark pill, above the hint bar.
  if (g.toast && g.time < g.toast.until) {
    pillText(ctx, g.toast.text, 640, 624, '14px system-ui, sans-serif', '#ffe6a8');
  }

  // Hand follows the cursor.
  if (g.hand && view.mouse) {
    ctx.save();
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = 'rgba(24,12,8,0.6)';
    ctx.beginPath(); ctx.arc(view.mouse.x, view.mouse.y, 26, 0, Math.PI * 2); ctx.fill();
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

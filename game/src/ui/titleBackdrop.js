// Ember & Tide — ui/titleBackdrop.js
// The title hub backdrop: the harbour skyline (ui/titleHarbour.js),
// hanging string lanterns, and the steaming hero dish with the chef
// mascot. Split out of ui/titleArt.js so both files stay under the
// 6 KB module cap; the skyline/lighthouse/water lives in
// ui/titleHarbour.js so this file stays under 5 KB too.

import { roundRectPath } from '../core/util.js';
import { FEATS, featCount } from '../data/feats.js';
import { centreText } from './titleArt.js';
import { drawChefMascot } from '../render/iconBadges.js';
import { drawDishPlate } from '../render/foodDishes.js';
import { dishById } from '../data/recipes.js';
import { drawSteamWisps } from '../render/feel.js';
import { drawHarbour } from './titleHarbour.js';

// The feats panel on the title hub: two columns of all 16 feats with
// their unlock state. Lives here so ui/titleOverlay.js stays small.
export const FEATS_PANEL = { x: 240, y: 90, w: 800, h: 540 };
export const FEATS_CLOSE = { x: 990, y: 102, w: 36, h: 36 };

export function drawFeatsPanel(ctx, g) {
  ctx.fillStyle = 'rgba(8,6,12,0.88)';
  ctx.fillRect(0, 0, 1280, 720);
  ctx.fillStyle = '#1e1b3a';
  roundRectPath(ctx, FEATS_PANEL.x, FEATS_PANEL.y, FEATS_PANEL.w, FEATS_PANEL.h, 16); ctx.fill();
  ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 2;
  roundRectPath(ctx, FEATS_PANEL.x, FEATS_PANEL.y, FEATS_PANEL.w, FEATS_PANEL.h, 16); ctx.stroke();
  centreText(ctx, 'FEATS — ' + featCount(g) + '/16', 640, 132, 'bold 26px Georgia, serif', '#ffd94d');
  ctx.fillStyle = '#d4a017';
  roundRectPath(ctx, FEATS_CLOSE.x, FEATS_CLOSE.y, FEATS_CLOSE.w, FEATS_CLOSE.h, 8); ctx.fill();
  centreText(ctx, '✕', FEATS_CLOSE.x + 18, FEATS_CLOSE.y + 19, 'bold 16px system-ui, sans-serif', '#1a120b');
  FEATS.forEach((f, i) => {
    const col = i < 8 ? 0 : 1;
    const row = i % 8;
    const x = 280 + col * 380, y = 176 + row * 44;
    const got = g.feats && g.feats[f.id];
    ctx.fillStyle = got ? '#ffd94d' : '#8a7a5c';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText((got ? '★ ' : '· ') + f.name, x, y);
    ctx.fillStyle = '#b8a67c';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText(f.desc, x, y + 17);
  });
  centreText(ctx, 'click ✕ or press F to close', 640, 596, '12px system-ui, sans-serif', '#8a7a5c');
}

export function drawTitleBackdrop(ctx, now) {
  // Harbour sky, sun, skyline, lighthouse beam and water ripples.
  drawHarbour(ctx, now);
  // Hanging string lanterns, draped on the left and right edges only,
  // so the strings never cross the centred title.
  for (const [x0, x1, y0, sag] of [[0, 330, 22, 34], [950, 1280, 22, 34], [0, 260, 48, 30], [1020, 1280, 48, 30]]) {
    ctx.strokeStyle = 'rgba(26,18,11,0.8)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, y0 + sag * 2, x1, y0); ctx.stroke();
    for (let x = x0 + 36; x < x1 - 10; x += 68) {
      const t = (x - x0) / (x1 - x0);
      const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * (y0 + sag * 2) + t * t * y0;
      const sway = Math.sin(now * 0.8 + x) * 2;
      ctx.strokeStyle = 'rgba(26,18,11,0.8)';
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + sway, y + 12); ctx.stroke();
      ctx.fillStyle = '#ffb347';
      ctx.beginPath(); ctx.arc(x + sway, y + 20, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,179,71,0.35)';
      ctx.beginPath(); ctx.arc(x + sway, y + 20, 11, 0, Math.PI * 2); ctx.fill();
    }
  }
  // Water ripples live in drawHarbour (ui/titleHarbour.js).
}

export function drawHero(ctx, now) {
  // Chef mascot beside the steaming hero dish.
  drawChefMascot(ctx, 540, 330, 0.95);
  const glow = ctx.createRadialGradient(735, 335, 8, 735, 335, 90);
  glow.addColorStop(0, 'rgba(255,217,77,0.35)');
  glow.addColorStop(1, 'rgba(255,217,77,0)');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(735, 335, 90, 0, Math.PI * 2); ctx.fill();
  const dish = dishById('tide-special');
  if (dish) drawDishPlate(ctx, dish, 735, 335, 50, now);
  drawSteamWisps(ctx, 735, 296, now, 5);
}

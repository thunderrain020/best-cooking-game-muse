// Ember & Tide — render/chef.js
// The top-down chef: white hat, teal shirt, cream apron, facing direction,
// the held ingredient or prepped dish carried on a small plate in front,
// and fading footstep dust. drawRoute is the dashed golden guide from the
// chef through the order's next stations to the island and the bell.

import { drawIngredientIcon } from './foodArt.js';
import { plateBase } from './plates.js';
import { routeWaypoints } from '../systems/route.js';

export function drawRoute(ctx, g) {
  const { line, stops } = routeWaypoints(g);
  if (line.length < 2) return;
  ctx.save();
  ctx.strokeStyle = 'rgba(255,217,77,0.95)';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.setLineDash([12, 10]);
  ctx.lineDashOffset = -((performance.now() / 60) % 22);
  ctx.beginPath();
  ctx.moveTo(line[0].x, line[0].y);
  for (let i = 1; i < line.length; i++) ctx.lineTo(line[i].x, line[i].y);
  ctx.stroke();
  ctx.setLineDash([]);
  // Numbered stop badges (1 -> 2 -> 3) on each waypoint. The corridor
  // waypoints sit in the open floor between the island and the bottom
  // station headers, so no badge ever crosses a label or dish title.
  stops.forEach((s, i) => {
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath(); ctx.arc(s.x, s.y, 9, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(s.x, s.y, 9, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#1a120b';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), s.x, s.y + 0.5);
    ctx.textBaseline = 'alphabetic';
  });
  ctx.restore();
}

export function drawChef(ctx, g, now) {
  const c = g.chef;
  // Footstep dust trail, fading behind the chef.
  for (const t of c.trail) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, 0.5 * (1 - t.t / 0.9));
    ctx.fillStyle = '#d8c49a';
    ctx.beginPath(); ctx.arc(t.x, t.y, 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  // Contact shadow.
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath(); ctx.ellipse(c.x, c.y + 14, 18, 7, 0, 0, Math.PI * 2); ctx.fill();
  const dx = c.dir === 'left' ? -1 : c.dir === 'right' ? 1 : 0;
  const dy = c.dir === 'up' ? -1 : c.dir === 'down' ? 1 : 0;
  const fx = c.x + dx * 4, fy = c.y + dy * 4;
  // Body: teal shirt ring, cream apron, ink outline.
  ctx.fillStyle = '#2e7d6b';
  ctx.beginPath(); ctx.arc(c.x, c.y, 16, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(c.x, c.y, 16, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath(); ctx.arc(fx, fy + 2, 11, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(fx, fy + 2, 11, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#2e7d6b';
  ctx.fillRect(fx - 6, fy + 6, 12, 4);
  // Head + tall white chef hat, leaning toward the facing direction.
  const hx = c.x + dx * 5, hy = c.y - 12 + dy * 3;
  ctx.fillStyle = '#f2c89a';
  ctx.beginPath(); ctx.arc(hx, hy, 8, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(hx, hy, 8, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(hx - 5, hy - 8, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(hx + 5, hy - 8, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(hx - 10, hy - 12, 20, 8);
  ctx.strokeStyle = '#1a120b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(hx - 5, hy - 8, 6, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(hx + 5, hy - 8, 6, 0, Math.PI * 2); ctx.stroke();
  // Eyes toward the facing direction.
  ctx.fillStyle = '#1a120b';
  ctx.beginPath(); ctx.arc(hx + dx * 3 - 3, hy + dy * 2, 1.4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(hx + dx * 3 + 3, hy + dy * 2, 1.4, 0, Math.PI * 2); ctx.fill();
  // Carried item on a small ceramic plate held out in front, with a
  // wisp of steam so hot food reads as hot.
  if (g.hand) {
    const px = c.x + dx * 24, py = c.y + dy * 24 + 6;
    ctx.save();
    ctx.translate(px, py);
    plateBase(ctx, 12);
    drawIngredientIcon(ctx, g.hand.id, 0, -1, 9);
    ctx.strokeStyle = 'rgba(255,244,220,0.85)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    const sway = Math.sin(now * 2) * 2;
    ctx.beginPath();
    ctx.moveTo(-4 + sway, -12);
    ctx.quadraticCurveTo(-7 + sway, -17, -4 + sway, -22);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(4 - sway, -12);
    ctx.quadraticCurveTo(7 - sway, -17, 4 - sway, -22);
    ctx.stroke();
    ctx.restore();
  }
}

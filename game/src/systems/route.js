// Ember & Tide — systems/route.js
// The golden route guide: chef -> the active order's next required
// station(s) -> plating island -> pass bell. Empty when nothing is in
// flight. The most urgent ticket (least patience left) decides the route.
// V5: the route is a numbered plan (routePlan), drawn through the open
// floor corridor between the island and the bottom station headers
// (routeWaypoints), with an estimated walk time (routeSummary), BATCH
// detection, and a CLEAN ROUTE bonus when a dish is served in sequence.

import { INGREDIENTS } from '../data/recipes.js';
import { STATION_AT, ISLAND_RECT } from '../render/layout.js';
import { CLEAN_ROUTE_BONUS } from '../core/state.js';

// The open floor corridor: between the island's bottom edge and the top
// of the bottom station headers. The dashed line and the numbered stop
// circles live here, never on a station label or a dish title. V6: the
// corridor sits at y 494, 7px higher than V5, so the line and the stop
// badges clear the SIMMER POT and GARNISH tag pills (tops at y 504).
export const ROUTE_Y = 494;
const CHEF_SPEED = 340; // px/s, matches systems/chef.js

export function routeFor(g) {
  const pts = [];
  const S = { board: STATION_AT.board0, wok: STATION_AT.wok0, pot: STATION_AT.pot };
  const stationFor = (id) => S[INGREDIENTS[id].station];
  if (g.hand) {
    if (g.hand.kind === 'raw') pts.push(stationFor(g.hand.id));
    pts.push(STATION_AT.island, STATION_AT.bell);
    return pts;
  }
  if (g.plate.dishId) return [STATION_AT.bell];
  if (!g.tickets.length) return pts;
  const t = [...g.tickets].sort((a, b) => a.left - b.left)[0];
  const missing = t.dish.comps.filter((c) => !g.plate.items.includes(c) && !g.tray.includes(c));
  if (missing.length) pts.push(stationFor(missing[0]));
  pts.push(STATION_AT.island, STATION_AT.bell);
  return pts;
}

// The ideal station sequence for one dish: its components' stations in
// recipe order (deduped), then plate, then bell. Keys are the act keys.
export function idealStops(dish) {
  const stops = [];
  for (const c of dish.comps) {
    const key = INGREDIENTS[c].station === 'board' ? 'board' : INGREDIENTS[c].station;
    if (stops[stops.length - 1] !== key) stops.push(key);
  }
  stops.push('plate', 'bell');
  return stops;
}

// The active plan: the most urgent ticket's dish, or the hand / plate.
export function routePlan(g) {
  if (g.hand) {
    const stops = [];
    if (g.hand.kind === 'raw') stops.push(INGREDIENTS[g.hand.id].station === 'board' ? 'board' : INGREDIENTS[g.hand.id].station);
    stops.push('plate', 'bell');
    return { dishId: null, stops };
  }
  if (g.plate.dishId) return { dishId: g.plate.dishId, stops: ['bell'] };
  if (!g.tickets.length) return { dishId: null, stops: [] };
  const t = [...g.tickets].sort((a, b) => a.left - b.left)[0];
  return { dishId: t.dishId, stops: idealStops(t.dish) };
}

// Display waypoints for the dashed guide: board stops keep their stand
// point (left side, open floor); everything else is projected onto the
// corridor at ROUTE_Y. Detours route the line around the island instead
// of across it: the left gap (x 300) and the right gap (x 700).
function corridorPoint(p) {
  if (p.x <= 210) return { x: p.x, y: p.y, stop: true };
  return { x: p.x, y: ROUTE_Y, stop: true };
}

function crossesIsland(a, b) {
  // The island rect grown by 1px: the route corridor runs 2px below
  // the island's bottom edge, so a fatter margin would flag the corridor
  // itself as a crossing and add a spurious detour jog.
  const x0 = ISLAND_RECT.x - 1, x1 = ISLAND_RECT.x + ISLAND_RECT.w + 1;
  const y0 = ISLAND_RECT.y - 1, y1 = ISLAND_RECT.y + ISLAND_RECT.h + 1;
  if (Math.max(a.x, b.x) < x0 || Math.min(a.x, b.x) > x1) return false;
  if (Math.max(a.y, b.y) < y0 || Math.min(a.y, b.y) > y1) return false;
  const t = (x0 - a.x) / (b.x - a.x);
  if (t >= 0 && t <= 1) { const y = a.y + t * (b.y - a.y); if (y >= y0 && y <= y1) return true; }
  const t2 = (x1 - a.x) / (b.x - a.x);
  if (t2 >= 0 && t2 <= 1) { const y = a.y + t2 * (b.y - a.y); if (y >= y0 && y <= y1) return true; }
  return (a.x >= x0 && a.x <= x1 && a.y >= y0 && a.y <= y1) || (b.x >= x0 && b.x <= x1 && b.y >= y0 && b.y <= y1);
}

export function routeWaypoints(g) {
  const pts = routeFor(g);
  if (!pts.length) return { line: [], stops: [] };
  const stops = pts.map(corridorPoint);
  const line = [{ x: g.chef.x, y: g.chef.y }];
  for (const s of stops) {
    const cur = line[line.length - 1];
    if (crossesIsland(cur, s)) {
      line.push(cur.x < ISLAND_RECT.x ? { x: 300, y: ROUTE_Y } : { x: 700, y: ROUTE_Y });
    }
    line.push({ x: s.x, y: s.y });
  }
  return { line, stops };
}

// Estimated walk time for the HUD Route Planner pill, from the polyline.
export function routeSummary(g) {
  const { line, stops } = routeWaypoints(g);
  let len = 0;
  for (let i = 1; i < line.length; i++) len += Math.hypot(line[i].x - line[i - 1].x, line[i].y - line[i - 1].y);
  return { stops: stops.length, seconds: len / CHEF_SPEED, batch: batchShared(g) };
}

// BATCH ×2: two active tickets share one prepped ingredient (on the
// tray or already on the plate). Returns the shared ingredient id.
export function batchShared(g) {
  const prepped = new Set([...g.tray, ...g.plate.items]);
  if (!prepped.size) return null;
  const seen = {};
  for (const t of g.tickets) {
    for (const c of t.dish.comps) {
      if (!prepped.has(c)) continue;
      if (seen[c]) return c;
      seen[c] = t.dishId;
    }
  }
  return null;
}

// Record a station visit for the clean-route check (deduped runs).
export function recordVisit(g, key) {
  if (!key) return;
  const v = g.routeVisited;
  if (v[v.length - 1] !== key) v.push(key);
  if (v.length > 12) v.shift();
}

// True when the ideal stops appear in order inside the visited log.
export function cleanRouteCheck(g, dish) {
  const ideal = idealStops(dish);
  let j = 0;
  for (const v of g.routeVisited) {
    if (v === ideal[j]) j++;
    if (j === ideal.length) return true;
  }
  return false;
}

export function cleanRouteBonus(g) {
  return CLEAN_ROUTE_BONUS;
}

// Ember & Tide — systems/pathing.js
// Grid A* pathfinding for stroll-to-act: the island and counters block
// straight lines, so the chef follows a path over 26px cells (blocked
// when a centre lies inside an obstacle expanded by the chef's radius).
// A clear direct segment needs no path. Space / E interaction lives in
// systems/pathingActions.js (split out so both stay under 5 KB).

import { obstacles } from '../render/layout.js';

const RADIUS = 13;
const CELL = 26, COLS = 40, ROWS = 19, OY = 168;
function cellBlocked(cx, cy) {
  const x = cx * CELL + CELL / 2, y = OY + cy * CELL + CELL / 2;
  return obstacles().some((r) => x > r.x - RADIUS && x < r.x + r.w + RADIUS && y > r.y - RADIUS && y < r.y + r.h + RADIUS);
}

function toCell(x, y) {
  return {
    cx: Math.max(0, Math.min(COLS - 1, Math.floor(x / CELL))),
    cy: Math.max(0, Math.min(ROWS - 1, Math.floor((y - OY) / CELL))),
  };
}

function cellCenter(c) {
  return { x: c.cx * CELL + CELL / 2, y: OY + c.cy * CELL + CELL / 2 };
}

// The walkable cell nearest the given cell (a target often sits just
// outside an obstacle, in a blocked cell).
function nearestWalkable(cell) {
  if (!cellBlocked(cell.cx, cell.cy)) return cell;
  for (let ring = 1; ring < 12; ring++) {
    for (let dy = -ring; dy <= ring; dy++) {
      for (let dx = -ring; dx <= ring; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== ring) continue;
        const nx = cell.cx + dx, ny = cell.cy + dy;
        if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue;
        if (!cellBlocked(nx, ny)) return { cx: nx, cy: ny };
      }
    }
  }
  return null;
}

// One slab of the segment-vs-expanded-rect test. Returns the [tmin,tmax]
// pair (mutated in place), or null when the segment misses the slab.
function slab(d, p, lo, hi, t) {
  if (Math.abs(d) < 1e-9) return p >= lo && p <= hi ? t : null;
  let ta = (lo - p) / d, tb = (hi - p) / d;
  if (ta > tb) { const s = ta; ta = tb; tb = s; }
  t[0] = Math.max(t[0], ta); t[1] = Math.min(t[1], tb);
  return t[0] <= t[1] ? t : null;
}

// True when the segment stays clear of every obstacle (expanded by the
// chef's radius), so the chef can walk it straight.
export function segmentClear(x1, y1, x2, y2) {
  for (const r of obstacles()) {
    const t = [0, 1];
    if (slab(x2 - x1, x1, r.x - RADIUS, r.x + r.w + RADIUS, t) && slab(y2 - y1, y1, r.y - RADIUS, r.y + r.h + RADIUS, t)) return false;
  }
  return true;
}

function findPath(sx, sy, tx, ty) {
  // The chef can start inside an obstacle's expanded zone (a bad restore
  // or a staged position); begin from the nearest walkable cell instead.
  const start = nearestWalkable(toCell(sx, sy)) || toCell(sx, sy);
  const goal = nearestWalkable(toCell(tx, ty));
  if (!goal) return [];
  const key = (cx, cy) => cy * COLS + cx;
  const h = (cx, cy) => {
    const dx = Math.abs(cx - goal.cx), dy = Math.abs(cy - goal.cy);
    return Math.max(dx, dy) + (Math.SQRT2 - 1) * Math.min(dx, dy);
  };
  const open = [{ cx: start.cx, cy: start.cy, g: 0, f: h(start.cx, start.cy), parent: null }];
  const gScore = new Map([[key(start.cx, start.cy), 0]]);
  const closed = new Set();
  while (open.length) {
    let bi = 0;
    for (let i = 1; i < open.length; i++) if (open[i].f < open[bi].f) bi = i;
    const cur = open.splice(bi, 1)[0];
    const ck = key(cur.cx, cur.cy);
    if (closed.has(ck) || cur.g > (gScore.get(ck) ?? Infinity)) continue;
    closed.add(ck);
    if (cur.cx === goal.cx && cur.cy === goal.cy) {
      const pts = [];
      let n = cur;
      while (n) { pts.unshift(cellCenter(n)); n = n.parent; }
      return pts;
    }
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = cur.cx + dx, ny = cur.cy + dy;
        if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue;
        if (cellBlocked(nx, ny)) continue;
        if (dx && dy && (cellBlocked(cur.cx + dx, cur.cy) || cellBlocked(cur.cx, cur.cy + dy))) continue;
        const nk = key(nx, ny);
        const ng = cur.g + (dx && dy ? Math.SQRT2 : 1);
        if (ng < (gScore.get(nk) ?? Infinity)) {
          gScore.set(nk, ng);
          open.push({ cx: nx, cy: ny, g: ng, f: ng + h(nx, ny), parent: cur });
        }
      }
    }
  }
  return [];
}

// Plan (and cache) the chef's path to his current target. A straight,
// clear segment needs no path; otherwise A* over the grid.
export function ensurePath(g) {
  const c = g.chef;
  if (c.tx === null || c.ty === null) return;
  if (c.pathTarget && c.pathTarget.x === c.tx && c.pathTarget.y === c.ty) return;
  if (segmentClear(c.x, c.y, c.tx, c.ty)) { c.path = []; c.pathTarget = { x: c.tx, y: c.ty }; return; }
  const pts = findPath(c.x, c.y, c.tx, c.ty);
  if (pts.length && Math.hypot(pts[0].x - c.x, pts[0].y - c.y) < 20) pts.shift();
  c.path = pts;
  c.pathTarget = { x: c.tx, y: c.ty };
}

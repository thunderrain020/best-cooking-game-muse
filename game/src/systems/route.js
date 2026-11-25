// Ember & Tide — systems/route.js
// The golden route guide: chef -> the active order's next required
// station(s) -> plating island -> pass bell. Empty when nothing is in
// flight. The most urgent ticket (least patience left) decides the route.

import { INGREDIENTS } from '../data/recipes.js';
import { STATION_AT } from '../render/layout.js';

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

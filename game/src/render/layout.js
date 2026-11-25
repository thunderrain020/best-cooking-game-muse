// Ember & Tide — render/layout.js
// V2 top-down spatial layout: one source of truth for every station rect,
// crate, the central plating island, the pass bell and the terrace edge.
// The kitchen floor runs x 0–1040, y 168–664; the terrace is x 1040–1280.
// The chef walks the open floor between the stations (see systems/chef.js).

export const W = 1280;
export const H = 720;
export const FLOOR = { x: 0, y: 168, w: 1040, h: 496 };
export const TERRACE = { x: 1040, y: 78, w: 240, h: 586 };

// Top perimeter counter: 10 pantry crates (keys 1-9, 0) + the trash bin.
// Slimmed 10px in V6 so the kitchen floor has more breathing room.
export function crateRect(i) {
  return { x: 16 + i * 86, y: 190, w: 78, h: 82 };
}
export const TRASH_RECT = { x: 892, y: 190, w: 112, h: 82 };

// Two chop boards, left column. Two sizzle woks, simmer pot and the
// garnish counter (which holds the prepped tray) along the bottom.
export const BOARD_RECTS = [
  { x: 16, y: 330, w: 180, h: 112 },
  { x: 16, y: 458, w: 180, h: 112 },
];
export const WOK_RECTS = [
  { x: 224, y: 540, w: 180, h: 112 },
  { x: 428, y: 540, w: 180, h: 112 },
];
export const POT_RECT = { x: 632, y: 540, w: 180, h: 112 };
export const GARNISH_RECT = { x: 836, y: 540, w: 180, h: 112 };

// Central plating island and the glowing pass bell at the terrace edge.
// The island is 160 tall so the route corridor (y 485-503) stays open
// between its bottom edge and the bottom station headers.
export const ISLAND_RECT = { x: 380, y: 332, w: 300, h: 160 };
export const BELL_RECT = { x: 872, y: 332, w: 144, h: 168 };

// Where the chef stands to use each station (just outside its rect).
export const STATION_AT = {
  board0: { x: 206, y: 386 },
  board1: { x: 206, y: 514 },
  wok0: { x: 314, y: 526 },
  wok1: { x: 518, y: 526 },
  pot: { x: 722, y: 526 },
  garnish: { x: 926, y: 526 },
  island: { x: 530, y: 514 },
  bell: { x: 944, y: 514 },
  trash: { x: 948, y: 292 },
};
export function crateAt(i) {
  const r = crateRect(i);
  // V6: stand 24px below the crate (y 296) — the counter-band obstacle
  // ends at y 292, and the chef's 13px push-out stalls 19px short of a
  // stand point any closer; 296 is 9px from the pushed position, inside
  // the 12px arrival radius. Same stand point as V5.
  return { x: r.x + r.w / 2, y: r.y + r.h + 24 };
}

// Every solid rect the chef cannot walk through (stations + counters).
export function obstacles() {
  return [
    { x: 8, y: 172, w: 1024, h: 120 }, // top counter band
    ...BOARD_RECTS, ...WOK_RECTS, POT_RECT, GARNISH_RECT, ISLAND_RECT, BELL_RECT,
  ];
}
export const CHEF_SPAWN = { x: 520, y: 520 };

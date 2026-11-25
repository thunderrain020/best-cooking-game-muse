# Ember & Tide — Rooftop Harbour Kitchen

A complete, original cooking game for make.fun
`best-cooking-game-20261125-0137` ("Make the best cooking game").

You run a sunset rooftop diner above the harbour. Tickets come in on the
order board; you chop, sizzle, simmer, plate and serve before patience runs
out. Serve fast for tips, chain serves for combos, and spend coins on kitchen
upgrades between shifts.

## How to play

- **1–8** (or click a pantry crate) to take an ingredient: prawn, fish, rice,
  noodle, egg, chilli, lime, herbs.
- **Chop board (Q)** — chilli, lime and herbs. Click or press Space to chop.
- **Sizzle wok (W)** — prawn, fish and egg. Pull them out inside the green
  PERFECT window (Space or click). Leave them and they burn.
- **Simmer pot (E)** — rice and noodles. It finishes itself; watch the bubbles.
- **Plating counter (R)** — click the prepped tray, then the plate, to stack
  a dish from the recipe ledger.
- **Pass bell (Space)** — ring it to serve the matching ticket.
- **L** recipe ledger, **M** mute, **Esc** close / drop what you are holding.
  Everything also works with the mouse alone.

## Depth

- 8 shared ingredients combine into **12 original dishes** (two four-part VIP
  signatures) across 4 stations plus the pass.
- 3–5 live tickets with patience bars, VIP tickets, combo multiplier, and two
  rush waves per shift (**Sunset Rush**, **Storm Rush**).
- Between shifts: a **kitchen upgrade shop** (sharper knives, copper wok,
  longer pass, calm waters, golden bell, big simmer pot) and a **recipe
  ledger** of all 12 dishes.
- Sound is synthesized live with the Web Audio API — sizzle, chop, bell —
  with zero audio files and zero network requests.

## Play it

No build step. Serve `game/` with any static server and open
`game/index.html` in desktop Chrome:

```sh
node serve.ts        # serves game/ on http://localhost:8080
```

## Files

- `game/index.html` — the page; `game/src/main.js` — bootstrap, loop, input
- `game/src/core/` — state, utilities, staged screenshot states
- `game/src/data/recipes.js` — ingredients, dishes, upgrades
- `game/src/systems/` — kitchen stations, order board, synthesized audio
- `game/src/render/` — canvas scene and vector food art
- `game/src/ui/hud.js` — title, upgrade shop, recipe ledger, help
- `screenshots/` — 4 real renders of the running game
- `main.ts` — hands `game/` + `screenshots/` to `/output` with `dossier.json`
- `vendor/makefun-game.ts` — the kit's library, unchanged

## License

MIT — see `LICENSE`.

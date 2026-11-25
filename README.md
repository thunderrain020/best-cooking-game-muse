# best-cooking-game-muse

[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/thunderrain020/best-cooking-game-muse/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/thunderrain020/best-cooking-game-muse/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

Ember & Tide is a complete, original cooking game: run a sunset rooftop diner above the harbour, turning 8 pantry ingredients into 12 original dishes across 5 shifts, then impress the Harbour Critic in the finale. Tickets come in on the order board; you chop, sizzle, simmer, plate and serve before patience runs out. Serve fast for tips, chain serves for combos, and spend coins on kitchen upgrades between shifts.

## Run it

```sh
node serve.ts        # serves game/ on http://localhost:8080
```

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
- A run is **5 shifts**: Shifts 1–4, then the **Critic Finale** on Shift 5,
  when the Harbour Critic orders the Tide & Ember Special. Win by clearing
  all 5 shifts and serving the Critic; lose if 3 tickets walk out or a
  shift target is missed. The HUD shows the WIN / LOSE objective and a
  5-shift roadmap.
- Between shifts: a **kitchen upgrade shop** (sharper knives, copper wok,
  longer pass, calm waters, golden bell, big simmer pot) **and a 6-relic
  draft** (Ember Charm, Storm Lantern, Golden Ladle, Harbour Star, Salt of
  the Tide, Critic's Quill). Owned upgrades and relics show as badges in the
  HUD. Best score and best shift persist in `localStorage` and show in the
  HUD and the end-of-run summary.
- Sound is synthesized live with the Web Audio API — sizzle, chop, bell —
  with zero audio files and zero network requests.

## Play it

No build step. Serve `game/` with any static server and open
`game/index.html` in desktop Chrome:

```sh
node serve.ts        # serves game/ on http://localhost:8080
```

## Files

- `game/index.html` — the page; `game/src/main.js` — bootstrap and loop
- `game/src/core/` — state, utilities, best-run persistence, staged shots
- `game/src/data/recipes.js` — ingredients and dishes
- `game/src/systems/` — kitchen, plating, orders, upgrades/relics, run flow, audio
- `game/src/render/` — palette, harbour backdrop, stations, tickets, pantry,
  particles, food art, plates, HUD bar
- `game/src/ui/` — title, shop, ledger, summary, help, input
- `screenshots/` — 4 real renders of the running game
- `main.ts` — hands `game/` + `screenshots/` to `/output` with `dossier.json`
- `vendor/makefun-game.ts` — the kit's library, unchanged

## License

MIT — see `LICENSE`.

---

<sub>Entered on [make.fun](https://make.fun/?ref={referral_code}&utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137) · AI agents build software for cash rewards</sub>

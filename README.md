# Four Atelier Dioramas — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/cimotsimilikitiw/spot-the-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/cimotsimilikitiw/spot-the-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)


[![Bounty](https://img.shields.io/badge/make.fun-best--spot--the--difference--game--20261121--0451-f5c542)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Repo](https://img.shields.io/badge/github-cimotsimilikitiw%2Fspot--the--difference-2ea44f)](https://github.com/cimotsimilikitiw/spot-the-difference)
[![Runtime](https://img.shields.io/badge/canvas2d-100%25%20offline%201280x720-38bdf8)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

An offline, zero-dependency 1280x720 Canvas2D dual-panel Spot the Difference game featuring four hand-crafted procedural dioramas, each with 10 distinct visual differences, a 2.2x brass magnifier loupe, radar hint pulses, combo streak multipliers, synthesized WebAudio SFX, and full mouse + keyboard controls.

## Dioramas

1. **Midnight Clockmaker's Workshop** (`workshop`) — Gears, pendulums, workbench tools, lantern light, and a sleeping cat.
2. **Harbor Night Market** (`market`) — Floating lanterns, moored boats, spice stalls, crescent moon, and harbor reflections.
3. **Botanical Conservatory** (`conservatory`) — Glasshouse arches, orchids, koi pond, hanging ferns, and brass watering can.
4. **Grand Observatory** (`observatory`) — Brass telescope, orrery planets, constellation dome, star charts, and astrolabe.

## Controls

- **Mouse**: Left-click on either panel to mark a difference. Hover with Magnifier Loupe active (`M` or `Z` or `Shift` or right-click) to inspect at 2.2x zoom with synchronized opposite-panel ghost reticle.
- **Keyboard**: `Arrow Keys` / `WASD` to move precision reticle, `Enter` / `Space` to mark, `H` for radar hint, `M` or `Z` or `Shift` to toggle Magnifier Loupe, `V` to toggle sound, `R` to restart, `Esc` for Stage Select.

## Local Run

```bash
node serve.ts
```

Then open `http://localhost:8080`.

To build the submission output tree:

```bash
MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

Built for [make.fun/bounty/best-spot-the-difference-game-20261121-0451](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451) · [MIT License](./LICENSE)

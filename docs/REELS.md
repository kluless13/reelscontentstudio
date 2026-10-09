# Worked examples — reels 01–03

Read the code of the reel closest to what you're making. Each one demonstrates a different
side of the kit.

## 01 · Gold standard — `src/reels/gold/` (`GoldReel`, ~13s)

"In 1971, money stopped being backed by gold…" → $1 from 1971 ≈ 12¢ today.

- **Match cuts:** coin → clock → globe live in one circle at a fixed spot (`CircleShot`,
  measured geometry in `shots.ts`), spun 360° through each cut at peak speed (`motion.ts`).
- **Parallax intro:** cash photo split into foreground + clean plate (`ParallaxStill`), then an iris
  closes onto the coin.
- Odometer headline + yellow fill on "gold.", rough marker loop, `$35 = 1 oz` mono counter callout,
  stamp, radio-wave ping on Washington D.C., orbiting currency chips, counter outro circled by hand.
- Shows: `curveProgress`/`curveSpeed`, `OdometerText`, `FillText`, `MarkerCircle`, `RadioWaves`, `Orbit`, `Stamp`.

## 02 · The 45-year round trip — `src/reels/bonds/` (`BondsReel`, ~40s)

10-year Treasury yield from 15.84% (1981) to 0.52% (2020) to a 24-year high, plus the mortgage cost.

- **Real news hook:** `NewsCard` on a captured article — torn edge, halftone, push-in, cursor
  clicks, highlighter + marker on "24-Year High". Needs `npm run news:bonds` first.
- **Data chart:** FRED `DGS10` monthly + pinned daily extremes (`dgs10.json`), `LineChart` drawn by
  `revealAt(frame)` (rewind, slide, climb), `ChartCamera` keyframes, `ChartCallout` auto-placed
  labels, dim-focus on the 2020 low, dashed line back to May 2002.
- **Payoff:** mortgage table from `MORTGAGE30US` with a counter and stamp, source line on screen.
- `PhraseCaptions` show digits while the voice reads words. Timing: `timing.ts` (watch `nth`
  anchors: "why" and "then" repeat).
- The chart rules in STYLE.md come from reviewing this reel.

## 03 · What your dollar used to be — `src/reels/dollar/` (`DollarReel`, ~23s)

Collage variant: $1 from each decade 1920–2020 in today's dollars (CPI).

- `PrintedPhoto` maps deliberately low-quality stills into a 4-colour system and covers them with
  a real halftone; `FramedPhoto` swaps per decade; `Posterize` gives stop-motion.
- `TypeOn` typewriter labels, Courier Prime figures, `CornerBrackets`, teal aside chip,
  `DecadeTimeline`, `PillCaptions`. Collage type set lives in `src/kit/collage/fonts.ts`.
- Fast decade flip on "decade after decade" — swaps computed from the VO in `timing.ts`.

## KitDemo — `src/reels/kit-demo/`

Every kit piece on its own panel: curve cut, fill text, random letters, odometer + counter, radio
waves, cursor, markups, spotlight, parallax. Render with `npm run render:kit` when you need to show
someone what's available.

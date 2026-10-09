# Style guide — the Vox kit

The visual rules for every reel in this repo, learned from the reference clips listed in
[REFERENCES.md](REFERENCES.md). Each rule says what it is, why it works, and which component builds it.
Read this before designing a reel; the review checklist at the bottom of [WORKFLOW.md](WORKFLOW.md) checks against it.

## 1. Cut the curve (match cuts)
*Source: "How does Vox make their cuts look so smooth"*

- Animate object A with **heavy ease-in-out** (slow → fast → slow).
- Object B inherits the *same* motion (same position/scale/rotation curve).
- **Hard cut at peak velocity**, the middle of the move. Motion blur and speed hide the swap.
- Measured on the reference: a ~1.8s move, cut lands at ~0.9s (the peak), shape changes circle → square and keeps travelling.
- **Our build:** `curveProgress(frame, cutFrame, duration)` drives both shots; swap the source on `cutFrame`, blur with `curveSpeed`. See `src/reels/gold/motion.ts` (a 360° spin through each cut).
- Put every match-cut subject in the same screen spot and size (`CircleShot` + measured circle geometry in `shots.ts`) so the swap is invisible.

## 2. Typography: one move at a time
*Source: "Vox text animations always feel so sophisticated"*

- **Fill animation:** letters pop in **Vox yellow** left→right (~0.3s), hold, then fade to **charcoal** (~1s) for legibility.
- **Random appearing letters:** letters appear in random order over ~0.5s (serif italic works best).
- **Odometer:** each letter rolls up from below like a slot machine, staggered left→right (~0.6s total).
- **Rule:** never run more than one text animation on screen at once. The viewer must always know where to look.
- Keep text small and centred, with lots of paper. House type is Geist / Geist Mono (see House rules).

## 3. Numbers: monospaced counters
*Source: "3 Easy VOX-style effects"*

- Count numbers in a **monospaced** face so digits don't jitter as they change.
- Present stats in a framed chip or rounded pill (`+56%`, `$600,000,000`).
- **Our build:** `MonoCounter` (Geist Mono, tabular figures).

## 4. Radio waves: location pings
*Source: "3 Easy VOX-style effects"*

- A dot appears, then **2–3 rings expand and fade** from it on a stagger (~1s per ring).
- Use for map locations, callouts, "it happened here". Pair with a label chip (e.g. `WBLK 93.7 / Buffalo, NY`).

## 5. Cursor element: screen treatment
*Source: "3 Easy VOX-style effects"*

- An animated arrow or hand cursor that moves, hovers and clicks over newspaper pages, websites and documents.
- Use whenever the content "lives on a computer". Add a halftone/screen texture to the page.

## 6. Parallax: make stills feel like video
*Source: "How Vox makes images look like videos"*

- Split a photo into **foreground / midground / background** layers and fill the holes behind cut-outs.
- Space the layers in depth and **slowly dolly/pan** the camera; layers move at different speeds.
- The difference between "iMovie slideshow" and "documentary".
- **Our build:** Higgsfield `remove_background` for the subject cut-out, an inpainted or regenerated clean plate for the background, then a Remotion `ParallaxStill` with 3 layers at different drift rates.

## 7. Markups: the invisible teacher's hand
*Sources: both "Vox markups" clips*

- Circles, arrows, underlines, outlines and "look here first" callouts give the frame a **hierarchy** when it has none.
- Draw them on with a trim-path effect (stroke draws itself), then **roughen the edges** for a hand-drawn look. Stack a second, finer roughen for a **chalky** texture.
- **Spotlight pattern:** desaturate or grey out the whole frame, then colour only the focal region and ping it.
- **Our build:** an SVG `feTurbulence + feDisplacementMap` roughen filter on every stroke. Components: `MarkerCircle`, `MarkerArrow`, `MarkerUnderline`, `RegionOutline`, `LookHere` (X mark + italic label).

## House look (seen across all refs)
- Off-white paper or **graph-paper grid** backgrounds; dark charcoal alternates.
- Textures: torn-paper edges, halftone/screen dots, archival maps and engravings, film grain.
- Accents: Vox yellow `#FFE600`-ish highlighter, signal red/orange, blue-violet marker strokes.
- Numbered pink/red badges for lists (`1`, `2`, `3`).
- Small caption chips at the bottom, not giant subtitles. One idea per shot; shots of ~1–2.5s.

## Where each rule lives in code (`src/kit`)
| Rule | Component |
|---|---|
| Cut the curve | `curveProgress`, `curveSpeed` (`curve.ts`) |
| Fill / random / odometer | `FillText`, `RandomLetters`, `OdometerText` (`text/`) |
| Mono counters | `MonoCounter` |
| Radio waves | `RadioWaves` |
| Cursor | `Cursor` (arrow/hand, click rings) |
| Parallax | `ParallaxStill` (layers from Higgsfield `remove_background` + a clean-plate edit) |
| Markups | `MarkerCircle`, `MarkerArrow`, `MarkerUnderline`, `RegionOutline`, `LookHere` (`texture`: clean / rough / chalk) |
| Spotlight | `Spotlight` |
| Background | `GridPaper` |

Every piece is shown on its own in the `KitDemo` composition (`npm run render:kit`).

## Data, news and brand pieces (added for reel 02)
| Piece | Component | Notes |
|---|---|---|
| Data line chart | `LineChart` + `ChartCamera` (`chart/`) | Real series, draws as `reveal` advances; camera keyframes zoom/follow; `makeProjector` pins annotations to (date, value); `toScreen` maps chart points to screen space for spotlights |
| News screenshots | `NewsCard` | Real captured pages only. Torn edge, tilt, drop shadow, halftone dots, paper fibre, push-in; marks (`highlight` / `underline` / `circle`) and cursor are given in the screenshot's own pixels |
| Logo | `BrandBug` | Truflation, bottom-right on every frame; charcoal on light scenes, white with `onDark` |
| Captions | `PhraseCaptions` | Phrase-level, readable on mute; shows "16%" while the voice says "sixteen percent" |

## House rules
- **Type:** Geist for everything, Geist Mono for numbers, labels and counters.
- **Brand:** Truflation logo bottom-right on every frame.
- **Data:** every on-screen number comes from a saved source (`data/`), not typed by hand; key points are read off the series.
- **News:** only real, published articles captured with `npm run capture -- <url> <out.png>`; never generate or mock up headlines. Screenshots stay local (git-ignored).
- **Narration:** `npm run tts -- scripts/reels/<name>.txt public/audio/<name>` (or the ElevenLabs MCP with timestamps); scenes key off spoken words via `createVoTrack`.
- **Series:** tag `MONEY, EXPLAINED · NN` top-left (`Chrome`), red progress bar, grain on top, 1080×1920 @ 30fps.
- **No overlaps:** text never overlaps text, numbers, captions, chart lines or the logo. Check stills at every annotation moment.

## Chart rules (learned from reel 02 review)
Nothing may overlap the data line or another label. The kit enforces most of this:

1. **Labels live in gutters, never in the plot.** Y labels sit right-aligned to the left of the plot rect, x labels sit below the baseline. `RECT` is the plot area only.
2. **Pad the domain on every side** so the line never touches an edge, a gutter label or an annotation (≈3% left/right, ≈10% headroom above the max).
3. **Annotations are solid chips with a leader line** (`ChartCallout`): a ringed dot on the data point, a line, and a dark chip with title + sub. Never bare text over data, and never an unexplained symbol like a lone X.
4. **Auto-place, don't hand-place.** `ChartCallout` searches positions near the point and picks the closest one that is inside the plot, inside what the camera can see (`visibleRect`), clear of the drawn line (`hitsLine`) and clear of any `avoid` boxes (photos, other labels). In Studio, a label that can't find clear space gets a pink dashed outline; fix it before rendering.
5. **Focus by dimming, not clipping.** To spotlight part of a series, grey out the rest of the line (`focus` prop) and keep the focus segment red. Circle spotlights cut through lines and labels.
6. **Annotations render above the data layer**, outside any dim, clip or spotlight effect, so they stay one colour.
7. **One thing at a time.** A photo card leaves before a callout lands in the same space.
8. **No 1-px artefacts.** The area fill fades in only once the line has width.
9. **Readouts stay off the plot.** Big numbers (year, value) live in a header above the chart, read straight off the data.

## Collage rules (reel 03 · from "How to hide low quality images")
*Kit: `src/kit/collage`*

1. **Build a colour system first.** Four colours, picked from strong references: cream `#f6f2d7`, charcoal `#2b3134`, pink `#e8365d`, off-white `#f2f1ea` (teal `#5cbcc3` for the odd label chip). Nothing else on screen.
2. **Tint every photo into it** (`PrintedPhoto`): blacks → charcoal, whites → cream, dialled back slightly (`tint` ≈ 0.9) so they don't look flat.
3. **Hide low-quality images with high-quality texture**: a real amplitude-modulated halftone (dot size follows darkness, staggered rows) + fine grain. 420px, heavily compressed JPEGs read as print, not as low-res.
4. **Stop-motion feel**: `Posterize` (hold every 2 frames) on the collage layer; each photo swaps in with a random tilt and a little snap, inside a thick charcoal frame (`FramedPhoto`).
5. **Type set (collage reels only; Geist stays the series default):** Fraunces for big display words, Playfair Display Italic for overlapping white words, Oswald caps in pink pill captions (`PillCaptions`), Special Elite typewriter for labels/years (`TypeOn`), Courier Prime for figures (monospaced, so numbers never jitter).
6. **Marks**: pink `CornerBrackets` draw out from the corners to frame the key figure; a pink knock-out box behind the key word; teal chip for asides; `DecadeTimeline` with a hopping pink dot.
7. **Overlaps**: words may overlap a *photo* (that's the collage look), never another word, number or caption. Captions stay on one line.

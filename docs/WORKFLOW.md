# Workflow — from topic to finished reel

Most of the quality is decided before anything is rendered. This is the process that produced
reels 01–03; follow it in order and stop at the three checkpoints (✋).

## 1. Align ✋

Ask the user up to three multiple-choice questions, recommended option first:

- **Angle** — e.g. for "10-year yields": *history-led round trip* / *what it costs you* / *why it's rising*.
- **Length** — 25s (punchy), ~40s (standard), 60–90s (YouTube Shorts long form).
- **Screenshots** — agent finds and captures, user supplies, or a mix.

Then present a **beat table** (time · beat · draft narration · visuals) and get a yes.

## 2. Research and data

- Pull every series you'll quote into `data/` (`npm run fred -- SERIES …`). Write a tiny script to
  compute each on-screen figure (peaks, lows, "highest since", averages, payments) and print it.
- Report the numbers back with sources. Flag contradictions — e.g. an article saying "highest since
  2007" when the data now says 2002 — and adjust what you highlight.
- Save chart-ready data next to the reel (`src/reels/<reel>/<series>.json`), pinning exact extremes
  and the latest value so readouts land on the published figures.

## 3. Screenshots ✋

- Capture real, published pages: `npm run capture -- <url> public/news/<name>-raw.png 1100 900`.
- Crop to the article (`ffmpeg -i raw.png -vf crop=w:h:x:y out.png`), show the crops to the user.
- Decide what gets highlighted (the 2–4 words that carry the story).

## 4. Script ✋

- ~2.6 words per second at speed 1.1 → 80–110 words for 40s.
- Write numbers the way they're spoken ("five point three percent", "two thousand two"); the
  on-screen captions show digits (`PhraseCaptions`).
- Short sentences, one idea each; the hook in the first 3 seconds; a "why it matters" payoff.
- Save to `scripts/reels/<reel>.txt` and lock it with the user.

## 5. Shot list

One row per beat: start word, duration, visual, kit component, SFX. Rules of thumb:

- One idea per shot, ~1–2.5s each; one text animation on screen at a time.
- Alternate texture: photo/clipping → chart → typography → photo.
- Use a match cut or "cut the curve" spin when the subject's shape repeats across scenes.
- Give markups a job: circle the number, underline the phrase, spotlight the moment.

## 6. Assets

| Asset | How | Where |
|---|---|---|
| Narration + word timings | ElevenLabs TTS with timestamps (MCP or `npm run tts`) | `public/audio/<reel>/vo.mp3`, `vo-words.json` |
| Music bed | ElevenLabs music (MCP or `npm run music`), 2–3s longer than the reel | `public/audio/<reel>/music.mp3` |
| SFX | reuse `public/audio/sfx/`; add with `npm run sfx -- name "prompt" secs` | `public/audio/sfx/<name>.mp3` |
| Archival stills | Higgsfield `gpt_image_2_5` (cheap, photographic) | `public/assets/` or `public/<reel>/` |
| Parallax layers | `remove_background` on a still + a "remove the subject" edit for the clean plate | same |
| Collage photos | generate at `quality: low` — the halftone treatment hides it | `public/<reel>/` |

Voice used so far: ElevenLabs "Eric" (`cjVigY5qzO86Huf0OWal`), stability 0.45, style 0.35, speed 1.1.
Check the generated stills before using them (open them; look for text artefacts and anatomy).

## 7. Build

1. `cp -r src/reels/_template src/reels/<reel>` and rename the component/exports.
2. Point `timing.ts` at `public/audio/<reel>/vo-words.json`; define beats with `voFrame("word")`.
3. Build scenes as separate files; assemble in `<Name>Reel.tsx`; add `cues.ts`; register in `src/Root.tsx`.
4. Measure the music's energy if you want hits to land on beats:
   `ffmpeg -i music.mp3 -af "asetnsamples=n=22050,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level" -f null -`

## 8. Verify

- `npm run typecheck`.
- Render stills at every beat, every annotation landing and every cut (`npm run still`). Tile them
  with ffmpeg `hstack` and actually look. Fix overlaps, wrong `nth` word anchors, clipped text.
- Render the MP4; pull frames from the **file** at a few timestamps and check audio levels
  (`ffmpeg -i out.mp4 -af volumedetect -f null -` → mean ≈ −20 dB, max below −1 dB).

### Review checklist

- [ ] Hook lands in 3s; series tag, progress bar, logo and grain present
- [ ] Every figure traceable to `data/` or a cited source; source line on screen
- [ ] Screenshots are real and approved; highlights match the narration
- [ ] No text overlaps anything (chart rules in STYLE.md)
- [ ] Captions readable on mute, one line where possible
- [ ] One text animation at a time; markups have a purpose
- [ ] Cuts land on spoken words / music hits; no dead air longer than ~1s

## 9. Hand off

Send the MP4 and summarise: the beats, where each number comes from, credits spent, and anything
the user should double-check (e.g. a figure that will change if the data updates).

# Reels Content Studio

A working studio for **Vox-style informational shortform**: 9:16 explainer reels with paper
textures, archival stills, match cuts, hand-drawn markups, real data charts and real news
screenshots, narrated and cut to the voice. Built with [Remotion](https://www.remotion.dev)
(React video), with stills from **Higgsfield** and voice/music/SFX from **ElevenLabs**.

It's designed to be driven by an AI coding agent (Claude Code, Codex, Cursor…). You bring the
topic and the judgement; the agent researches, scripts, generates assets and builds the edit.

| Reel | What it shows |
|---|---|
| **01 · Gold standard** | Match cuts through a moving circle, parallax intro, odometer + fill text, markups |
| **02 · The 45-year round trip** | Real news clipping with highlights, animated FRED chart with auto-placed callouts, mortgage maths |
| **03 · What your dollar used to be** | Collage style: low-quality photos rescued with tint + halftone, typewriter labels, decade timeline |

## Quick start

Requirements: **Node 20+**, **ffmpeg**, **Python 3** (for the helper scripts).

```bash
git clone https://github.com/kluless13/reelscontentstudio.git
cd reelscontentstudio
npm install
npm run studio            # opens Remotion Studio — pick a reel on the left and scrub
```

Render the finished reels:

```bash
npm run render:gold
npm run news:bonds        # reel 02 needs its two news screenshots captured locally first
npm run render:bonds
npm run render:dollar
npm run render:kit        # a tour of every motion component
```

Videos land in `out/`.

## Working with your agent

1. **Connect your own tools** in your agent: the **Higgsfield MCP** and the **ElevenLabs MCP**.
   Nothing in this repo contains keys. (If you'd rather use the scripts, copy `.env.example` to
   `.env` and add your ElevenLabs key; `.env` is git-ignored.)
2. **Open the repo in your agent.** It reads `AGENTS.md` / `CLAUDE.md` automatically. That file
   tells it the scope, the house rules and the workflow.
3. **Ask for a reel**, e.g. *"Make reel 04 about why rent has outpaced wages since 2010, ~40s."*
   In Claude Code you can also run `/vox-reel`.
4. **Expect three checkpoints** where the agent stops for you: the angle/beat plan, the news
   screenshots, and the locked script. It will also quote credit costs before generating.
5. **Review** the MP4. Give notes like "push in harder on the headline" or "swap the 1981 photo"
   — changes after the build are cheap.

### What to give the agent for the best results

- A clear question the reel answers, and who it's for.
- Any articles or data you want used (links are fine).
- Reference clips for a new technique: save locally in `references/` (git-ignored) and tell the
  agent to study them. It pulls frames, measures timing, writes up the technique in
  `docs/STYLE.md` and builds a component for it.

## What's in here

```
AGENTS.md / CLAUDE.md     agent operating manual (start here if you're an agent)
docs/
  STYLE.md                the Vox kit: visual rules + which component builds each one
  WORKFLOW.md             topic → data → screenshots → script → assets → build → verify
  TOOLS.md                Higgsfield / ElevenLabs models, costs, gotchas; data + capture tools
  REELS.md                walkthrough of reels 01–03 as worked examples
  REFERENCES.md           the tutorials the style was learned from
src/
  kit/                    reusable motion pieces (text, markups, charts, collage, news cards…)
  components/             series building blocks (captions, tag + progress bar, stamps, sound)
  reels/<reel>/           one folder per reel; _template/ to start a new one
  theme.ts                fonts (Geist / Geist Mono), colours, 1080×1920 @ 30fps
public/                   assets used by reels: audio/<reel>/, audio/sfx/, assets/, decades/, news/
data/                     source datasets (FRED CSVs)
scripts/                  tts, music, sfx, FRED download, news capture, reel scripts (.txt)
.claude/skills/vox-reel/  the /vox-reel skill for Claude Code
```

## House rules (short version)

- Every number on screen comes from a saved source in `data/`; source line on screen.
- Only real news articles, captured locally; never fake headlines. Screenshots aren't committed.
- Geist / Geist Mono, "MONEY, EXPLAINED · NN" tag, Truflation logo bottom-right, grain on top.
- Nothing overlaps: text, numbers, captions, chart lines and the logo each get their own space.
- One idea per shot, one text animation at a time, cuts land on spoken words.

Full rules: [docs/STYLE.md](docs/STYLE.md).

## Contributing

Work happens on branches and lands through pull requests — see [CONTRIBUTING.md](CONTRIBUTING.md)
for branch names, what a good PR includes, and how to review. Pitch new reels with the
**Reel idea** issue template. CI runs a typecheck, a guard against keys/screenshots/videos, and a
test render on every PR.

## Troubleshooting

**Render fails with `Target closed` / `icudtl.dat not found` (macOS).** The repo is inside a
protected folder (Downloads, Desktop, Documents), so macOS blocks Remotion's headless Chrome.
Either move the repo (e.g. `~/code/reelscontentstudio`) or copy the browser out once:

```bash
npx remotion browser ensure
mkdir -p ~/.cache/remotion
cp -R node_modules/.remotion/chrome-headless-shell ~/.cache/remotion/
```

`remotion.config.ts` uses that copy automatically when it exists.

**Reel 02 shows missing images.** Run `npm run news:bonds` (needs ffmpeg). If the sites changed
their layout, adjust the crop numbers in `scripts/news-bonds.sh`.

**`ELEVENLABS_API_KEY not set`.** Use the ElevenLabs MCP, or create `.env` from `.env.example`.
ElevenLabs keys start with `sk_`.

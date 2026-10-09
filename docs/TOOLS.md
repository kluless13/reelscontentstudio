# Tools — Higgsfield, ElevenLabs, data, capture

Everyone brings their own accounts. Connect the MCP servers in your agent (Claude Code:
`claude mcp add …` or your connector settings) — nothing in this repo holds credentials.

## Higgsfield (MCP)

Used for archival-style stills, parallax layers and optional B-roll. Always preflight cost with
`get_cost: true` on one call, and tell the user the total before a batch.

| Job | Model / tool | Notes | Approx. cost |
|---|---|---|---|
| Archival photos, props, textures | `generate_image` · `gpt_image_2_5` | Photographic, follows "no legible text" well. `quality: "low"` for collage reels | 0.25 cr |
| Edits with a reference (clean plates, consistent subject) | `generate_image` · `nano_banana_2_1` | Pass the source as `image_references` (a prior job id works) | 2 cr @2k |
| Parallax cut-out | `remove_background` | Returns a transparent PNG of the subject | low |
| Film-grade stills | `cinematic_studio_2_5` | Up to 4K | 2 cr |
| Moving B-roll with period look | `generate_video` · `cinematic_studio_video_4_0` | Era / lens / lighting / colour controls, 4–30s | 35 cr / 5s @720p |
| Cheap B-roll drafts | `generate_video` · `seedance_2_5` with `draft: true` | 480p; finalise only keepers (`draft_job_id`, ~60 cr) | 12 cr / 4s |
| One-off effects | Marketplace app **Match Cut + Tracelab** (`apps_search` → `apps_describe` → `apps_invoke`, poll `get_render`) | Tracelab object tracking, VHS, search-result cuts, face match cuts (real photos only). Outputs are 3s 720p; inputs must be public HTTPS image URLs (a Higgsfield result URL works) | — |

Gotchas:
- **Preset swaps:** a submission may fail with `preset_recommendation`. Resubmit with
  `declined_preset_id: "<id>"` to keep your own shot.
- **Rate limit:** ~8 concurrent jobs per model. Batch, then `jobs_wait` (max 12 ids per call).
- Download results with `curl -fL -o file <result_url>` into `public/…`; keep the job id if you
  may want to reference or finalise it later.
- Generated images must not depict real people or third-party logos.

## ElevenLabs

Use the MCP if connected; otherwise put your own key in `.env` (copy `.env.example`) and use the
scripts. Keys start with `sk_`.

| Job | MCP | Script fallback |
|---|---|---|
| Narration **with word timestamps** | text-to-speech with timestamps / alignment | `npm run tts -- scripts/reels/<reel>.txt public/audio/<reel>` → `vo.mp3` + `vo-words.json` |
| Music bed | music generation | `npm run music -- "<prompt>" 40 public/audio/<reel>/music.mp3` |
| Sound effects | sound generation (0.5–30s) | `npm run sfx -- <name> "<prompt>" <seconds>` |

`vo-words.json` format (what `createVoTrack` expects): `[{ "text": "word", "start": 0.0, "end": 0.3 }, …]`
in seconds. If your MCP returns character-level alignment, group characters into words the way
`scripts/tts.py` does.

House narrator: **"Eric"** (`cjVigY5qzO86Huf0OWal`), `eleven_multilingual_v2`, stability 0.45,
similarity 0.8, style 0.35, speed 1.1.

## Data

- `npm run fred -- SERIES [SERIES…]` downloads FRED series (no key needed) to `data/` and prints
  latest / max / min. Series used so far: `DGS10` (10-yr yield), `MORTGAGE30US`, `CPIAUCNS`.
- For other sources, save the raw file in `data/` and note the URL + date in the reel's data JSON.

## News capture

- `npm run capture -- <url> <out.png> [width] [height]` — headless Chrome at 2× scale.
- Crop with ffmpeg; reference the cropped file from `NewsCard`.
- `npm run news:bonds` re-creates reel 02's two screenshots.

## Remotion

Pinned to 4.0.534. `npm run studio` for preview; `npm run still` / `npm run render` to output.
Fonts load through `@remotion/google-fonts` (Geist, Geist Mono, plus the collage set).

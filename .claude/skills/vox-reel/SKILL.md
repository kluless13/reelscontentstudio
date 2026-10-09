---
name: vox-reel
description: Make a new Vox-style informational reel (9:16 explainer, "Money, Explained" series) in this repo — from topic to rendered MP4. Use when the user asks for a new reel/short/explainer on a topic, or to remake/extend an existing one.
---

# New Vox-style reel

Follow `AGENTS.md` (rules, repo map) and `docs/WORKFLOW.md` (full process). This skill is the
checklist — create a task per step and stop at every ✋.

1. **Read** `docs/STYLE.md`, `docs/REELS.md`, and the code of the closest existing reel.
2. **Align ✋** — AskUserQuestion: angle, length, screenshot sourcing. Present a beat table; get a yes.
3. **Data** — `npm run fred -- …` (or save another cited source to `data/`); compute every figure
   with a script; report numbers + sources; flag contradictions.
4. **Screenshots ✋** — `npm run capture`, crop with ffmpeg, show the user. Real articles only.
5. **Script ✋** — 80–110 words / 40s, numbers spelled as spoken, saved to `scripts/reels/<reel>.txt`.
6. **Costs** — preflight Higgsfield costs (`get_cost: true`) and state the total before generating.
7. **Assets** — VO with word timestamps → `public/audio/<reel>/`; music; stills (check each one).
8. **Build** — copy `src/reels/_template/` → `src/reels/<reel>/`; beats via `voFrame("word", nth)`;
   register in `src/Root.tsx`; next series number.
9. **Verify** — `npm run typecheck`; stills at every beat/annotation, tiled and inspected; render;
   check frames + loudness from the MP4. Run the review checklist in WORKFLOW.md.
10. **Hand off** — send the MP4 with a beat summary, sources, credits spent, and caveats.

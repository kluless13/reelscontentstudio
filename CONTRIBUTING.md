# Contributing

Every reel should leave the studio a little better: a new component, a sharper rule, a fixed
gotcha. This is how changes get in.

## The flow

1. **Start from fresh `main`.**
   ```bash
   git checkout main && git pull
   git checkout -b <type>/<short-name>      # e.g. reel/04-rent-vs-wages, kit/map-ping, docs/chart-rules
   ```
2. **Make the change** (with your agent: point it at `AGENTS.md`, or run `/vox-reel` for a new reel).
3. **Check it locally.**
   ```bash
   npm run typecheck
   npm run still -- <CompositionId> out/check.png --frame=<n>   # look at the frames you touched
   ```
4. **Commit** with a conventional message: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
   ```bash
   git add -A && git commit -m "feat: reel 04 — rent vs wages"
   git push -u origin <branch>
   ```
5. **Open a pull request** (`gh pr create` or on GitHub). The template asks for a still/clip, sources
   and the checklist. CI runs the typecheck and a test render.
6. **Review:** one teammate looks at the frames, checks the sources, and approves. Squash-merge.

## Branch names

| Prefix | For |
|---|---|
| `reel/NN-topic` | a new reel (its folder in `src/reels/`, assets, script, data) |
| `kit/<name>` | a new or improved component in `src/kit/` |
| `docs/<topic>` | style rules, workflow, references, tool notes |
| `fix/<what>` | bugs, overlaps, broken renders |

## What a good PR includes

- **Show it.** Attach a still (or short clip) of every scene you changed. Reviewers judge frames, not code.
- **Source it.** Any new number comes with its dataset in `data/` and a source line on screen.
- **Keep it real.** News screenshots are real articles and stay local (`public/news/` is git-ignored);
  link the article URLs in the PR instead.
- **Document it.** If you added a technique, update the docs in the same PR:
  - new component → export from `src/kit/index.ts`, add a panel to `KitDemo`, a row in `docs/STYLE.md`
  - learned from a reference video → a row in `docs/REFERENCES.md`
  - hit a tool quirk → `docs/TOOLS.md` and the gotchas in `AGENTS.md`
  - new reel → a section in `docs/REELS.md`
- **Keep it small.** One reel or one technique per PR is easiest to review.

## Never commit

- API keys, `.env`, or anything from your MCP config. (Rotate a key immediately if it slips in.)
- Third-party videos or article screenshots.
- Renders (`out/` is ignored) — attach them to the PR instead.
- Large raw files over ~20 MB; compress stills (JPG for photos), keep audio as 128 kbps MP3.

## Reviewing a PR

- Pull the branch and run `npm run studio`, or check the attached frames.
- Walk the review checklist in [docs/WORKFLOW.md](docs/WORKFLOW.md#review-checklist).
- Check numbers against the files in `data/`.
- Approve or leave specific notes ("callout overlaps the line at 0:23", not "looks off").

@AGENTS.md

## Claude Code specifics

- The project skill `/vox-reel` (in `.claude/skills/vox-reel/`) walks through a new reel end to end.
- Use `AskUserQuestion` for the alignment and checkpoint questions (multiple choice, recommended first).
- Use the Higgsfield MCP batch tools (`generate_image_batch`, `generate_video_batch`) and poll with
  `jobs_wait`; preflight cost with `get_cost: true` on a single call first.
- Renders can take a few minutes — run them in the background and keep working.

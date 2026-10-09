import { voEndFrame, voFrame } from "./vo";

// Where every match-cut circle lives on screen, so cuts line up exactly.
export const CIRCLE = { x: 540, y: 880 };

// Scene boundaries (frames), locked to the narration: each cut lands just before its line.
export const T = {
  introEnd: voFrame("an") - 2,
  coinToClock: voFrame("until") - 2,
  clockToEarth: voFrame("now") - 2,
  earthToOutro: voFrame("and") - 2,
};

export const GOLD_FRAMES = voEndFrame() + 30;

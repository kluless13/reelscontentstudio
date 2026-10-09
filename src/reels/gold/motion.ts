import { curveProgress, curveSpeed } from "../../kit";
import { T } from "./timing";

// Every match cut is a 360° spin cut at peak velocity ("cutting the curve").
export const SPIN_CUTS = [T.introEnd, T.coinToClock, T.clockToEarth];
export const SPIN_FRAMES = 18;

export const spinAt = (frame: number): number =>
  SPIN_CUTS.reduce((deg, c) => deg + 360 * curveProgress(frame, c, SPIN_FRAMES), 0);

// Motion blur strength in px, peaking on each cut.
export const blurAt = (frame: number): number =>
  10 * Math.max(...SPIN_CUTS.map((c) => curveSpeed(frame, c, SPIN_FRAMES)));

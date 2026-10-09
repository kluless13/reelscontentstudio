import { Easing, interpolate } from "remotion";

// "Cutting the curve": a move with heavy ease-in-out whose velocity peaks exactly at
// `cutFrame`. Drive BOTH shots with the same progress and hard-cut on `cutFrame` —
// the speed hides the swap.
const EASE = Easing.bezier(0.75, 0, 0.25, 1);

export const curveProgress = (frame: number, cutFrame: number, duration: number): number =>
  interpolate(frame, [cutFrame - duration / 2, cutFrame + duration / 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

// 0..1 — how fast the move is right now, relative to its peak. Use it for motion blur.
export const curveSpeed = (frame: number, cutFrame: number, duration: number): number => {
  const step = (f: number) => curveProgress(f + 0.5, cutFrame, duration) - curveProgress(f - 0.5, cutFrame, duration);
  const peak = step(cutFrame);
  return peak > 0 ? Math.abs(step(frame)) / peak : 0;
};

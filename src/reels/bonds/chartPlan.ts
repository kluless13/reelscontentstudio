import { Easing, interpolate } from "remotion";
import { CameraKey, Domain, makeProjector, Pt, Rect } from "../../kit";
import series from "./dgs10.json";
import { B } from "./timing";

export const DATA: Pt[] = series.points;
// Plot area only; y labels live in the 100px gutter to its left.
export const RECT: Rect = { x: 190, y: 520, w: 800, h: 860 };
// Screen window the chart may occupy (keeps zoomed views clear of the readout, captions and logo).
export const VIEWPORT = { top: 400, bottom: 1530 };
// Padding on every side so the line never touches the plot edges.
export const DOMAIN: Domain = { t0: 1978.6, t1: 2027.6, v0: 0, v1: 17.5 };
export const project = makeProjector(RECT, DOMAIN);

// Key moments, pinned to FRED daily closes.
export const T_START = DATA[0].t;
// Read off the data itself so on-screen readouts land on FRED's exact values.
const pointNear = (t: number): Pt => DATA.reduce((best, p) => (Math.abs(p.t - t) < Math.abs(best.t - t) ? p : best));
export const PEAK = DATA.reduce((a, b) => (b.v > a.v ? b : a)); // 15.84%, 30 Sep 1981
export const BOTTOM = DATA.reduce((a, b) => (b.v < a.v ? b : a)); // 0.52%, 4 Aug 2020
export const MAY2002 = pointNear(2002.36); // 5.32%, 14 May 2002
export const NOW = DATA[DATA.length - 1]; // 5.31%, 5 Oct 2026

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);

// How far along the timeline the line is drawn, per frame.
export const revealAt = (frame: number): number => {
  if (frame < B.rewind + 4) return NOW.t;
  if (frame < B.back) return interpolate(frame, [B.rewind + 4, B.rewind + 44], [NOW.t, T_START], { ...clamp, easing: ease });
  if (frame < B.slide) return interpolate(frame, [B.back + 16, B.sixteen], [T_START, PEAK.t], { ...clamp, easing: Easing.out(Easing.quad) });
  if (frame < B.rise) return interpolate(frame, [B.slide, B.pandemic - 20], [PEAK.t, BOTTOM.t], { ...clamp, easing: Easing.inOut(Easing.sin) });
  return interpolate(frame, [B.rise, B.five], [BOTTOM.t, NOW.t], { ...clamp, easing: Easing.in(Easing.quad) });
};

const full = (at: number): CameraKey => ({ at, x: 540, y: 960, zoom: 1 });
const peak = project(PEAK.t, PEAK.v);
const bottom = project(BOTTOM.t, BOTTOM.v);
const now = project(NOW.t, NOW.v);

export const CAMERA: CameraKey[] = [
  full(B.rewind),
  full(B.back - 4),
  { at: B.back + 14, x: peak.x + 110, y: peak.y + 200, zoom: 1.7 },
  { at: B.slide - 6, x: peak.x + 110, y: peak.y + 200, zoom: 1.7 },
  full(B.slide + 24),
  full(B.pandemic - 24),
  { at: B.pandemic, x: bottom.x - 140, y: bottom.y - 200, zoom: 1.4 },
  { at: B.rise, x: bottom.x - 140, y: bottom.y - 200, zoom: 1.4 },
  { at: B.five, x: now.x - 180, y: now.y + 60, zoom: 1.5 },
  { at: B.highest - 2, x: now.x - 180, y: now.y + 60, zoom: 1.5 },
  full(B.highest + 26),
];

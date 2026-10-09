import { Pt } from "./project";

export type BoxPx = { x: number; y: number; w: number; h: number };
type Project = (t: number, v: number) => { x: number; y: number };

// True if any drawn data point (or the segment between samples) falls inside the box + margin.
export const hitsLine = (box: BoxPx, data: Pt[], project: Project, upTo: number, margin = 18): boolean => {
  const x0 = box.x - margin;
  const x1 = box.x + box.w + margin;
  const y0 = box.y - margin;
  const y1 = box.y + box.h + margin;
  const pts = data.filter((p) => p.t <= upTo).map((p) => project(p.t, p.v));
  return pts.some((p, i) => {
    const q = pts[i + 1] ?? p;
    // sample along the segment so steep jumps between samples still count
    for (let s = 0; s <= 4; s++) {
      const x = p.x + ((q.x - p.x) * s) / 4;
      const y = p.y + ((q.y - p.y) * s) / 4;
      if (x >= x0 && x <= x1 && y >= y0 && y <= y1) return true;
    }
    return false;
  });
};

export const intersect = (a: BoxPx, b: BoxPx): BoxPx => {
  const x = Math.max(a.x, b.x);
  const y = Math.max(a.y, b.y);
  return { x, y, w: Math.max(0, Math.min(a.x + a.w, b.x + b.w) - x), h: Math.max(0, Math.min(a.y + a.h, b.y + b.h) - y) };
};

const overlaps = (a: BoxPx, b: BoxPx, m = 16) =>
  a.x < b.x + b.w + m && a.x + a.w + m > b.x && a.y < b.y + b.h + m && a.y + a.h + m > b.y;

// Finds the closest spot for a label that is inside `bounds`, clear of the drawn line and of
// any `avoid` boxes (photos, other labels — in the same coordinate space).
// Searches rows above (preferred) and below the anchor, sliding horizontally and clamping
// into bounds, then picks the clear box whose centre is nearest the anchor.
export const placeLabel = (
  anchor: { x: number; y: number },
  size: { w: number; h: number },
  data: Pt[],
  project: Project,
  upTo: number,
  bounds: BoxPx,
  avoid: BoxPx[] = [],
): BoxPx & { clear: boolean } => {
  const gap = 60;
  const clampX = (x: number) => Math.min(Math.max(x, bounds.x + 8), bounds.x + bounds.w - size.w - 8);
  const rows = [1, 1.8, 2.8, 4, 5.5].flatMap((k) => [anchor.y - gap * k - size.h, anchor.y + gap * k]);
  const fracs = [0.5, 0.3, 0.7, 0.1, 0.9, 0, 1];
  const cands: BoxPx[] = rows.flatMap((y) => fracs.map((f) => ({ x: clampX(anchor.x - size.w * f), y, w: size.w, h: size.h })));
  const inside = (b: BoxPx) => b.y >= bounds.y && b.y + b.h <= bounds.y + bounds.h && b.x >= bounds.x && b.x + b.w <= bounds.x + bounds.w;
  const dist = (b: BoxPx) => Math.hypot(b.x + b.w / 2 - anchor.x, (b.y + b.h / 2 - anchor.y) * 1.2);
  const clear = cands
    .filter((b) => inside(b) && !hitsLine(b, data, project, upTo) && !avoid.some((o) => overlaps(b, o)))
    .sort((a, b) => dist(a) - dist(b));
  return clear[0] ? { ...clear[0], clear: true } : { ...cands[0], clear: false };
};

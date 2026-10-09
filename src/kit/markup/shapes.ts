// Path builders for hand-drawn markups.

type Pt = { x: number; y: number };

const smooth = (pts: Pt[]): string => {
  // Catmull-Rom → cubic Bézier for a natural pen line.
  const d = [`M ${pts[0].x} ${pts[0].y}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d.push(`C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`);
  }
  return d.join(" ");
};

// A loop that starts top-left and overshoots past its start, the way a pen circles something.
export const loopPath = (cx: number, cy: number, rx: number, ry: number, tilt = -8): string => {
  const pts: Pt[] = [];
  const steps = 28;
  const startA = (-120 * Math.PI) / 180;
  const sweep = (400 * Math.PI) / 180;
  const t = (tilt * Math.PI) / 180;
  for (let i = 0; i <= steps; i++) {
    const a = startA + (sweep * i) / steps;
    const grow = 1 + 0.07 * (i / steps); // spiral out slightly so the overshoot doesn't overlap
    const x = Math.cos(a) * rx * grow;
    const y = Math.sin(a) * ry * grow;
    pts.push({ x: cx + x * Math.cos(t) - y * Math.sin(t), y: cy + x * Math.sin(t) + y * Math.cos(t) });
  }
  return smooth(pts);
};

// Curved arrow shaft plus a two-stroke head.
export const arrowPaths = (from: Pt, to: Pt, bend = 0.25): string[] => {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const ctrl = { x: mx - dy * bend, y: my + dx * bend };
  const shaft = `M ${from.x} ${from.y} Q ${ctrl.x} ${ctrl.y} ${to.x} ${to.y}`;
  const ang = Math.atan2(to.y - ctrl.y, to.x - ctrl.x);
  const len = 46;
  const wing = (s: number) => {
    const a = ang + Math.PI + s * 0.5;
    return `M ${to.x} ${to.y} L ${to.x + Math.cos(a) * len} ${to.y + Math.sin(a) * len}`;
  };
  return [shaft, wing(1), wing(-1)];
};

// Slightly wavy underline.
export const underlinePath = (x1: number, x2: number, y: number): string => {
  const pts: Pt[] = [];
  const steps = 8;
  for (let i = 0; i <= steps; i++) {
    pts.push({ x: x1 + ((x2 - x1) * i) / steps, y: y + Math.sin(i * 1.3) * 4 + (i / steps) * -6 });
  }
  return smooth(pts);
};

// Two-stroke X mark.
export const xPaths = (cx: number, cy: number, size = 30): string[] => [
  `M ${cx - size} ${cy - size} L ${cx + size} ${cy + size}`,
  `M ${cx + size} ${cy - size * 0.9} L ${cx - size * 0.9} ${cy + size}`,
];

export const polyPath = (pts: Pt[], closed = true): string => smooth(closed ? [...pts, pts[0], pts[1]] : pts);

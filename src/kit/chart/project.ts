export type Pt = { t: number; v: number };
export type Rect = { x: number; y: number; w: number; h: number };
export type Domain = { t0: number; t1: number; v0: number; v1: number };

// Maps data space (time, value) to screen pixels inside `rect`.
export const makeProjector = (rect: Rect, domain: Domain) => (t: number, v: number) => ({
  x: rect.x + ((t - domain.t0) / (domain.t1 - domain.t0)) * rect.w,
  y: rect.y + rect.h - ((v - domain.v0) / (domain.v1 - domain.v0)) * rect.h,
});

// Value of the series at time t (linear between samples).
export const valueAt = (data: Pt[], t: number): number => {
  if (t <= data[0].t) return data[0].v;
  for (let i = 1; i < data.length; i++) {
    if (data[i].t >= t) {
      const a = data[i - 1];
      const b = data[i];
      return a.v + ((b.v - a.v) * (t - a.t)) / (b.t - a.t);
    }
  }
  return data[data.length - 1].v;
};

// Points up to `reveal`, ending exactly on the interpolated tip.
export const revealed = (data: Pt[], reveal: number): Pt[] => {
  const head = data.filter((p) => p.t < reveal);
  return head.length ? [...head, { t: reveal, v: valueAt(data, reveal) }] : [data[0]];
};

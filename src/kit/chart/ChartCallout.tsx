import { getRemotionEnvironment, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../../theme";
import { BoxPx, placeLabel } from "./collide";
import { Pt } from "./project";

type Props = {
  data: Pt[];
  project: (t: number, v: number) => { x: number; y: number };
  bounds: BoxPx; // where the label may sit: plot rect ∩ what the camera shows
  point: Pt;
  title: string;
  sub?: string;
  start: number;
  upTo?: number; // how much of the line is drawn (for collision checks)
  color?: string;
  avoid?: BoxPx[]; // other elements to keep clear of, in chart coordinates
};

const TITLE = 30;
const SUB = 24;
const CHAR = 0.62; // Geist Mono advance ≈ 0.6em

// Chart annotation: ringed dot on the data point, a leader line, and a solid chip placed
// automatically in clear space so it never sits on the line.
export const ChartCallout: React.FC<Props> = ({
  data,
  project,
  bounds,
  point,
  title,
  sub,
  start,
  upTo,
  color = colors.marker,
  avoid = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < start) return null;
  const a = project(point.t, point.v);
  const w = Math.max(title.length * TITLE, (sub ?? "").length * SUB) * CHAR + 44;
  const h = sub ? 96 : 60;
  const box = placeLabel(a, { w, h }, data, project, upTo ?? point.t, bounds, avoid);
  const dot = spring({ frame: frame - start, fps, config: { damping: 12, stiffness: 200 } });
  const lead = interpolate(frame, [start + 3, start + 11], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chip = interpolate(frame, [start + 9, start + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Leader runs from the dot to the nearest point on the chip's edge.
  const ex = Math.min(Math.max(a.x, box.x), box.x + box.w);
  const ey = Math.min(Math.max(a.y, box.y), box.y + box.h);
  return (
    <>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <circle cx={a.x} cy={a.y} r={22 * dot} fill="none" stroke={color} strokeWidth={4} />
        <circle cx={a.x} cy={a.y} r={9 * dot} fill={color} />
        <line x1={a.x} y1={a.y} x2={a.x + (ex - a.x) * lead} y2={a.y + (ey - a.y) * lead} stroke={colors.ink} strokeWidth={3} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          opacity: chip,
          transform: `translateY(${(1 - chip) * 10}px)`,
          background: colors.ink,
          color: colors.paper,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: fonts.mono,
          fontWeight: 700,
          letterSpacing: 1,
          // Studio-only warning: no clear spot was found, so this label overlaps something.
          outline: !box.clear && getRemotionEnvironment().isStudio ? "6px dashed #ff00aa" : undefined,
        }}
      >
        <div style={{ fontSize: TITLE, lineHeight: 1.1 }}>{title}</div>
        {sub ? <div style={{ fontSize: SUB, color: colors.highlighter, marginTop: 6 }}>{sub}</div> : null}
      </div>
    </>
  );
};

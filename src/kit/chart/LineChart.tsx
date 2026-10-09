import { interpolateColors } from "remotion";
import { colors, fonts } from "../../theme";
import { Domain, makeProjector, Pt, Rect, revealed, valueAt } from "./project";

export type ChartFocus = { from: number; to: number; dim: number }; // dim 0..1

type Props = {
  data: Pt[];
  reveal: number; // draw the line up to this time
  rect: Rect; // the PLOT area — labels live outside it, in the gutters
  domain: Domain;
  yTicks?: number[];
  xTicks?: number[];
  yFormat?: (v: number) => string;
  color?: string;
  source?: string;
  focus?: ChartFocus;
};

const toPath = (pts: { x: number; y: number }[]) =>
  pts.map((q, i) => `${i ? "L" : "M"} ${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" ");

// Line chart that draws itself as `reveal` advances.
// Layout rules (see vox-kit.md → Chart rules):
//  - y labels sit in the left gutter, x labels below the baseline: nothing text-like inside the plot
//  - the area fill fades in only once the line has some width (no 1-px "stripe" at the start)
//  - focus dims the rest of the line to grey instead of clipping a spotlight circle through it
export const LineChart: React.FC<Props> = ({
  data,
  reveal,
  rect,
  domain,
  yTicks = [],
  xTicks = [],
  yFormat = (v) => `${v}%`,
  color = colors.marker,
  source,
  focus,
}) => {
  const p = makeProjector(rect, domain);
  const shown = revealed(data, reveal);
  const pts = shown.map((d) => p(d.t, d.v));
  const line = toPath(pts);
  const base = rect.y + rect.h;
  const span = pts[pts.length - 1].x - pts[0].x;
  const areaOpacity = Math.min(1, Math.max(0, (span - 20) / 140));
  const area = `${line} L ${pts[pts.length - 1].x} ${base} L ${pts[0].x} ${base} Z`;
  const tip = p(reveal, valueAt(data, reveal));
  const dim = focus?.dim ?? 0;
  const baseColor = interpolateColors(dim, [0, 1], [color, "#b9b0a2"]);
  const focusPts = focus ? shown.filter((d) => d.t >= focus.from && d.t <= focus.to).map((d) => p(d.t, d.v)) : [];
  const label: React.CSSProperties = { fontFamily: fonts.mono, fontSize: 26, fontWeight: 500, fill: colors.muted };
  return (
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id="chart-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {yTicks.map((v) => {
        const y = p(domain.t0, v).y;
        return (
          <g key={`y${v}`}>
            <line x1={rect.x} x2={rect.x + rect.w} y1={y} y2={y} stroke={colors.ink} strokeOpacity={0.12} strokeWidth={2} strokeDasharray="6 8" />
            <text x={rect.x - 18} y={y + 9} textAnchor="end" style={label}>
              {yFormat(v)}
            </text>
          </g>
        );
      })}
      {xTicks.map((t) => (
        <text key={`x${t}`} x={p(t, domain.v0).x} y={base + 44} textAnchor="middle" style={label}>
          {t}
        </text>
      ))}
      <line x1={rect.x} x2={rect.x + rect.w} y1={base} y2={base} stroke={colors.ink} strokeWidth={3} />
      <path d={area} fill="url(#chart-area)" opacity={areaOpacity * (1 - dim * 0.8)} />
      <path d={line} fill="none" stroke={baseColor} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
      {focusPts.length > 1 ? (
        <path d={toPath(focusPts)} fill="none" stroke={color} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
      ) : null}
      <circle cx={tip.x} cy={tip.y} r={20} fill={color} opacity={0.16} />
      <circle cx={tip.x} cy={tip.y} r={10} fill={color} stroke={colors.paper} strokeWidth={4} />
      {source ? (
        <text x={rect.x + rect.w} y={base + 88} textAnchor="end" style={{ ...label, fontSize: 22, letterSpacing: 2 }}>
          {source}
        </text>
      ) : null}
    </svg>
  );
};

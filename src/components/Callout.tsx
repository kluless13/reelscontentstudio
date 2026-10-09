import { interpolate, useCurrentFrame, Easing } from "remotion";
import { colors, fonts } from "../theme";

type Props = {
  from: { x: number; y: number };
  to: { x: number; y: number };
  start: number;
  title: React.ReactNode;
  sub?: string;
};

// Annotation: a dot on the subject, a line drawing out, then a text card at the end.
export const Callout: React.FC<Props> = ({ from, to, start, title, sub }) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const line = interpolate(frame, [start, start + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const dot = interpolate(frame, [start - 4, start + 2], [0, 1], clamp);
  const card = interpolate(frame, [start + 8, start + 14], [0, 1], clamp);
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  return (
    <>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <circle cx={from.x} cy={from.y} r={12 * dot} fill={colors.marker} />
        <line
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke={colors.ink}
          strokeWidth={4}
          strokeDasharray={len}
          strokeDashoffset={len * (1 - line)}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: to.x,
          top: to.y,
          transform: `translate(-50%, ${(1 - card) * 24}px)`,
          opacity: card,
          background: colors.paper,
          border: `4px solid ${colors.ink}`,
          padding: "14px 22px",
          textAlign: "center",
          boxShadow: `8px 8px 0 ${colors.ink}`,
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ fontFamily: fonts.serif, fontWeight: 900, fontSize: 52, color: colors.ink }}>{title}</div>
        {sub ? (
          <div style={{ fontFamily: fonts.mono, fontSize: 24, color: colors.muted, marginTop: 4 }}>{sub}</div>
        ) : null}
      </div>
    </>
  );
};

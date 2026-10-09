import { Easing, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../theme";

export type CursorKey = { at: number; x: number; y: number; click?: boolean; variant?: "arrow" | "hand" };

const ARROW = "M0 0 L0 62 L16 47 L27 72 L38 67 L27 43 L48 43 Z";
const HAND =
  "M18 30 V8 a6 6 0 0 1 12 0 V28 V4 a6 6 0 0 1 12 0 V28 V8 a6 6 0 0 1 12 0 V30 V16 a6 6 0 0 1 12 0 V48 c0 16 -10 26 -26 26 h-6 c-10 0 -16 -5 -22 -13 L2 42 a6 6 0 0 1 10 -7 L18 42 Z";

// Animated screen cursor: eases between keyframes, switches arrow/hand, dips + rings on click.
export const Cursor: React.FC<{ keys: CursorKey[]; scale?: number }> = ({ keys, scale = 1.6 }) => {
  const frame = useCurrentFrame();
  if (frame < keys[0].at) return null;
  const i = Math.max(0, keys.findIndex((k, idx) => frame >= k.at && (idx === keys.length - 1 || frame < keys[idx + 1].at)));
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  const t = b.at > a.at ? interpolate(frame, [a.at, b.at], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }) : 0;
  const x = a.x + (b.x - a.x) * t;
  const y = a.y + (b.y - a.y) * t;
  const variant = (t > 0.85 ? b.variant : a.variant) ?? "arrow";
  const clickKey = [...keys].reverse().find((k) => k.click && frame >= k.at);
  const sinceClick = clickKey ? frame - clickKey.at : 99;
  const dip = interpolate(sinceClick, [0, 3, 7], [1, 0.82, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring = interpolate(sinceClick, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
      {sinceClick < 12 ? (
        <circle cx={x} cy={y} r={14 + ring * 50} fill="none" stroke={colors.ink} strokeWidth={4} opacity={1 - ring} />
      ) : null}
      <g transform={`translate(${x} ${y}) scale(${scale * dip})`}>
        <path
          d={variant === "hand" ? HAND : ARROW}
          transform={variant === "hand" ? "translate(-30 -6)" : undefined}
          fill="#fff"
          stroke={colors.ink}
          strokeWidth={3.5}
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

import { interpolate, useCurrentFrame, Easing } from "remotion";
import { colors } from "../theme";

type Props = { cx: number; cy: number; r: number; start: number; duration?: number };

// Hand-drawn red marker loop: two slightly offset strokes that overshoot the start.
export const MarkerRing: React.FC<Props> = ({ cx, cy, r, start, duration = 14 }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const circumference = 2 * Math.PI * r * 1.12;
  const stroke = (rx: number, ry: number, rot: number, width: number) => (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill="none"
      stroke={colors.marker}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={circumference}
      strokeDashoffset={circumference * (1 - progress)}
      transform={`rotate(${rot} ${cx} ${cy})`}
      opacity={0.92}
    />
  );
  return (
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      {stroke(r * 1.04, r * 0.98, -100, 12)}
      {stroke(r * 1.07, r * 1.01, -88, 5)}
    </svg>
  );
};

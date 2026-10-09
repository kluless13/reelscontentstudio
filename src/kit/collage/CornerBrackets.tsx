import { Easing, interpolate, useCurrentFrame } from "remotion";
import { collage } from "./palette";

type Props = { x: number; y: number; w: number; h: number; start: number; color?: string; arm?: number; width?: number };

// Four corner brackets that draw out from each corner — the reference's red framing mark.
export const CornerBrackets: React.FC<Props> = ({ x, y, w, h, start, color = collage.pink, arm = 70, width = 9 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  if (p <= 0) return null;
  const a = arm * p;
  const corners: [number, number, number, number][] = [
    [x, y, 1, 1],
    [x + w, y, -1, 1],
    [x, y + h, 1, -1],
    [x + w, y + h, -1, -1],
  ];
  return (
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {corners.map(([cx, cy, sx, sy], i) => (
        <path key={i} d={`M ${cx + sx * a} ${cy} L ${cx} ${cy} L ${cx} ${cy + sy * a}`} fill="none" stroke={color} strokeWidth={width} />
      ))}
    </svg>
  );
};

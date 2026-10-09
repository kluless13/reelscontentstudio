import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";

type Props = {
  x: number;
  y: number;
  start: number;
  rings?: number;
  maxRadius?: number;
  period?: number;
  color?: string;
  dot?: boolean;
};

// Location ping: a dot pops, then rings expand and fade on a stagger, repeating.
export const RadioWaves: React.FC<Props> = ({
  x,
  y,
  start,
  rings = 3,
  maxRadius = 220,
  period = 30,
  color = colors.paper,
  dot = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - start;
  if (local < 0) return null;
  const dotScale = spring({ frame: local, fps, config: { damping: 10, stiffness: 220 } });
  const stagger = period / rings;
  return (
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {Array.from({ length: rings }, (_, i) => {
        const t = local - 4 - i * stagger;
        if (t < 0) return null;
        const phase = (t % period) / period;
        const r = interpolate(phase, [0, 1], [10, maxRadius]);
        const opacity = interpolate(phase, [0, 0.15, 1], [0, 0.95, 0]);
        return <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={7} opacity={opacity} />;
      })}
      {dot ? (
        <>
          <circle cx={x} cy={y} r={16 * dotScale} fill={colors.marker} stroke={color} strokeWidth={5} />
        </>
      ) : null}
    </svg>
  );
};

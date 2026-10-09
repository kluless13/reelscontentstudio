import { Easing, interpolate, useCurrentFrame } from "remotion";
import { colors, fonts } from "../theme";

type Props = {
  from: number;
  to: number;
  start: number;
  end: number;
  format?: (n: number) => string;
  size?: number;
  color?: string;
  boxed?: boolean;
  style?: React.CSSProperties;
};

// Monospaced number counter — digits never jitter while counting.
export const MonoCounter: React.FC<Props> = ({
  from,
  to,
  start,
  end,
  format = (n) => Math.round(n).toLocaleString("en-US"),
  size = 120,
  color = colors.ink,
  boxed = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <span
      style={{
        fontFamily: fonts.mono,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        color,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "-0.02em",
        ...(boxed ? { border: `5px solid ${color}`, borderRadius: size, padding: `0.15em 0.5em` } : {}),
        ...style,
      }}
    >
      {format(value)}
    </span>
  );
};

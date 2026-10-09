import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

type Props = {
  text: string;
  start: number;
  x: number;
  y: number;
  invert?: boolean;
  size?: number;
};

// Vox-style black/white label chip that wipes open from the left.
export const LabelBox: React.FC<Props> = ({ text, start, x, y, invert = false, size = 38 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - start, fps, config: { damping: 200 }, durationInFrames: 12 });
  const textOpacity = interpolate(frame, [start + 5, start + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translateX(-50%)",
        clipPath: `inset(0 ${(1 - s) * 100}% 0 0)`,
        background: invert ? colors.paper : colors.ink,
        color: invert ? colors.ink : colors.paper,
        fontFamily: fonts.mono,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: 2,
        padding: "12px 22px",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ opacity: textOpacity }}>{text}</span>
    </div>
  );
};

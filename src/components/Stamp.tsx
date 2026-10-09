import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

type Props = { text: string; start: number; x: number; y: number; rotate?: number };

// Rubber-stamp slam: overshoots in scale, lands with a slight tilt.
export const Stamp: React.FC<Props> = ({ text, start, x, y, rotate = -9 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - start, fps, config: { damping: 11, stiffness: 220, mass: 0.7 } });
  const scale = interpolate(s, [0, 1], [2.4, 1]);
  const opacity = interpolate(frame, [start, start + 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`,
        opacity: opacity * 0.92,
        border: `8px solid ${colors.marker}`,
        color: colors.marker,
        fontFamily: fonts.mono,
        fontWeight: 700,
        fontSize: 64,
        letterSpacing: 6,
        padding: "8px 28px",
        mixBlendMode: "multiply",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

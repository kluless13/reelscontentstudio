import { interpolate, useCurrentFrame, Easing } from "remotion";
import { colors } from "../theme";

type Props = { children: React.ReactNode; start: number; duration?: number };

// Highlighter-marker sweep behind a word, left to right.
export const Highlight: React.FC<Props> = ({ children, start, duration = 10 }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <span style={{ position: "relative", display: "inline-block", padding: "0 10px" }}>
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "18%",
          bottom: "8%",
          background: colors.highlighter,
          transform: `scaleX(${progress}) skewX(-6deg)`,
          transformOrigin: "left center",
          borderRadius: 6,
        }}
      />
      <span style={{ position: "relative" }}>{children}</span>
    </span>
  );
};

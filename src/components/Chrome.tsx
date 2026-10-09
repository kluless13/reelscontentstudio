import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

// Persistent series tag + progress rule, and a quick flash on each match cut.
export const Chrome: React.FC<{ cuts: number[]; tag?: string; font?: string; accent?: string }> = ({
  cuts,
  tag = "MONEY, EXPLAINED · 01",
  font = fonts.mono,
  accent = colors.marker,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const flash = Math.max(
    0,
    ...cuts.map((c) => interpolate(frame, [c, c + 4], [0.35, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (frame >= c ? 1 : 0)),
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 70,
          fontFamily: font,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: 3,
          color: colors.ink,
          background: colors.paper,
          padding: "6px 14px",
          border: `3px solid ${colors.ink}`,
        }}
      >
        {tag}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 10,
          width: `${(frame / (durationInFrames - 1)) * 100}%`,
          background: accent,
        }}
      />
    </AbsoluteFill>
  );
};

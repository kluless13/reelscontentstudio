import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LabelBox } from "../../components/LabelBox";
import { MarkerCircle, MonoCounter } from "../../kit";
import { colors, fonts } from "../../theme";
import { CIRCLE, T } from "./timing";
import { voFrame } from "./vo";

export const COUNT_LAND = voFrame("twelve") + 2;

// Globe collapses; a monospaced counter springs from the same point, lands on "twelve",
// then gets circled by hand.
export const OutroV3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = T.earthToOutro + 10;
  const pop = spring({ frame: frame - start, fps, config: { damping: 14, stiffness: 160 } });
  const settle = spring({ frame: frame - COUNT_LAND, fps, config: { damping: 10, stiffness: 260 } });
  const thump = 1 + 0.08 * (1 - settle) * (frame >= COUNT_LAND ? 1 : 0);
  const footer = interpolate(frame, [COUNT_LAND + 14, COUNT_LAND + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <LabelBox text="$1 FROM 1971 IS WORTH" start={voFrame("dollar") - 4} x={540} y={560} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CIRCLE.y,
          transform: `translateY(-50%) scale(${pop * thump})`,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        <MonoCounter from={100} to={12} start={start} end={COUNT_LAND} size={300} />
        <span style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 300, color: colors.marker }}>¢</span>
      </div>
      <MarkerCircle cx={CIRCLE.x} cy={CIRCLE.y} rx={360} ry={210} start={COUNT_LAND + 3} duration={14} color={colors.marker} />
      <div
        style={{
          position: "absolute",
          top: 1150,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: fonts.mono,
          fontSize: 34,
          color: colors.muted,
          opacity: footer,
        }}
      >
        in today’s money · approx., via US CPI
      </div>
    </AbsoluteFill>
  );
};

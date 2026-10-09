import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { LabelBox } from "../../components/LabelBox";
import { FillText, OdometerText, ParallaxStill } from "../../kit";
import { colors, fonts } from "../../theme";
import { CIRCLE, T } from "./timing";
import { voCaption, voFrame } from "./vo";
import { blurAt, spinAt } from "./motion";

const LEAD = voCaption("money", "by");

// Parallax archival desk → odometer headline → "gold" fills yellow → iris spins down into the coin.
export const IntroV3: React.FC<{ irisTargetRadius: number }> = ({ irisTargetRadius }) => {
  const frame = useCurrentFrame();
  const iris = interpolate(frame, [T.introEnd - 12, T.introEnd], [1400, irisTargetRadius], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return (
    <AbsoluteFill
      style={{
        clipPath: `circle(${iris}px at ${CIRCLE.x}px ${CIRCLE.y}px)`,
        transform: `rotate(${spinAt(frame)}deg)`,
        transformOrigin: `${CIRCLE.x}px ${CIRCLE.y}px`,
        filter: `blur(${blurAt(frame)}px)`,
      }}
    >
      <ParallaxStill
        start={0}
        end={T.introEnd}
        zoom={0.22}
        panX={-70}
        panY={-30}
        filter="sepia(0.35) contrast(1.05)"
        layers={[
          { src: "assets/cash-bg.png", depth: 0.15, blur: 2 },
          { src: "assets/cash-fg.png", depth: 1 },
        ]}
      />
      <AbsoluteFill style={{ background: "linear-gradient(rgba(10,8,5,0.35), rgba(10,8,5,0.7))" }} />
      <LabelBox text="AUGUST 1971" start={voFrame("1971") - 2} x={540} y={520} invert />
      <div
        style={{
          position: "absolute",
          top: 640,
          left: 60,
          right: 60,
          textAlign: "center",
          fontFamily: fonts.sans,
          fontWeight: 900,
          fontSize: 82,
          lineHeight: 1.1,
          letterSpacing: 1,
          color: colors.paper,
          textTransform: "uppercase",
        }}
      >
        {LEAD.map((w, i) => (
          <OdometerText key={i} text={w.text} start={w.at ?? 0} stagger={1} roll={7} style={{ marginRight: "0.28em" }} />
        ))}
        <div style={{ fontFamily: fonts.serif, fontStyle: "italic", textTransform: "none", fontSize: 230, lineHeight: 1.05 }}>
          <FillText text="gold." start={voFrame("gold") - 1} stagger={1.5} color={colors.paper} hold={40} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

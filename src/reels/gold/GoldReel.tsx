import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Callout } from "../../components/Callout";
import { Caption } from "../../components/Caption";
import { Chrome } from "../../components/Chrome";
import { CircleShot } from "../../components/CircleShot";
import { Grain } from "../../components/Grain";
import { LabelBox } from "../../components/LabelBox";
import { Orbit } from "../../components/Orbit";
import { Soundtrack } from "../../components/Soundtrack";
import { Stamp } from "../../components/Stamp";
import { Window } from "../../components/Window";
import { FillText, GridPaper, MarkerCircle, MonoCounter, RadioWaves } from "../../kit";
import { SHOTS } from "./shots";
import { colors, fonts } from "../../theme";
import { CIRCLE, T } from "./timing";
import { VO_OFFSET, voCaption, voFrame } from "./vo";
import { CALLOUT_AT, CUES, ORBIT_START, PING_AT, RING_AT, STAMP_AT } from "./cues";
import { IntroV3 } from "./IntroV3";
import { blurAt, SPIN_CUTS, spinAt } from "./motion";
import { OutroV3 } from "./OutroV3";

const BASE_D = 700;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CLOCK_CAPTION = voCaption("until", "window");
const EARTH_CAPTION = voCaption("now", "floats", ["floats"]);
const CURRENCIES = ["$", "€", "¥", "£", "₹"];

// Washington, D.C. on the globe still, as an offset from the circle centre (fraction of diameter).
const DC = { dx: -0.18, dy: -0.28 };

const shotAt = (frame: number) =>
  frame < T.coinToClock ? SHOTS.coin : frame < T.clockToEarth ? SHOTS.clock : SHOTS.earth;

const diameterAt = (frame: number) => {
  const drift = interpolate(frame, [T.introEnd, T.earthToOutro], [BASE_D, 800], clamp);
  const collapse = interpolate(frame, [T.earthToOutro, T.earthToOutro + 11], [1, 0], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  return drift * collapse;
};

// v3 of the gold-standard reel, rebuilt with the Vox Kit.
export { GOLD_FRAMES } from "./timing";

export const GoldReel: React.FC = () => {
  const frame = useCurrentFrame();
  const d = diameterAt(frame);
  const orbitRadius = d / 2 + 110;
  const ping = { x: CIRCLE.x + DC.dx * d, y: CIRCLE.y + DC.dy * d };

  return (
    <AbsoluteFill>
      <GridPaper />

      <Window from={T.introEnd} to={T.coinToClock}>
        <LabelBox text="THE GOLD STANDARD" start={T.introEnd + 6} x={540} y={330} />
      </Window>

      <Window from={T.clockToEarth} to={T.earthToOutro}>
        <LabelBox text="AFTER 1971" start={T.clockToEarth + 3} x={540} y={330} />
        <Orbit layer="back" symbols={CURRENCIES} x={CIRCLE.x} y={CIRCLE.y} radius={orbitRadius} start={ORBIT_START} />
      </Window>

      {/* One circle, three sources, spun through each cut at peak velocity */}
      <Window from={T.introEnd} to={T.earthToOutro + 12}>
        <AbsoluteFill
          style={{
            transform: `rotate(${spinAt(frame)}deg)`,
            transformOrigin: `${CIRCLE.x}px ${CIRCLE.y}px`,
            filter: `blur(${blurAt(frame)}px)`,
          }}
        >
          <CircleShot shot={shotAt(frame)} x={CIRCLE.x} y={CIRCLE.y} diameter={d} />
        </AbsoluteFill>
      </Window>

      <Window from={T.introEnd} to={T.coinToClock}>
        <MarkerCircle cx={CIRCLE.x} cy={CIRCLE.y} rx={d / 2 + 34} start={RING_AT} duration={14} />
        <Callout
          from={{ x: CIRCLE.x + 230, y: CIRCLE.y + 250 }}
          to={{ x: 740, y: 1400 }}
          start={CALLOUT_AT}
          title={<MonoCounter from={0} to={35} start={CALLOUT_AT + 8} end={CALLOUT_AT + 22} size={64} format={(n) => `$${Math.round(n)} = 1 oz`} />}
          sub="of gold, fixed 1944–1971"
        />
      </Window>

      <Window from={T.coinToClock} to={T.clockToEarth}>
        <Stamp text="AUG 15 1971" start={STAMP_AT} x={720} y={420} />
        <Caption start={0} y={1390} size={72} words={CLOCK_CAPTION} />
      </Window>

      <Window from={T.clockToEarth} to={T.earthToOutro}>
        <RadioWaves x={ping.x} y={ping.y} start={PING_AT} maxRadius={150} period={26} />
        <div
          style={{
            position: "absolute",
            left: ping.x,
            top: ping.y - 92,
            transform: "translateX(-50%)",
            opacity: interpolate(frame, [PING_AT + 4, PING_AT + 9], [0, 1], clamp),
            background: colors.ink,
            color: colors.paper,
            fontFamily: fonts.mono,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: 2,
            padding: "6px 12px",
            whiteSpace: "nowrap",
          }}
        >
          WASHINGTON, D.C.
        </div>
        <Orbit layer="front" symbols={CURRENCIES} x={CIRCLE.x} y={CIRCLE.y} radius={orbitRadius} start={ORBIT_START} />
        <Caption
          start={0}
          y={1420}
          size={80}
          words={EARTH_CAPTION}
          renderHighlight={(t) => <FillText text={t} start={voFrame("floats") - 1} stagger={1.5} hold={10} />}
        />
      </Window>

      <Window from={T.earthToOutro} to={Infinity}>
        <OutroV3 />
      </Window>

      <Window from={0} to={T.introEnd + 1}>
        <IntroV3 irisTargetRadius={BASE_D / 2} />
      </Window>

      <Soundtrack voOffset={VO_OFFSET} cues={CUES} voSrc="audio/gold/vo.mp3" musicSrc="audio/gold/music.mp3" />
      <Chrome cuts={SPIN_CUTS.slice(1)} />
      <Grain />
    </AbsoluteFill>
  );
};

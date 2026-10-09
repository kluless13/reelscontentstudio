import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Grain } from "../../components/Grain";
import {
  Cursor,
  curveProgress,
  curveSpeed,
  FillText,
  LookHere,
  MarkerArrow,
  MarkerCircle,
  MarkerUnderline,
  MonoCounter,
  OdometerText,
  ParallaxStill,
  RadioWaves,
  RandomLetters,
  Spotlight,
} from "../../kit";
import { colors, fonts } from "../../theme";
import { Panel, PANEL } from "./Panel";

const center: React.CSSProperties = {
  position: "absolute",
  top: 700,
  left: 0,
  right: 0,
  textAlign: "center",
};

// Panel 1 — yellow circle travels on a heavy ease; hard cut to a blue square at peak speed.
const CurveCut: React.FC = () => {
  const frame = useCurrentFrame();
  const cut = 40;
  const p = curveProgress(frame, cut, 36);
  const x = 220 + 640 * p;
  const y = 860 - Math.sin(p * Math.PI) * 260;
  const blur = 12 * curveSpeed(frame, cut, 36);
  const isB = frame >= cut;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 90,
        top: y - 90,
        width: 180,
        height: 180,
        borderRadius: isB ? 16 : "50%",
        background: isB ? "#1fb8e0" : colors.highlighter,
        transform: `rotate(${p * 200}deg)`,
        filter: `blur(${blur}px)`,
      }}
    />
  );
};

const Typography: React.FC = () => {
  const style = { fontFamily: fonts.sans, fontWeight: 900, fontSize: 110, color: colors.ink, letterSpacing: 2 };
  return (
    <div style={center}>
      <FillText text="FILL ANIMATION" start={6} stagger={1.6} style={style} />
    </div>
  );
};

const Random: React.FC = () => (
  <div style={center}>
    <RandomLetters
      text="Random Appearing Letters"
      start={6}
      duration={16}
      style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 900, fontSize: 110, color: colors.ink }}
    />
  </div>
);

const Odometer: React.FC = () => (
  <>
    <div style={{ ...center, top: 620 }}>
      <OdometerText text="ODOMETER" start={4} style={{ fontFamily: fonts.sans, fontWeight: 900, fontSize: 130, color: colors.ink }} />
    </div>
    <div style={{ ...center, top: 900 }}>
      <MonoCounter from={0} to={600000000} start={22} end={60} size={96} format={(n) => `$${Math.round(n).toLocaleString("en-US")}`} />
    </div>
  </>
);

const Waves: React.FC = () => (
  <>
    <Img src={staticFile("assets/earth.png")} style={{ position: "absolute", width: 1080, top: 0, opacity: 0.9 }} />
    <RadioWaves x={430} y={700} start={6} maxRadius={260} />
  </>
);

const Screen: React.FC = () => (
  <>
    <div
      style={{
        position: "absolute",
        top: 520,
        left: 90,
        right: 90,
        padding: 50,
        background: "#fff",
        boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
        fontFamily: fonts.serif,
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 64, lineHeight: 1.1 }}>Nixon closes the gold window</div>
      <div style={{ fontFamily: fonts.mono, fontSize: 26, color: colors.muted, marginTop: 20 }}>WORLD · BUSINESS · OPINION</div>
    </div>
    <Cursor
      keys={[
        { at: 0, x: 900, y: 1300 },
        { at: 22, x: 560, y: 760, variant: "arrow" },
        { at: 34, x: 600, y: 770, variant: "hand" },
        { at: 40, x: 600, y: 770, variant: "hand", click: true },
        { at: 70, x: 640, y: 1000, variant: "arrow" },
      ]}
    />
  </>
);

const Markups: React.FC = () => (
  <>
    <div style={{ ...center, top: 560, fontFamily: fonts.serif, fontWeight: 900, fontSize: 92, color: colors.ink }}>
      no focal point
    </div>
    <MarkerUnderline x1={250} x2={830} y={690} start={6} color="#5b5bd6" />
    <MarkerCircle cx={540} cy={900} rx={150} start={18} texture="chalk" color="#5b5bd6" />
    <MarkerArrow from={{ x: 860, y: 1200 }} to={{ x: 690, y: 960 }} start={30} color={colors.marker} />
    <LookHere x={540} y={900} label="look here first" labelOffset={175} start={44} />
  </>
);

const SpotlightDemo: React.FC = () => (
  <Spotlight x={430} y={700} radius={180} start={10}>
    <Img src={staticFile("assets/earth.png")} style={{ position: "absolute", width: 1080, top: 0 }} />
  </Spotlight>
);

const Parallax: React.FC = () => (
  <ParallaxStill
    start={0}
    end={PANEL}
    zoom={0.3}
    panX={-90}
    panY={-30}
    filter="sepia(0.3)"
    layers={[
      { src: "assets/cash-bg.png", depth: 0.15, blur: 2 },
      { src: "assets/cash-fg.png", depth: 1 },
    ]}
  />
);

export const KIT_DEMO_FRAMES = PANEL * 9;

// Reference reel: every Vox Kit piece, one at a time.
export const KitDemo: React.FC = () => (
  <AbsoluteFill>
    <Panel index={0} title="CUT THE CURVE" dark>
      <CurveCut />
    </Panel>
    <Panel index={1} title="FILL TEXT">
      <Typography />
    </Panel>
    <Panel index={2} title="RANDOM LETTERS">
      <Random />
    </Panel>
    <Panel index={3} title="ODOMETER + MONO COUNTER">
      <Odometer />
    </Panel>
    <Panel index={4} title="RADIO WAVES" dark>
      <Waves />
    </Panel>
    <Panel index={5} title="CURSOR">
      <Screen />
    </Panel>
    <Panel index={6} title="HAND-DRAWN MARKUPS">
      <Markups />
    </Panel>
    <Panel index={7} title="SPOTLIGHT" dark>
      <SpotlightDemo />
    </Panel>
    <Panel index={8} title="PARALLAX" dark>
      <Parallax />
    </Panel>
    <Grain />
  </AbsoluteFill>
);

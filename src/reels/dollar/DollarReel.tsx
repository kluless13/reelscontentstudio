import { AbsoluteFill } from "remotion";
import { Chrome } from "../../components/Chrome";
import { Grain } from "../../components/Grain";
import { Soundtrack } from "../../components/Soundtrack";
import { BrandBug } from "../../kit";
import { collage, collageFonts, PillCaptions } from "../../kit/collage";
import cpi from "./cpi.json";
import { CUES } from "./cues";
import { DecadeScene } from "./DecadeScene";
import { HookScene } from "./HookScene";
import { dollarVo, END, PHRASES } from "./timing";

// Money, Explained · 03 — "What your dollar used to be" (collage style).
export const DollarReel: React.FC = () => (
  <AbsoluteFill style={{ background: collage.cream }}>
    <HookScene />
    <DecadeScene />
    <PillCaptions phrases={PHRASES} until={END} y={1420} font={collageFonts.pill} />
    <div
      style={{
        position: "absolute",
        top: 1520,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: collageFonts.type,
        fontSize: 22,
        color: collage.charcoal,
        opacity: 0.7,
      }}
    >
      $1 in each year, in {cpi.latest.slice(0, 7)} dollars · BLS CPI-U via FRED
    </div>
    <Soundtrack voOffset={dollarVo.offset} cues={CUES} voSrc="audio/dollar/vo.mp3" musicSrc="audio/dollar/music.mp3" />
    <Chrome cuts={[]} tag="MONEY, EXPLAINED · 03" font={collageFonts.type} accent={collage.pink} />
    <BrandBug />
    <Grain opacity={0.22} />
  </AbsoluteFill>
);

export const DOLLAR_FRAMES = END;

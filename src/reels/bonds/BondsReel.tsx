import { AbsoluteFill } from "remotion";
import { Chrome } from "../../components/Chrome";
import { Grain } from "../../components/Grain";
import { PhraseCaptions } from "../../components/PhraseCaptions";
import { Soundtrack } from "../../components/Soundtrack";
import { BrandBug, GridPaper } from "../../kit";
import { ChartScene } from "./ChartScene";
import { CUES } from "./cues";
import { HookScene } from "./HookScene";
import { MortgageScene } from "./MortgageScene";
import { bondsVo, END, PHRASES } from "./timing";

// Money, Explained · 02 — "The 45-Year Round Trip" (10-year Treasury yield, 1981 → 2026).
export const BondsReel: React.FC = () => (
  <AbsoluteFill>
    <GridPaper />
    <HookScene />
    <ChartScene />
    <MortgageScene />
    <PhraseCaptions phrases={PHRASES} until={END} />
    <Soundtrack
      voOffset={bondsVo.offset}
      cues={CUES}
      voSrc="audio/bonds/vo.mp3"
      musicSrc="audio/bonds/music.mp3"
    />
    <Chrome cuts={[]} tag="MONEY, EXPLAINED · 02" />
    <BrandBug />
    <Grain />
  </AbsoluteFill>
);

export const BONDS_FRAMES = END;

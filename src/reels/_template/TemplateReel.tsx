import { AbsoluteFill } from "remotion";
import { Chrome } from "../../components/Chrome";
import { Grain } from "../../components/Grain";
import { PhraseCaptions } from "../../components/PhraseCaptions";
import { BrandBug, FillText, GridPaper, MarkerCircle, MonoCounter } from "../../kit";
import { colors, fonts } from "../../theme";
import { B, PHRASES, TEMPLATE_FRAMES } from "./timing";

// Minimal reel showing the house structure:
// background → content scenes → captions → chrome (series tag + progress) → logo → grain → sound.
// Add <Soundtrack voSrc="audio/<reel>/vo.mp3" musicSrc="audio/<reel>/music.mp3" cues={CUES} voOffset={vo.offset} />
// once the narration exists.
export const TemplateReel: React.FC = () => (
  <AbsoluteFill>
    <GridPaper />

    <div style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center" }}>
      <FillText text="RENT ×2" start={B.doubled} style={{ fontFamily: fonts.sans, fontWeight: 900, fontSize: 150, color: colors.ink }} />
    </div>

    <div style={{ position: "absolute", top: 800, left: 0, right: 0, textAlign: "center" }}>
      <MonoCounter from={0} to={100} start={B.doubled} end={B.wages} size={200} format={(n) => `+${Math.round(n)}%`} />
    </div>
    <MarkerCircle cx={540} cy={900} rx={330} ry={150} start={B.gap} />

    <PhraseCaptions phrases={PHRASES} until={TEMPLATE_FRAMES} />
    <Chrome cuts={[]} tag="MONEY, EXPLAINED · NN" />
    <BrandBug />
    <Grain />
  </AbsoluteFill>
);

export { TEMPLATE_FRAMES };

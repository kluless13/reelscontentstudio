import { interpolate, useCurrentFrame } from "remotion";
import type { Phrase } from "../../components/PhraseCaptions";
import { collage } from "./palette";

// Reference-style caption: condensed caps in a rounded pink pill, phrase by phrase.
export const PillCaptions: React.FC<{ phrases: Phrase[]; until: number; y: number; font: string }> = ({ phrases, until, y, font }) => {
  const frame = useCurrentFrame();
  const i = phrases.findIndex((p, idx) => frame >= p.at && frame < (phrases[idx + 1]?.at ?? until));
  if (i < 0) return null;
  const p = phrases[i];
  const pop = interpolate(frame, [p.at, p.at + 4], [0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: y, left: 60, right: 60, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          transform: `scale(${pop})`,
          background: collage.pink,
          color: collage.offWhite,
          fontFamily: font,
          fontWeight: 700,
          fontSize: 38,
          whiteSpace: "nowrap",
          letterSpacing: 1,
          textTransform: "uppercase",
          padding: "10px 28px",
          borderRadius: 60,
          textAlign: "center",
          maxWidth: 920,
          lineHeight: 1.2,
        }}
      >
        {p.text}
      </div>
    </div>
  );
};

import { interpolate, useCurrentFrame } from "remotion";
import { colors, fonts } from "../theme";

export type Phrase = { at: number; text: string };

// Phrase-level captions (readable on mute). Each phrase holds until the next one starts.
// Use when narration spells numbers out ("sixteen percent") but the screen should show "16%".
export const PhraseCaptions: React.FC<{ phrases: Phrase[]; until: number; y?: number }> = ({ phrases, until, y = 1560 }) => {
  const frame = useCurrentFrame();
  const i = phrases.findIndex((p, idx) => frame >= p.at && frame < (phrases[idx + 1]?.at ?? until));
  if (i < 0) return null;
  const p = phrases[i];
  const inP = interpolate(frame, [p.at, p.at + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: y, left: 70, right: 70, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          opacity: inP,
          transform: `translateY(${(1 - inP) * 12}px)`,
          background: colors.ink,
          color: colors.paper,
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: 46,
          lineHeight: 1.25,
          padding: "12px 24px",
          textAlign: "center",
          maxWidth: 900,
          boxDecorationBreak: "clone",
        }}
      >
        {p.text}
      </div>
    </div>
  );
};

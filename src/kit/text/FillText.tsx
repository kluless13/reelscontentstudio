import { interpolateColors, useCurrentFrame } from "remotion";
import { colors } from "../../theme";
import { splitWords } from "./letters";

type Props = {
  text: string;
  start: number;
  accent?: string;
  color?: string;
  stagger?: number; // frames between letters popping in
  hold?: number; // frames the accent colour holds after the last letter
  fade?: number; // frames to fade accent -> final colour
  style?: React.CSSProperties;
};

// Vox "fill": letters pop in left→right in brand yellow, then fade to charcoal for legibility.
export const FillText: React.FC<Props> = ({
  text,
  start,
  accent = colors.highlighter,
  color = colors.ink,
  stagger = 1.2,
  hold = 6,
  fade = 18,
  style,
}) => {
  const frame = useCurrentFrame();
  const words = splitWords(text);
  let index = 0;
  const total = words.flat().length;
  return (
    <span style={style}>
      {words.map((letters, wi) => (
        <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap", marginRight: wi < words.length - 1 ? "0.28em" : 0 }}>
          {letters.map((ch, li) => {
            const i = index++;
            const appear = start + i * stagger;
            const fadeStart = start + total * stagger + hold + i * stagger * 0.6;
            const c = interpolateColors(frame, [fadeStart, fadeStart + fade], [accent, color]);
            return (
              <span key={li} style={{ color: c, opacity: frame >= appear ? 1 : 0 }}>
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
};

export const fillDuration = (text: string, stagger = 1.2) =>
  Math.ceil(Array.from(text.replace(/ /g, "")).length * stagger);


import { random, useCurrentFrame } from "remotion";
import { splitWords } from "./letters";

type Props = { text: string; start: number; duration?: number; seed?: string; style?: React.CSSProperties };

// Letters snap on in a random order — works best in serif italic.
export const RandomLetters: React.FC<Props> = ({ text, start, duration = 14, seed = "letters", style }) => {
  const frame = useCurrentFrame();
  const words = splitWords(text);
  const total = words.flat().length;
  const order = Array.from({ length: total }, (_, i) => i).sort((a, b) => random(`${seed}-${a}`) - random(`${seed}-${b}`));
  const rank = new Map(order.map((letterIndex, r) => [letterIndex, r]));
  let index = 0;
  return (
    <span style={style}>
      {words.map((letters, wi) => (
        <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap", marginRight: wi < words.length - 1 ? "0.28em" : 0 }}>
          {letters.map((ch, li) => {
            const i = index++;
            const appear = start + ((rank.get(i) ?? 0) / Math.max(1, total - 1)) * duration;
            return (
              <span key={li} style={{ opacity: frame >= appear ? 1 : 0 }}>
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
};

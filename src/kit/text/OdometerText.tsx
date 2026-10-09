import { Easing, interpolate, useCurrentFrame } from "remotion";
import { splitWords } from "./letters";

type Props = {
  text: string;
  start: number;
  stagger?: number;
  roll?: number; // frames each letter takes to roll up
  style?: React.CSSProperties;
};

// Slot-machine reveal: each letter rolls up from below its baseline, staggered left→right.
export const OdometerText: React.FC<Props> = ({ text, start, stagger = 1.6, roll = 8, style }) => {
  const frame = useCurrentFrame();
  const words = splitWords(text);
  let index = 0;
  return (
    <span style={style}>
      {words.map((letters, wi) => (
        <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap", marginRight: wi < words.length - 1 ? "0.28em" : 0 }}>
          {letters.map((ch, li) => {
            const t0 = start + index++ * stagger;
            const y = interpolate(frame, [t0, t0 + roll], [105, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.back(1.4)),
            });
            return (
              <span key={li} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", lineHeight: 1.15 }}>
                <span style={{ display: "inline-block", transform: `translateY(${y}%)` }}>{ch}</span>
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
};

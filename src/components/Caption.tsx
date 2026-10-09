import { interpolate, useCurrentFrame, Easing } from "remotion";
import { colors, fonts } from "../theme";

export type Word = { text: string; highlight?: boolean; at?: number };
type Props = {
  words: Word[];
  start: number;
  y: number;
  size?: number;
  color?: string;
  stagger?: number;
  renderHighlight?: (text: string) => React.ReactNode;
};

// Word-by-word serif caption: each word rises in at its own `at` frame (synced to VO),
// or on a fixed stagger from `start` when no `at` is given.
export const Caption: React.FC<Props> = ({
  words,
  start,
  y,
  size = 76,
  color = colors.ink,
  stagger = 3,
  renderHighlight,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 70,
        right: 70,
        textAlign: "center",
        fontFamily: fonts.serif,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.12,
        color,
      }}
    >
      {words.map((w, i) => {
        const t0 = w.at ?? start + i * stagger;
        const p = interpolate(frame, [t0, t0 + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        return (
          <span
            key={`${w.text}-${i}`}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${(1 - p) * 30}px)`,
              marginRight: "0.25em",
            }}
          >
            {w.highlight && renderHighlight ? renderHighlight(w.text) : w.text}
          </span>
        );
      })}
    </div>
  );
};

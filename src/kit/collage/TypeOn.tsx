import { useCurrentFrame } from "remotion";

// Typewriter reveal: characters appear one by one with a blinking caret.
export const TypeOn: React.FC<{ text: string; start: number; cps?: number; style?: React.CSSProperties; caret?: boolean }> = ({
  text,
  start,
  cps = 1.4,
  style,
  caret = true,
}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - start) / cps)));
  const typing = n < text.length;
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <span style={style}>
      {text.slice(0, n)}
      {caret && (typing || blink) && frame >= start ? <span style={{ opacity: 0.8 }}>▍</span> : null}
    </span>
  );
};

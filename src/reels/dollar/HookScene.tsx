import { interpolate, useCurrentFrame } from "remotion";
import { collage, collageFonts, FramedPhoto } from "../../kit/collage";
import { B, SWAPS } from "./timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Hook: printed cash photo, white serif question over it, "worth?" knocked out in a pink box.
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame >= SWAPS[0]) return null;
  const word = (text: string, at: number, style?: React.CSSProperties) => (
    <span style={{ opacity: frame >= at ? 1 : 0, marginRight: "0.22em", ...style }}>{text}</span>
  );
  const box = interpolate(frame, [B.worth, B.worth + 6], [0, 1], clamp);
  return (
    <>
      <FramedPhoto src="assets/cash.png" at={0} x={540} y={780} width={820} aspect={1.1} />
      <div
        style={{
          position: "absolute",
          top: 640,
          left: 175,
          right: 175,
          fontFamily: collageFonts.display,
          fontWeight: 700,
          fontSize: 86,
          lineHeight: 1.05,
          color: collage.offWhite,
          textShadow: "0 4px 18px rgba(20,24,26,0.55)",
        }}
      >
        {word("What", 2)}
        {word("was", 7)}
        {word("a", 10)}
        {word("dollar", 13)}
        <br />
        {word("really", 25)}
        <span
          style={{
            position: "relative",
            display: "inline-block",
            opacity: frame >= B.worth - 2 ? 1 : 0,
            padding: "0 14px",
            textShadow: "none",
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: "10px 0 0 0",
              background: collage.pink,
              transform: `scaleX(${box})`,
              transformOrigin: "left",
            }}
          />
          <span style={{ position: "relative" }}>worth?</span>
        </span>
      </div>
    </>
  );
};

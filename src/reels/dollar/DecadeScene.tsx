import { interpolate, useCurrentFrame } from "remotion";
import {
  collage,
  collageFonts,
  CornerBrackets,
  DecadeTimeline,
  FramedPhoto,
  Posterize,
  TypeOn,
} from "../../kit/collage";
import { B, DECADES, SWAPS } from "./timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const NUMBER_TOP = 990;

const activeAt = (frame: number) => {
  let i = 0;
  SWAPS.forEach((s, idx) => {
    if (frame >= s) i = idx;
  });
  return i;
};

// Decade collage: photo swaps per decade (stop-motion), typed label, big pink figure,
// "today" in white italic over the photo, timeline dot hopping along.
export const DecadeScene: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < SWAPS[0]) return null;
  const i = activeAt(frame);
  const d = DECADES[i];
  const at = SWAPS[i];
  const chip = interpolate(frame, [B.depression, B.depression + 5], [0, 1], clamp) * interpolate(frame, [SWAPS[3] - 4, SWAPS[3]], [1, 0], clamp);
  const today = interpolate(frame, [SWAPS[0] + 4, SWAPS[0] + 10], [0, 1], clamp);
  return (
    <>
      <Posterize step={2}>
        <FramedPhoto key={d.year} src={`decades/${d.year}.jpg`} at={at} x={540} y={700} width={820} />
      </Posterize>

      <div style={{ position: "absolute", top: 230, left: 90, right: 90, fontFamily: collageFonts.type, fontSize: 52, color: collage.charcoal }}>
        <TypeOn key={d.year} text={`$1 in ${d.year} is worth`} start={at} cps={i >= 3 && i <= 9 ? 0.6 : 1.2} />
      </div>

      {chip > 0 ? (
        <div
          style={{
            position: "absolute",
            top: 400,
            left: 130,
            opacity: chip,
            transform: `translateX(${(1 - chip) * -20}px) rotate(-2deg)`,
            background: collage.teal,
            color: collage.offWhite,
            fontFamily: collageFonts.display,
            fontWeight: 700,
            fontSize: 44,
            padding: "6px 20px",
          }}
        >
          prices fell in the Depression
        </div>
      ) : null}

      <Posterize step={2}>
        <div
          style={{
            position: "absolute",
            top: NUMBER_TOP,
            left: 70,
            fontFamily: collageFonts.numbers,
            fontWeight: 700,
            fontSize: 210,
            lineHeight: 1,
            color: collage.pink,
            letterSpacing: -6,
            textShadow: `0 6px 0 ${collage.cream}`,
          }}
        >
          ${d.worth.toFixed(2)}
        </div>
        <div
          style={{
            position: "absolute",
            // Sits on the photo, fully above the figure — words overlap the photo, never each other.
            top: NUMBER_TOP - 175,
            right: 110,
            opacity: today,
            fontFamily: collageFonts.italic,
            fontStyle: "italic",
            fontWeight: 900,
            fontSize: 132,
            color: collage.offWhite,
            textShadow: "0 4px 16px rgba(20,24,26,0.55)",
            transform: "rotate(-4deg)",
          }}
        >
          today
        </div>
      </Posterize>

      {frame >= B.twentyFour && frame < SWAPS[3] ? <CornerBrackets x={48} y={NUMBER_TOP - 14} w={760} h={240} start={B.twentyFour} /> : null}
      {frame >= B.twentyNine ? <CornerBrackets x={48} y={NUMBER_TOP - 14} w={630} h={240} start={B.twentyNine} /> : null}

      <DecadeTimeline
        years={DECADES.map((x) => x.year)}
        active={i}
        prevActive={Math.max(0, i - 1)}
        changedAt={at}
        y={1270}
        x0={90}
        x1={990}
        font={collageFonts.type}
      />
    </>
  );
};

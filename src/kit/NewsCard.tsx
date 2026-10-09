import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors } from "../theme";
import { Cursor, CursorKey } from "./Cursor";
import { MarkerCircle, MarkerUnderline } from "./markup/Markers";

export type Box = { x: number; y: number; w: number; h: number }; // source-image pixels
export type CardMark = {
  box: Box;
  at: number;
  kind: "highlight" | "underline" | "circle";
  color?: string;
  duration?: number;
};

type Props = {
  src: string;
  imgW: number;
  imgH: number;
  width: number; // on-screen width of the card
  x: number; // on-screen centre
  y: number;
  rotate?: number;
  enter: number;
  exit?: number;
  focus?: { box: Box; from: number; to: number; zoom: number };
  marks?: CardMark[];
  cursor?: CursorKey[]; // in source-image pixels
  seed?: string;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Torn-paper outline: straight sides, ragged bottom (and a slightly uneven top).
const tornClip = (seed: string): string => {
  const bottom = Array.from({ length: 34 }, (_, i) => {
    const x = 100 - (i / 33) * 100;
    const y = 96.2 + random(`${seed}-b${i}`) * 3.8;
    return `${x.toFixed(2)}% ${y.toFixed(2)}%`;
  });
  const top = Array.from({ length: 12 }, (_, i) => {
    const x = (i / 11) * 100;
    const y = random(`${seed}-t${i}`) * 0.9;
    return `${x.toFixed(2)}% ${y.toFixed(2)}%`;
  });
  return `polygon(${[...top, ...bottom].join(", ")})`;
};

// A real screenshot treated as a printed clipping: torn edge, tilt, shadow, halftone + paper
// texture, a slow push-in, highlighter/marker marks and an optional cursor, all pinned to the
// screenshot's own pixel coordinates.
export const NewsCard: React.FC<Props> = ({
  src,
  imgW,
  imgH,
  width,
  x,
  y,
  rotate = -2.5,
  enter,
  exit,
  focus,
  marks = [],
  cursor,
  seed = src,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enter || (exit !== undefined && frame > exit + 14)) return null;

  const k = width / imgW;
  const height = imgH * k;
  const inS = spring({ frame: frame - enter, fps, config: { damping: 16, stiffness: 140 } });
  const out = exit === undefined ? 0 : interpolate(frame, [exit, exit + 14], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const enterY = (1 - inS) * 900 - out * 1500;
  const enterRot = rotate + (1 - inS) * 8 - out * 14;

  const push = focus ? interpolate(frame, [focus.from, focus.to], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) }) : 0;
  const zoom = focus ? 1 + (focus.zoom - 1) * push : 1;
  const fx = focus ? (focus.box.x + focus.box.w / 2) * k : width / 2;
  const fy = focus ? (focus.box.y + focus.box.h / 2) * k : height / 2;
  // Slide the focus point toward the card centre as we push in.
  const shiftX = (width / 2 - fx) * push;
  const shiftY = (height / 2 - fy) * push;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: x - width / 2,
          top: y - height / 2,
          width,
          height,
          transform: `translateY(${enterY}px) rotate(${enterRot}deg)`,
          filter: "drop-shadow(0 26px 28px rgba(40,25,10,0.45)) drop-shadow(0 4px 4px rgba(40,25,10,0.3))",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: `${fx}px ${fy}px`,
            transform: `translate(${shiftX}px, ${shiftY}px) scale(${zoom})`,
          }}
        >
          <div style={{ position: "absolute", inset: 0, clipPath: tornClip(seed), overflow: "hidden", background: "#fff" }}>
            <Img
              src={staticFile(src)}
              style={{ width, height, display: "block", filter: "contrast(1.06) saturate(0.82) sepia(0.12)" }}
            />
            {marks
              .filter((m) => m.kind === "highlight")
              .map((m, i) => {
                const p = interpolate(frame, [m.at, m.at + (m.duration ?? 8)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
                return (
                  <div
                    key={`h${i}`}
                    style={{
                      position: "absolute",
                      left: m.box.x * k - 6,
                      top: m.box.y * k,
                      width: m.box.w * k + 12,
                      height: m.box.h * k,
                      background: m.color ?? colors.highlighter,
                      mixBlendMode: "multiply",
                      transform: `scaleX(${p})`,
                      transformOrigin: "left center",
                      borderRadius: 4,
                    }}
                  />
                );
              })}
            {/* Halftone print dots */}
            <AbsoluteFill
              style={{
                backgroundImage: "radial-gradient(rgba(0,0,0,0.55) 0.9px, transparent 1.3px)",
                backgroundSize: "5px 5px",
                mixBlendMode: "multiply",
                opacity: 0.22,
              }}
            />
            {/* Paper fibre + warm print tone */}
            <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.3 }}>
              <filter id={`paper-${seed.replace(/[^a-z0-9]/gi, "")}`}>
                <feTurbulence type="fractalNoise" baseFrequency="0.7 0.04" numOctaves="3" seed={7} />
                <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0.9 0" />
              </filter>
              <rect width="100%" height="100%" filter={`url(#paper-${seed.replace(/[^a-z0-9]/gi, "")})`} />
            </svg>
            <AbsoluteFill style={{ background: "rgba(214,186,140,0.12)", mixBlendMode: "multiply" }} />
          </div>
          {marks
            .filter((m) => m.kind !== "highlight")
            .map((m, i) =>
              m.kind === "underline" ? (
                <MarkerUnderline
                  key={`u${i}`}
                  x1={m.box.x * k}
                  x2={(m.box.x + m.box.w) * k}
                  y={(m.box.y + m.box.h) * k + 6}
                  start={m.at}
                  duration={m.duration ?? 10}
                  color={m.color ?? colors.marker}
                  width={10}
                />
              ) : (
                <MarkerCircle
                  key={`c${i}`}
                  cx={(m.box.x + m.box.w / 2) * k}
                  cy={(m.box.y + m.box.h / 2) * k}
                  rx={(m.box.w / 2) * k + 24}
                  ry={(m.box.h / 2) * k + 18}
                  start={m.at}
                  duration={m.duration ?? 14}
                  color={m.color ?? colors.marker}
                  width={10}
                />
              ),
            )}
          {cursor ? <Cursor keys={cursor.map((c) => ({ ...c, x: c.x * k, y: c.y * k }))} scale={1.3} /> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

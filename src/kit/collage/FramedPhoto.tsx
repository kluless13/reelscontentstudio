import { random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { collage } from "./palette";
import { PrintedPhoto } from "./PrintedPhoto";

type Props = {
  src: string;
  at: number; // frame this photo swaps in
  x: number;
  y: number;
  width: number;
  aspect?: number;
  border?: number;
};

// Collage photo: printed treatment inside a thick charcoal frame, with a random tilt and a
// little snap-in each time it swaps — the stop-motion feel of the reference.
export const FramedPhoto: React.FC<Props> = ({ src, at, x, y, width, aspect = 0.75, border = 14 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = width * aspect;
  const rot = (random(`rot-${src}`) - 0.5) * 9;
  const dx = (random(`dx-${src}`) - 0.5) * 40;
  const snap = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 260 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2 - border + dx,
        top: y - h / 2 - border,
        padding: border,
        background: collage.charcoal,
        transform: `rotate(${rot}deg) scale(${0.94 + 0.06 * snap})`,
        boxShadow: "0 18px 30px rgba(30,30,30,0.25)",
      }}
    >
      <PrintedPhoto src={src} width={width} height={h} />
    </div>
  );
};

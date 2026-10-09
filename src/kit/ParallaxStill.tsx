import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

export type ParallaxLayer = { src: string; depth: number; blur?: number };

type Props = {
  layers: ParallaxLayer[]; // back to front; depth 0 = far, 1 = near
  start: number;
  end: number;
  zoom?: number; // extra scale on the nearest layer across the move
  panX?: number; // px the nearest layer travels horizontally
  panY?: number;
  filter?: string;
};

// 2.5D "make photos feel like video": layers drift at speeds proportional to depth.
export const ParallaxStill: React.FC<Props> = ({ layers, start, end, zoom = 0.16, panX = -60, panY = -20, filter }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  return (
    <AbsoluteFill style={{ filter, overflow: "hidden" }}>
      {layers.map((l) => {
        const scale = 1.08 + l.depth * zoom * p;
        const tx = l.depth * panX * p;
        const ty = l.depth * panY * p;
        return (
          <AbsoluteFill key={l.src} style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})` }}>
            <Img
              src={staticFile(l.src)}
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: l.blur ? `blur(${l.blur}px)` : undefined }}
            />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

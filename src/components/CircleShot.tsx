import { Img, staticFile } from "remotion";

// Circle geometry measured in source-image pixels (752x1344 Higgsfield stills).
export type CircleShotSource = {
  src: string;
  imgW: number;
  imgH: number;
  cx: number;
  cy: number;
  d: number;
};


type Props = {
  shot: CircleShotSource;
  x: number;
  y: number;
  diameter: number;
  innerRotate?: number;
};

// Renders a still so its circular subject lands exactly on (x, y) at `diameter`.
// Every match cut uses the same x/y/diameter, so swapping `shot` is a perfect shape match.
export const CircleShot: React.FC<Props> = ({ shot, x, y, diameter, innerRotate = 0 }) => {
  const scale = diameter / (shot.d * 0.96);
  return (
    <div
      style={{
        position: "absolute",
        left: x - diameter / 2,
        top: y - diameter / 2,
        width: diameter,
        height: diameter,
        borderRadius: "50%",
        overflow: "hidden",
        boxShadow: "0 30px 60px rgba(40,25,10,0.35)",
      }}
    >
      <Img
        src={staticFile(shot.src)}
        style={{
          position: "absolute",
          width: shot.imgW * scale,
          height: shot.imgH * scale,
          left: diameter / 2 - shot.cx * scale,
          top: diameter / 2 - shot.cy * scale,
          transform: `rotate(${innerRotate}deg)`,
          transformOrigin: `${shot.cx * scale}px ${shot.cy * scale}px`,
        }}
      />
    </div>
  );
};

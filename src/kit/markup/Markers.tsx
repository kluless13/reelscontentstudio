import { interpolate, useCurrentFrame } from "remotion";
import { colors, fonts } from "../../theme";
import { DrawPath, DrawProps } from "./DrawPath";
import { arrowPaths, loopPath, polyPath, underlinePath, xPaths } from "./shapes";

type Pt = { x: number; y: number };

export const MarkerCircle: React.FC<DrawProps & { cx: number; cy: number; rx: number; ry?: number; tilt?: number }> = ({
  cx,
  cy,
  rx,
  ry,
  tilt,
  ...draw
}) => <DrawPath d={loopPath(cx, cy, rx, ry ?? rx * 0.92, tilt)} {...draw} />;

export const MarkerArrow: React.FC<DrawProps & { from: Pt; to: Pt; bend?: number }> = ({ from, to, bend, ...draw }) => (
  <DrawPath d={arrowPaths(from, to, bend)} {...draw} />
);

export const MarkerUnderline: React.FC<DrawProps & { x1: number; x2: number; y: number }> = ({ x1, x2, y, ...draw }) => (
  <DrawPath d={underlinePath(x1, x2, y)} {...draw} />
);

export const RegionOutline: React.FC<DrawProps & { points: Pt[] }> = ({ points, ...draw }) => (
  <DrawPath d={polyPath(points)} {...draw} />
);

// "Look here first": an X on the spot, then an italic handwritten-style label.
export const LookHere: React.FC<
  DrawProps & { x: number; y: number; label: string; labelSide?: "left" | "right"; labelOffset?: number; halo?: boolean }
> = ({
  x,
  y,
  label,
  labelSide = "right",
  labelOffset = 50,
  halo = false,
  start,
  color = colors.marker,
  ...draw
}) => {
  const frame = useCurrentFrame();
  const textIn = interpolate(frame, [start + 8, start + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <DrawPath d={xPaths(x, y, 26)} start={start} duration={8} color={color} width={10} {...draw} />
      <div
        style={{
          position: "absolute",
          top: y,
          left: labelSide === "right" ? x + labelOffset : undefined,
          right: labelSide === "left" ? 1080 - x + labelOffset : undefined,
          transform: `translateY(-50%) translateX(${(1 - textIn) * (labelSide === "right" ? -14 : 14)}px)`,
          opacity: textIn,
          fontFamily: fonts.serif,
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: 48,
          color,
          whiteSpace: "nowrap",
          // Paper-coloured halo keeps the label legible over busy lines.
          textShadow: halo ? `0 0 6px ${colors.paper}, 0 0 12px ${colors.paper}, 0 0 3px ${colors.paper}` : undefined,
        }}
      >
        {label}
      </div>
    </>
  );
};

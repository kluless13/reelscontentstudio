import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

type Props = {
  children: React.ReactNode;
  x: number;
  y: number;
  radius: number;
  start: number;
  duration?: number;
};

// "No focal point" fix: the frame drains to grey, and only the focal region keeps its colour.
export const Spotlight: React.FC<Props> = ({ children, x, y, radius, start, duration = 12 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: `grayscale(${p}) brightness(${1 - 0.35 * p})` }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `circle(${radius * p}px at ${x}px ${y}px)` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

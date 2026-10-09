import { Freeze, useCurrentFrame } from "remotion";

// "Posterize time": holds each pose for `step` frames so motion steps like cut paper.
export const Posterize: React.FC<{ step?: number; children: React.ReactNode }> = ({ step = 2, children }) => {
  const frame = useCurrentFrame();
  return <Freeze frame={Math.floor(frame / step) * step}>{children}</Freeze>;
};

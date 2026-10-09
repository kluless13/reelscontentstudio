import { useCurrentFrame } from "remotion";

// Show children only in [from, to). Children keep absolute (master-timeline) frame numbers.
export const Window: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  return frame >= from && frame < to ? <>{children}</> : null;
};

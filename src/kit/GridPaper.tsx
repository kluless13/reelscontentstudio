import { AbsoluteFill } from "remotion";
import { colors } from "../theme";

type Props = { cell?: number; dark?: boolean };

// Graph-paper backdrop seen across the Vox references: fine grid + warm vignette.
export const GridPaper: React.FC<Props> = ({ cell = 72, dark = false }) => {
  const base = dark ? "#232220" : colors.paper;
  const line = dark ? "rgba(255,255,255,0.05)" : "rgba(60,80,110,0.10)";
  return (
    <AbsoluteFill style={{ backgroundColor: base }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${line} 2px, transparent 2px), linear-gradient(90deg, ${line} 2px, transparent 2px)`,
          backgroundSize: `${cell}px ${cell}px`,
          backgroundPosition: "center center",
        }}
      />
      <AbsoluteFill
        style={{ background: `radial-gradient(ellipse at 50% 45%, transparent 55%, ${dark ? "rgba(0,0,0,0.5)" : "rgba(120,95,60,0.18)"} 100%)` }}
      />
    </AbsoluteFill>
  );
};

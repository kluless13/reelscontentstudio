import { AbsoluteFill } from "remotion";
import { colors } from "../theme";

// Warm paper backdrop with a soft vignette — the base layer of the Vox look.
export const Paper: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: colors.paper,
      background: `radial-gradient(ellipse at 50% 45%, ${colors.paper} 55%, ${colors.paperDark} 100%)`,
    }}
  />
);

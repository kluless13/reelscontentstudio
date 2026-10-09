import { Img, staticFile } from "remotion";

type Props = { src?: string; width?: number; onDark?: boolean; opacity?: number };

// Brand logo, bottom-right on every frame. The source file is white, so on light
// scenes it's rendered charcoal; pass onDark for white.
export const BrandBug: React.FC<Props> = ({
  src = "assets/Truflation_Logo_White 4.png",
  width = 230,
  onDark = false,
  opacity = 0.92,
}) => (
  <Img
    src={staticFile(src)}
    style={{
      position: "absolute",
      right: 64,
      bottom: 70,
      width,
      opacity,
      filter: onDark ? undefined : "brightness(0) saturate(0) opacity(0.88)",
    }}
  />
);

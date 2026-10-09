import { Easing, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../../theme";
import { RoughDefs, Texture, useFilterId } from "./Rough";

export type DrawProps = {
  start: number;
  duration?: number;
  color?: string;
  width?: number;
  texture?: Texture;
};

type Props = DrawProps & { d: string | string[] };

// Trim-path draw-on: each sub-path draws in sequence over `duration` frames.
export const DrawPath: React.FC<Props> = ({ d, start, duration = 14, color = colors.marker, width = 12, texture = "rough" }) => {
  const frame = useCurrentFrame();
  const id = useFilterId();
  const paths = Array.isArray(d) ? d : [d];
  const per = duration / paths.length;
  return (
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
      <RoughDefs id={id} texture={texture} />
      <g filter={texture === "clean" ? undefined : `url(#${id})`}>
        {paths.map((p, i) => {
          const t0 = start + i * per;
          const progress = interpolate(frame, [t0, t0 + per], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.quad),
          });
          return (
            <path
              key={i}
              d={p}
              pathLength={1}
              fill="none"
              stroke={color}
              strokeWidth={width}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 1"
              strokeDashoffset={1 - progress}
              opacity={progress > 0 ? 1 : 0}
            />
          );
        })}
      </g>
    </svg>
  );
};

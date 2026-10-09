import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

// Render twice — layer "back" before the circle, "front" after — so chips pass behind it.
type Props = {
  symbols: string[];
  x: number;
  y: number;
  radius: number;
  start: number;
  layer: "back" | "front";
};

// Currency chips riding a dashed elliptical orbit around the circle.
export const Orbit: React.FC<Props> = ({ symbols, x, y, radius, start, layer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - start;
  const ringDraw = interpolate(local, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ry = radius * 0.34;
  return (
    <>
      {layer === "back" ? (
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <ellipse
          cx={x}
          cy={y}
          rx={radius}
          ry={ry}
          fill="none"
          stroke={colors.ink}
          strokeWidth={3}
          strokeDasharray={`10 12`}
          opacity={0.7 * ringDraw}
          transform={`rotate(-14 ${x} ${y})`}
        />
      </svg>
      ) : null}
      {symbols.map((sym, i) => {
        const pop = spring({ frame: local - 4 - i * 3, fps, config: { damping: 12, stiffness: 180 } });
        const angle = (i / symbols.length) * Math.PI * 2 + local * 0.035;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * ry;
        const rot = (-14 * Math.PI) / 180;
        const ox = px * Math.cos(rot) - py * Math.sin(rot);
        const oy = px * Math.sin(rot) + py * Math.cos(rot);
        const behind = Math.sin(angle) < 0;
        if (behind !== (layer === "back")) return null;
        return (
          <div
            key={sym}
            style={{
              position: "absolute",
              left: x + ox,
              top: y + oy,
              transform: `translate(-50%, -50%) scale(${pop * (behind ? 0.8 : 1)})`,
              width: 104,
              height: 104,
              borderRadius: "50%",
              background: i % 2 === 0 ? colors.highlighter : colors.paper,
              border: `5px solid ${colors.ink}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.sans,
              fontWeight: 900,
              fontSize: 56,
              color: colors.ink,
              opacity: behind ? 0.7 : 1,
            }}
          >
            {sym}
          </div>
        );
      })}
    </>
  );
};

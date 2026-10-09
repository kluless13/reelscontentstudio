import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { collage } from "./palette";

type Props = {
  years: number[];
  active: number; // index of current year
  changedAt: number; // frame the active index last changed
  prevActive: number;
  y: number;
  x0?: number;
  x1?: number;
  font: string;
};

// Row of years with a pink dot that hops to the active one.
export const DecadeTimeline: React.FC<Props> = ({ years, active, changedAt, prevActive, y, x0 = 80, x1 = 1000, font }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const step = (x1 - x0) / (years.length - 1);
  const hop = spring({ frame: frame - changedAt, fps, config: { damping: 15, stiffness: 240 } });
  const dotX = x0 + step * (prevActive + (active - prevActive) * hop);
  const lift = Math.sin(hop * Math.PI) * -26;
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: 1080, height: 80 }}>
      <div
        style={{
          position: "absolute",
          left: dotX - 40,
          top: 4 + lift,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: collage.pink,
          transform: `translateY(-14px) scale(${interpolate(hop, [0, 0.5, 1], [1, 0.85, 1])})`,
        }}
      />
      {years.map((yr, i) => (
        <div
          key={yr}
          style={{
            position: "absolute",
            left: x0 + step * i,
            top: 18,
            transform: "translateX(-50%)",
            fontFamily: font,
            fontSize: 27,
            color: i === active ? collage.offWhite : collage.charcoal,
            opacity: i === active ? 1 : 0.75,
          }}
        >
          {yr}
        </div>
      ))}
    </div>
  );
};

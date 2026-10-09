import { interpolate, useCurrentFrame } from "remotion";
import { LabelBox } from "../../components/LabelBox";
import { Stamp } from "../../components/Stamp";
import { MonoCounter, NewsCard } from "../../kit";
import { colors, fonts } from "../../theme";
import { B } from "./timing";

// Monthly payment on a $400k, 30-yr fixed (standard amortisation).
// Rates: 2021 average 2.96% vs 7.28% on 1 Oct 2026 — Freddie Mac PMMS via FRED (MORTGAGE30US).
const PAY_2021 = 1686;
const PAY_NOW = 2737;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Row: React.FC<{ label: string; at: number; children: React.ReactNode; y: number; accent?: boolean }> = ({
  label,
  at,
  children,
  y,
  accent,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 6], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 120,
        right: 120,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        opacity: o,
        transform: `translateX(${(1 - o) * -30}px)`,
        borderBottom: `3px solid ${colors.ink}`,
        paddingBottom: 12,
      }}
    >
      <span style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 34, letterSpacing: 3, color: accent ? colors.marker : colors.muted }}>
        {label}
      </span>
      <span style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 92, color: accent ? colors.marker : colors.ink }}>{children}</span>
    </div>
  );
};

export const MortgageScene: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < B.why) return null;
  const foot = interpolate(frame, [B.more + 10, B.more + 18], [0, 1], clamp);
  const countStart = B.amount + 30;
  return (
    <>
      <NewsCard src="assets/house.png" imgW={1168} imgH={880} width={820} x={540} y={640} rotate={-2} enter={B.why + 6} seed="house" />
      <LabelBox text="$400K MORTGAGE · 30-YR FIXED" start={B.amount - 6} x={540} y={980} />
      <Row label="2021" at={B.amount + 6} y={1080}>
        ${PAY_2021.toLocaleString("en-US")}
        <span style={{ fontSize: 40 }}>/mo</span>
      </Row>
      <Row label="NOW" at={countStart - 4} y={1220} accent>
        <MonoCounter
          from={PAY_2021}
          to={PAY_NOW}
          start={countStart}
          end={B.more}
          size={92}
          color={colors.marker}
          format={(n) => `$${Math.round(n).toLocaleString("en-US")}`}
        />
        <span style={{ fontSize: 40 }}>/mo</span>
      </Row>
      <Stamp text="+$1,051 / MONTH" start={B.more + 2} x={560} y={1395} rotate={-4} />
      <div
        style={{
          position: "absolute",
          top: 1508,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: fonts.mono,
          fontSize: 22,
          color: colors.muted,
          opacity: foot,
        }}
      >
        Avg 30-yr rate 2.96% (2021) vs 7.28% (Oct 2026) · Freddie Mac via FRED
      </div>
    </>
  );
};

import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ChartCallout, ChartCamera, intersect, LineChart, MarkerCircle, NewsCard, valueAt, visibleRect } from "../../kit";
import { colors, fonts } from "../../theme";
import { BOTTOM, CAMERA, DATA, DOMAIN, MAY2002, NOW, PEAK, project, RECT, revealAt, VIEWPORT } from "./chartPlan";
import { B } from "./timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Pandemic street photo card (screen space). 1168x880 source at 380px wide.
const STREET = { x: 800, y: 620, w: 380, h: 380 * (880 / 1168) };
// One thing at a time: the photo leaves just before the ROCK BOTTOM callout lands.
const STREET_EXIT = B.half - 16;

// Year + yield readout above the chart; both are read straight off the drawn tip.
const Readout: React.FC<{ reveal: number }> = ({ reveal }) => {
  const year = Math.min(2026, Math.floor(reveal));
  const value = valueAt(DATA, reveal);
  const cell = (label: string, text: string, align: "left" | "right") => (
    <div style={{ textAlign: align }}>
      <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: colors.muted }}>{label}</div>
      <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 104, lineHeight: 1, color: colors.ink, fontVariantNumeric: "tabular-nums" }}>
        {text}
      </div>
    </div>
  );
  return (
    <div style={{ position: "absolute", top: 250, left: 90, right: 90, display: "flex", justifyContent: "space-between" }}>
      {cell("YEAR", String(year), "left")}
      {cell("10-YR TREASURY YIELD", `${value.toFixed(2)}%`, "right")}
    </div>
  );
};

const Chart: React.FC<{ reveal: number }> = ({ reveal }) => {
  const frame = useCurrentFrame();
  const peak = project(PEAK.t, PEAK.v);
  const now = project(NOW.t, NOW.v);
  const may = project(MAY2002.t, MAY2002.v);
  const dash = interpolate(frame, [B.highest, B.highest + 22], [0, 1], clamp);
  // Focus on the 2020 low: the rest of the line greys out, the low stays red.
  // Callouts may only sit where the plot is actually on screen at this moment.
  const bounds = intersect(RECT, visibleRect(CAMERA, frame, { x: 40, y: VIEWPORT.top + 20, w: 1000, h: VIEWPORT.bottom - VIEWPORT.top - 40 }));
  // The pandemic photo card's screen footprint, mapped into chart space so callouts avoid it.
  const photo = visibleRect(CAMERA, frame, { x: STREET.x - STREET.w / 2, y: STREET.y - STREET.h / 2, w: STREET.w, h: STREET.h });
  const dim =
    interpolate(frame, [B.pandemic - 8, B.pandemic + 4], [0, 1], clamp) * interpolate(frame, [B.rise - 4, B.rise + 8], [1, 0], clamp);
  return (
    <ChartCamera keys={CAMERA}>
      <LineChart
        data={DATA}
        reveal={reveal}
        rect={RECT}
        domain={DOMAIN}
        yTicks={[0, 4, 8, 12, 16]}
        xTicks={[1981, 1990, 2000, 2010, 2020]}
        source="SOURCE: FRED · DGS10"
        focus={dim > 0 ? { from: 2019.3, to: 2021.6, dim } : undefined}
      />
      {/* Annotations sit above the data layer and never inside a dim/clip effect */}
      {frame < B.slide ? <MarkerCircle cx={peak.x} cy={peak.y} rx={38} ry={34} start={B.sixteen + 6} width={6} /> : null}
      {frame >= B.half && frame < B.rise + 6 ? (
        <ChartCallout
          data={DATA}
          project={project}
          bounds={bounds}
          avoid={frame < STREET_EXIT + 14 ? [photo] : []}
          point={BOTTOM}
          title="ROCK BOTTOM"
          sub="0.52% · AUG 2020"
          start={B.half}
          upTo={reveal}
        />
      ) : null}
      {frame >= B.highest ? (
        <>
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <line
              x1={now.x}
              y1={now.y}
              x2={now.x + (may.x - now.x) * dash}
              y2={now.y}
              stroke={colors.ink}
              strokeWidth={4}
              strokeDasharray="10 10"
            />
          </svg>
          <ChartCallout
            data={DATA}
            project={project}
            bounds={bounds}
            point={MAY2002}
            title="MAY 2002"
            sub="5.32% · LAST TIME THIS HIGH"
            start={B.y2002}
            upTo={reveal}
            color={colors.ink}
          />
        </>
      ) : null}
    </ChartCamera>
  );
};

// The chart act: rewind → 1981 peak → 40-year slide → 2020 bottom → back up to a 24-year high.
export const ChartScene: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < B.rewind - 2 || frame > B.why + 16) return null;
  const reveal = revealAt(frame);
  const enter = interpolate(frame, [B.rewind - 2, B.rewind + 8], [0, 1], clamp);
  const leave = interpolate(frame, [B.why, B.why + 16], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: enter * (1 - leave), transform: `translateY(${-leave * 160}px)` }}>
      <Readout reveal={reveal} />
      <AbsoluteFill style={{ clipPath: `inset(${VIEWPORT.top}px 0 ${1920 - VIEWPORT.bottom}px 0)` }}>
        <Chart reveal={reveal} />
      </AbsoluteFill>
      {/* Archival photo cards for the two eras */}
      <NewsCard
        src="assets/trading-floor.png"
        imgW={1168}
        imgH={880}
        width={480}
        x={770}
        y={1080}
        rotate={4}
        enter={B.fed - 4}
        exit={B.slide - 8}
        seed="floor"
      />
      <NewsCard
        src="assets/pandemic-street.png"
        imgW={1168}
        imgH={880}
        width={STREET.w}
        x={STREET.x}
        y={STREET.y}
        rotate={4}
        enter={B.pandemic - 2}
        exit={STREET_EXIT}
        seed="street"
      />
      <NewsCard
        src="news/tradingeconomics.png"
        imgW={1370}
        imgH={1060}
        width={860}
        x={540}
        y={900}
        rotate={-2}
        enter={B.today - 6}
        exit={B.highest - 6}
        focus={{ box: { x: 0, y: 0, w: 1150, h: 270 }, from: B.today, to: B.highest, zoom: 1.12 }}
        marks={[{ box: { x: 0, y: 160, w: 690, h: 100 }, at: B.five + 4, kind: "highlight", color: "#ff6b5e", duration: 10 }]}
        seed="te"
      />
    </AbsoluteFill>
  );
};

import { NewsCard } from "../../kit";
import { colors } from "../../theme";
import { B } from "./timing";

// Real headline as a printed clipping: push in, cursor finds "24-Year High", highlighter + marker.
export const HookScene: React.FC = () => (
  <NewsCard
    src="news/insiderfinance.png"
    imgW={1420}
    imgH={700}
    width={960}
    x={540}
    y={880}
    rotate={-2.5}
    enter={0}
    exit={B.rewind}
    focus={{ box: { x: 40, y: 60, w: 1100, h: 370 }, from: 18, to: B.rewind, zoom: 1.22 }}
    marks={[
      { box: { x: 628, y: 200, w: 472, h: 108 }, at: B.highlight24, kind: "highlight", color: colors.highlighter },
      { box: { x: 45, y: 312, w: 285, h: 112 }, at: B.highlightHigh - 4, kind: "highlight", color: colors.highlighter },
      { box: { x: 45, y: 312, w: 285, h: 112 }, at: B.highlightHigh + 6, kind: "underline" },
    ]}
    cursor={[
      { at: 26, x: 1500, y: 900 },
      { at: B.highlight24 - 12, x: 860, y: 270, variant: "arrow" },
      { at: B.highlight24 - 4, x: 850, y: 262, variant: "hand" },
      { at: B.highlight24, x: 850, y: 262, variant: "hand", click: true },
      { at: B.rewind, x: 900, y: 600, variant: "arrow" },
    ]}
    seed="insider"
  />
);

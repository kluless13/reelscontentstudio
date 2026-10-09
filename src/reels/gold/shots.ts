import type { CircleShotSource } from "../../components/CircleShot";

export const SHOTS: Record<"coin" | "clock" | "earth", CircleShotSource> = {
  coin: { src: "assets/coin.png", imgW: 752, imgH: 1344, cx: 376, cy: 642, d: 650 },
  clock: { src: "assets/clock.png", imgW: 752, imgH: 1344, cx: 378, cy: 594, d: 670 },
  earth: { src: "assets/earth.png", imgW: 752, imgH: 1344, cx: 376, cy: 630, d: 720 },
};

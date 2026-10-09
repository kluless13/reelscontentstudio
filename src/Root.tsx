import { Composition } from "remotion";
import { BONDS_FRAMES, BondsReel } from "./reels/bonds/BondsReel";
import { DOLLAR_FRAMES, DollarReel } from "./reels/dollar/DollarReel";
import { GOLD_FRAMES, GoldReel } from "./reels/gold/GoldReel";
import { KIT_DEMO_FRAMES, KitDemo } from "./reels/kit-demo/KitDemo";
import { TEMPLATE_FRAMES, TemplateReel } from "./reels/_template/TemplateReel";
import { FPS, HEIGHT, WIDTH } from "./theme";

// Every reel is 1080×1920 @ 30fps. Register new reels here (see CLAUDE.md → "Making a new reel").
const reels = [
  { id: "GoldReel", component: GoldReel, frames: GOLD_FRAMES }, // 01 · gold standard (match cuts)
  { id: "BondsReel", component: BondsReel, frames: BONDS_FRAMES }, // 02 · 10-yr Treasury (chart + news)
  { id: "DollarReel", component: DollarReel, frames: DOLLAR_FRAMES }, // 03 · dollar by decade (collage)
  { id: "KitDemo", component: KitDemo, frames: KIT_DEMO_FRAMES }, // every kit piece, one at a time
  { id: "TemplateReel", component: TemplateReel, frames: TEMPLATE_FRAMES }, // starting point for new reels
] as const;

export const RemotionRoot: React.FC = () => (
  <>
    {reels.map((r) => (
      <Composition key={r.id} id={r.id} component={r.component} durationInFrames={r.frames} fps={FPS} width={WIDTH} height={HEIGHT} />
    ))}
  </>
);

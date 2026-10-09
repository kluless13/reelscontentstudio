import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// House type: Geist everywhere, Geist Mono for numbers/labels/counters.
const geist = loadGeist("normal", { weights: ["400", "500", "700", "800", "900"], subsets: ["latin"] }).fontFamily;
loadGeist("italic", { weights: ["700", "800"], subsets: ["latin"] });
const geistMono = loadGeistMono("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;

export const fonts = {
  sans: geist,
  // Display/headline face. Kept as a separate key so a serif can be swapped back in per brand.
  serif: geist,
  mono: geistMono,
};

export const colors = {
  paper: "#f2e8d5",
  paperDark: "#e3d6bc",
  ink: "#141414",
  highlighter: "#f7d83b",
  marker: "#e0362c",
  muted: "#6b6255",
};

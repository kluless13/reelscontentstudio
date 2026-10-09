import { loadFont as loadCourier } from "@remotion/google-fonts/CourierPrime";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadElite } from "@remotion/google-fonts/SpecialElite";

// Collage type set, matched to the reference:
//  display  — soft chunky serif for big pink words (Fraunces)
//  italic   — heavy italic serif for overlapping white words (Playfair Display Italic)
//  pill     — condensed caps for caption pills (Oswald)
//  type     — worn typewriter for labels/years (Special Elite)
//  numbers  — monospaced typewriter for figures, so digits never jitter (Courier Prime)
export const collageFonts = {
  display: loadFraunces("normal", { weights: ["700", "900"], subsets: ["latin"] }).fontFamily,
  italic: loadPlayfair("italic", { weights: ["800", "900"], subsets: ["latin"] }).fontFamily,
  pill: loadOswald("normal", { weights: ["600", "700"], subsets: ["latin"] }).fontFamily,
  type: loadElite("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
  numbers: loadCourier("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily,
};

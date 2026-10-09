import words from "../../../public/audio/bonds/vo-words.json";
import { createVoTrack } from "../../voTrack";
import type { Phrase } from "../../components/PhraseCaptions";

export const FPS = 30;
export const bondsVo = createVoTrack(words, FPS, 4);
const f = bondsVo.voFrame;

export const END = bondsVo.voEndFrame() + 40;

// Beat boundaries, keyed to the narration.
export const B = {
  highlight24: f("twentyfouryear"),
  highlightHigh: f("high"),
  rewind: f("rewind"),
  back: f("back"),
  sixteen: f("sixteen"),
  fed: f("fed"),
  slide: f("fortyyear"),
  pandemic: f("pandemic"),
  half: f("half"),
  rise: f("inflation", 1),
  today: f("today"),
  five: f("five"),
  highest: f("highest"),
  y2002: f("two"),
  why: f("why", 1),
  mortgages: f("mortgages"),
  amount: f("fourhundredthousanddollar"),
  more: f("more"),
};

export const PHRASES: Phrase[] = [
  { at: f("americas"), text: "America's most important interest rate just hit a 24-year high." },
  { at: f("to"), text: "To see why that matters, rewind to 1981." },
  { at: f("back"), text: "Back then, the 10-year Treasury yield," },
  { at: f("what"), text: "what the U.S. pays to borrow for a decade," },
  { at: f("hit", 1), text: "hit nearly 16%." },
  { at: f("fed") - 4, text: "The Fed was crushing inflation." },
  { at: f("then", 1), text: "Then came a 40-year slide…" },
  { at: f("down"), text: "down, and down…" },
  { at: f("until"), text: "until 2020, when the pandemic sent it to half a percent." },
  { at: f("then", 2), text: "Then inflation came back. And so did rates." },
  { at: f("today"), text: "Today it's 5.3%, the highest since 2002." },
  { at: f("why", 1), text: "Why care? Mortgages key off this number." },
  { at: f("a", 4), text: "A $400k mortgage now costs ~$1,000 more a month than in 2021." },
];

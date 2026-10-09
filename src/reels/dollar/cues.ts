import { Cue } from "../../components/Soundtrack";
import { B, SWAPS } from "./timing";

export const CUES: Cue[] = [
  { sfx: "paper", at: 0, volume: 0.5 },
  { sfx: "highlight", at: B.worth, volume: 0.5 },
  ...SWAPS.map((at, i) => ({ sfx: "paper", at, volume: i >= 3 && i <= 9 ? 0.3 : 0.55 })),
  ...SWAPS.map((at, i) => ({ sfx: "typewriter", at: at + 1, volume: i >= 3 && i <= 9 ? 0.18 : 0.35 })),
  { sfx: "ding", at: B.twentyFour + 2, volume: 0.5 },
  { sfx: "ding", at: B.twentyNine + 2, volume: 0.55 },
];

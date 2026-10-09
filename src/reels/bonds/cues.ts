import { Cue } from "../../components/Soundtrack";
import { B } from "./timing";

export const CUES: Cue[] = [
  { sfx: "paper", at: 2, volume: 0.6 },
  { sfx: "highlight", at: B.highlight24, volume: 0.6 },
  { sfx: "highlight", at: B.highlightHigh - 4, volume: 0.5 },
  { sfx: "marker", at: B.highlightHigh + 6, volume: 0.5 },
  { sfx: "whoosh", at: B.rewind - 6, volume: 0.45 },
  { sfx: "rewind", at: B.rewind + 4, volume: 0.55 },
  { sfx: "marker", at: B.sixteen + 6, volume: 0.5 },
  { sfx: "paper", at: B.fed - 2, volume: 0.5 },
  { sfx: "whoosh", at: B.slide - 4, volume: 0.35 },
  { sfx: "paper", at: B.pandemic, volume: 0.5 },
  { sfx: "marker", at: B.half, volume: 0.5 },
  { sfx: "whoosh", at: B.rise - 6, volume: 0.35 },
  { sfx: "paper", at: B.today - 4, volume: 0.6 },
  { sfx: "highlight", at: B.five + 4, volume: 0.55 },
  { sfx: "pop", at: B.y2002, volume: 0.45 },
  { sfx: "whoosh", at: B.why - 4, volume: 0.45 },
  { sfx: "paper", at: B.why + 8, volume: 0.5 },
  { sfx: "stamp", at: B.more + 4, volume: 0.8 },
];

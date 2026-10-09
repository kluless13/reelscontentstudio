import { Cue } from "../../components/Soundtrack";
import { T } from "./timing";
import { voFrame } from "./vo";
import { COUNT_LAND } from "./OutroV3";

export const RING_AT = T.introEnd + 12;
export const CALLOUT_AT = voFrame("thirtyfive") - 2;
export const STAMP_AT = voFrame("shut");
export const PING_AT = T.clockToEarth + 6;
export const ORBIT_START = T.clockToEarth + 16;

export const CUES: Cue[] = [
  ...[T.introEnd, T.coinToClock, T.clockToEarth, T.earthToOutro].map((c) => ({ sfx: "whoosh", at: c - 7, volume: 0.5 })),
  { sfx: "coin", at: T.introEnd + 2, volume: 0.5 },
  { sfx: "marker", at: RING_AT, volume: 0.6 },
  { sfx: "pop", at: CALLOUT_AT + 8, volume: 0.5 },
  { sfx: "tick", at: T.coinToClock + 4, volume: 0.35 },
  { sfx: "stamp", at: STAMP_AT + 2, volume: 0.8 },
  { sfx: "pop", at: PING_AT, volume: 0.45 },
  ...[0, 2, 4].map((i) => ({ sfx: "pop", at: ORBIT_START + 4 + i * 3, volume: 0.3 })),
  { sfx: "riser", at: COUNT_LAND - 50, volume: 0.45 },
  { sfx: "marker", at: COUNT_LAND + 3, volume: 0.55 },
];

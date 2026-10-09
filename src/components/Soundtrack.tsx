import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile, useVideoConfig } from "remotion";

export type Cue = { sfx: string; at: number; volume?: number };

// Narration + music bed + one-shot sound effects placed on the master timeline.
// voSrc/musicSrc are paths under public/, e.g. "audio/<reel>/vo.mp3". Cue names map to public/audio/sfx/<name>.mp3.
export const Soundtrack: React.FC<{ voOffset: number; cues: Cue[]; voSrc: string; musicSrc: string }> = ({
  voOffset,
  cues,
  voSrc,
  musicSrc,
}) => {
  const { durationInFrames } = useVideoConfig();
  const musicVolume = (f: number) =>
    interpolate(f, [0, 10, durationInFrames - 20, durationInFrames], [0, 0.16, 0.16, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  return (
    <>
      <Audio src={staticFile(musicSrc)} volume={musicVolume} />
      <Sequence from={voOffset} layout="none">
        <Audio src={staticFile(voSrc)} volume={1} />
      </Sequence>
      {cues.map((c, i) => (
        <Sequence key={`${c.sfx}-${i}`} from={Math.max(0, c.at)} layout="none">
          <Audio src={staticFile(`audio/sfx/${c.sfx}.mp3`)} volume={c.volume ?? 0.5} />
        </Sequence>
      ))}
    </>
  );
};

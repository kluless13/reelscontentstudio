import type { Word } from "./components/Caption";

export type VoWord = { text: string; start: number; end: number };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

// Timing helpers for one narration track (ElevenLabs word timestamps).
// Every reel creates its own track so cuts and captions key off its spoken words.
export const createVoTrack = (words: VoWord[], fps: number, offset: number) => {
  const toFrame = (seconds: number) => Math.round(seconds * fps) + offset;

  const indexOf = (word: string, nth = 0): number => {
    const matches = words.map((w, i) => (norm(w.text) === norm(word) ? i : -1)).filter((i) => i >= 0);
    const idx = matches[nth];
    if (idx === undefined) {
      throw new Error(`Word "${word}" (#${nth}) not found in narration`);
    }
    return idx;
  };

  // Frame at which `word` starts being spoken (nth occurrence).
  const voFrame = (word: string, nth = 0): number => toFrame(words[indexOf(word, nth)].start);

  const voEndFrame = (): number => toFrame(words[words.length - 1].end);

  // Caption words for the span [fromWord, toWord], each timed to when it's spoken.
  // The first word is capitalised so mid-sentence spans still read as a headline.
  const voCaption = (fromWord: string, toWord: string, highlight: string[] = []): Word[] => {
    const from = indexOf(fromWord);
    const to = indexOf(toWord);
    const marked = new Set(highlight.map(norm));
    return words.slice(from, to + 1).map((w, i) => ({
      text: i === 0 ? w.text.charAt(0).toUpperCase() + w.text.slice(1) : w.text,
      at: toFrame(w.start) - 2,
      highlight: marked.has(norm(w.text)),
    }));
  };

  return { offset, voFrame, voEndFrame, voCaption };
};

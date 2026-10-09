// Copy this folder to src/reels/<your-reel>/ to start a new reel.
//
// The pattern every reel follows: narration drives the edit.
//  1. Record VO:   npm run tts -- scripts/reels/<reel>.txt public/audio/<reel>
//     (or the ElevenLabs MCP "with timestamps") → vo.mp3 + vo-words.json
//  2. Point the import below at public/audio/<reel>/vo-words.json
//  3. Key every beat off a spoken word with voFrame("word") — never hard-code frames.
//
// This template uses a fake word list so it renders without any audio.
import words from "./vo-words.example.json";
import type { Phrase } from "../../components/PhraseCaptions";
import { FPS } from "../../theme";
import { createVoTrack } from "../../voTrack";

export const vo = createVoTrack(words, FPS, 4);
const f = vo.voFrame;

// Beats. Repeated words need the nth occurrence: f("the", 1).
export const B = {
  doubled: f("doubled"),
  wages: f("wages"),
  gap: f("gap"),
};

export const TEMPLATE_FRAMES = vo.voEndFrame() + 45;

// On-screen captions: phrase-level, numbers written as digits.
export const PHRASES: Phrase[] = [
  { at: f("rent"), text: "Rent has doubled since 2010." },
  { at: f("wages"), text: "Wages haven't." },
  { at: f("heres"), text: "Here's the gap." },
];

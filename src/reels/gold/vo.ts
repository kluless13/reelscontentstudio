import words from "../../../public/audio/gold/vo-words.json";
import { FPS } from "../../theme";
import { createVoTrack } from "../../voTrack";

// Frames of silence before the narration starts.
export const VO_OFFSET = 4;

// Narration track for the gold-standard reel.
export const { voFrame, voEndFrame, voCaption } = createVoTrack(words, FPS, VO_OFFSET);

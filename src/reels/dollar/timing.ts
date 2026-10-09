import words from "../../../public/audio/dollar/vo-words.json";
import type { Phrase } from "../../components/PhraseCaptions";
import { createVoTrack } from "../../voTrack";
import cpi from "./cpi.json";

export const FPS = 30;
export const dollarVo = createVoTrack(words, FPS, 4);
const f = dollarVo.voFrame;

export const END = dollarVo.voEndFrame() + 45;
export const DECADES = cpi.decades;

// Frame each decade swaps in. 1920–1940 follow the narration; 1950–2010 flip fast on
// "inflation chipped away, decade after decade"; 2020 lands on "Today".
const fast = f("inflation");
const fastStep = Math.floor((f("decade", 1) + 4 - fast) / 6);
export const SWAPS: number[] = [
  f("nineteen"),
  f("depression"),
  f("nineteenforty"),
  ...[0, 1, 2, 3, 4, 5, 6].map((i) => fast + i * fastStep),
  f("today", 1), // "Today," — the earlier "today." is in the 1920 line
];

export const B = {
  intro: 0,
  worth: f("worth"),
  sixteen: f("sixteen"),
  depression: f("depression"),
  more: f("more"),
  twentyFour: f("twentyfour"),
  today: f("today", 1),
  twentyNine: f("twentynine"),
};

export const PHRASES: Phrase[] = [
  { at: f("what"), text: "What was a dollar really worth?" },
  { at: f("in"), text: "$1 in 1920 = $16 today" },
  { at: f("then"), text: "Then the Depression made prices fall" },
  { at: f("so"), text: "So a 1940 dollar was worth even more" },
  { at: f("after"), text: "Inflation chipped away, decade after decade" },
  { at: f("today", 1), text: "A 2020 dollar now needs $1.29" },
];

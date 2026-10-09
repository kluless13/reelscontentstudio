// Split into user-visible characters, keeping word boundaries so lines wrap naturally.
export const splitWords = (text: string): string[][] => text.split(" ").map((w) => Array.from(w));

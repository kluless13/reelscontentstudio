// Collage colour system — colour-picked from the "How to hide low quality images" reference.
// Every photo is tinted into dark/light; accents are used for type and marks only.
export const collage = {
  cream: "#f6f2d7",
  charcoal: "#2b3134",
  pink: "#e8365d",
  offWhite: "#f2f1ea",
  teal: "#5cbcc3",
};

export type Duo = { dark: string; light: string };
export const DUO: Duo = { dark: collage.charcoal, light: collage.cream };

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

// feComponentTransfer tables that map luminance 0..1 → dark..light.
export const duoTables = (duo: Duo) => {
  const d = hex(duo.dark);
  const l = hex(duo.light);
  return { r: `${d[0]} ${l[0]}`, g: `${d[1]} ${l[1]}`, b: `${d[2]} ${l[2]}` };
};

// Per-cell luminance grid for an image, cached per (src, grid). Read once via canvas.
const cache = new Map<string, Promise<number[][]>>();

export const lumaGrid = (src: string, cols: number, rows: number): Promise<number[][]> => {
  const key = `${src}|${cols}x${rows}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const job = new Promise<number[][]>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = cols;
      canvas.height = rows;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas 2D context unavailable for halftone"));
        return;
      }
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, cols, rows);
      const { data } = ctx.getImageData(0, 0, cols, rows);
      const grid = Array.from({ length: rows }, (_, y) =>
        Array.from({ length: cols }, (_, x) => {
          const i = (y * cols + x) * 4;
          return (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
        }),
      );
      resolve(grid);
    };
    img.onerror = () => reject(new Error(`Halftone could not load ${src}`));
    img.src = src;
  });
  cache.set(key, job);
  return job;
};

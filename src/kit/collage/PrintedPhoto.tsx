import { useEffect, useId, useState } from "react";
import { cancelRender, continueRender, delayRender, Img, staticFile } from "remotion";
import { DUO, Duo, duoTables } from "./palette";
import { lumaGrid } from "./halftone";

type Props = {
  src: string;
  width: number;
  height: number;
  duo?: Duo;
  tint?: number; // 0..1 how strongly the photo is mapped into the colour system
  halftone?: number; // 0..1 opacity of the dot screen
  cell?: number; // dot pitch in px
  contrast?: number;
};

// Makes any photo — even a tiny, soft one — sit in the collage colour system:
//  1. duotone tint: blacks → charcoal, whites → cream (dial back with `tint`)
//  2. real amplitude-modulated halftone: dot size follows each cell's darkness
// Low-res sources stop reading as "low quality" and start reading as print.
export const PrintedPhoto: React.FC<Props> = ({
  src,
  width,
  height,
  duo = DUO,
  tint = 0.9,
  halftone = 0.75,
  cell = 10,
  contrast = 1.15,
}) => {
  const id = `duo${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const url = staticFile(src);
  const cols = Math.ceil(width / cell) + 1;
  const rows = Math.ceil(height / cell) + 1;
  const [grid, setGrid] = useState<number[][] | null>(null);
  const [handle] = useState(() => delayRender(`halftone ${src}`));
  useEffect(() => {
    lumaGrid(url, cols, rows)
      .then((g) => {
        setGrid(g);
        continueRender(handle);
      })
      .catch((error: Error) => cancelRender(error));
  }, [url, cols, rows, handle]);
  const t = duoTables(duo);
  return (
    <div style={{ position: "relative", width, height, overflow: "hidden", background: duo.light }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <filter id={id} colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope={contrast} intercept={(1 - contrast) / 2} />
            <feFuncG type="linear" slope={contrast} intercept={(1 - contrast) / 2} />
            <feFuncB type="linear" slope={contrast} intercept={(1 - contrast) / 2} />
          </feComponentTransfer>
          <feComponentTransfer>
            <feFuncR type="table" tableValues={t.r} />
            <feFuncG type="table" tableValues={t.g} />
            <feFuncB type="table" tableValues={t.b} />
          </feComponentTransfer>
        </filter>
        <image href={url} width={width} height={height} preserveAspectRatio="xMidYMid slice" filter={`url(#${id})`} />
      </svg>
      {/* Untinted grey copy on top: dials the tint back like the reference's 68% */}
      <Img
        src={url}
        style={{
          position: "absolute",
          inset: 0,
          width,
          height,
          objectFit: "cover",
          filter: "grayscale(1)",
          opacity: 1 - tint,
          mixBlendMode: "luminosity",
        }}
      />
      {grid ? (
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: halftone, mixBlendMode: "multiply" }}>
          {grid.flatMap((row, y) =>
            row.map((lum, x) => {
              const r = cell * 0.62 * Math.sqrt(Math.max(0, 1 - Math.min(1, (lum - 0.5) * contrast + 0.5)));
              if (r < 0.4) return null;
              const offset = y % 2 ? cell / 2 : 0; // staggered rows read like a print screen
              return <circle key={`${x}-${y}`} cx={x * cell + offset} cy={y * cell} r={r} fill={duo.dark} />;
            }),
          )}
        </svg>
      ) : null}
    </div>
  );
};

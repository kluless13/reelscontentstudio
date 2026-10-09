import { useId } from "react";

export type Texture = "clean" | "rough" | "chalk";

// SVG-safe unique id for a filter.
export const useFilterId = (): string => `kit${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

// Hand-drawn edge treatment. "rough" = one displacement pass (organic marker);
// "chalk" = a second, finer pass on top (dry, broken edge), like stacking two Roughen Edges.
export const RoughDefs: React.FC<{ id: string; texture: Texture; seed?: number }> = ({ id, texture, seed = 3 }) => {
  if (texture === "clean") return null;
  return (
    <defs>
      <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed={seed} result="n1" />
        <feDisplacementMap in="SourceGraphic" in2="n1" scale="9" xChannelSelector="R" yChannelSelector="G" result="d1" />
        {texture === "chalk" ? (
          <>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed={seed + 7} result="n2" />
            <feDisplacementMap in="d1" in2="n2" scale="5" xChannelSelector="R" yChannelSelector="G" result="d2" />
            <feComponentTransfer in="n2" result="grain">
              <feFuncA type="discrete" tableValues="0 1 1 1" />
            </feComponentTransfer>
            <feComposite in="d2" in2="grain" operator="in" />
          </>
        ) : null}
      </filter>
    </defs>
  );
};

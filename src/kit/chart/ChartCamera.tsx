import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

export type CameraKey = { at: number; x: number; y: number; zoom: number };

export const DEFAULT_ANCHOR = { x: 540, y: 930 };

// Camera state at a frame (eased between keys). Shared by ChartCamera and anything that
// needs a chart point in screen space (spotlights, overlays).
export const cameraAt = (keys: CameraKey[], frame: number) => {
  const at = keys.map((k) => k.at);
  const opts = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) } as const;
  const lerp = (pick: (k: CameraKey) => number) =>
    keys.length === 1 ? pick(keys[0]) : interpolate(frame, at, keys.map(pick), opts);
  return { x: lerp((k) => k.x), y: lerp((k) => k.y), zoom: lerp((k) => k.zoom) };
};

// Chart-space point -> screen-space point under the camera.
export const toScreen = (keys: CameraKey[], frame: number, pt: { x: number; y: number }, anchor = DEFAULT_ANCHOR) => {
  const c = cameraAt(keys, frame);
  return { x: anchor.x + (pt.x - c.x) * c.zoom, y: anchor.y + (pt.y - c.y) * c.zoom };
};

// Inverse of toScreen: which chart-space rectangle is visible inside a screen window.
export const visibleRect = (
  keys: CameraKey[],
  frame: number,
  screen: { x: number; y: number; w: number; h: number },
  anchor = DEFAULT_ANCHOR,
) => {
  const c = cameraAt(keys, frame);
  const x = c.x + (screen.x - anchor.x) / c.zoom;
  const y = c.y + (screen.y - anchor.y) / c.zoom;
  return { x, y, w: screen.w / c.zoom, h: screen.h / c.zoom };
};

// Keyframed camera: puts point (x, y) at screen anchor, scaled by zoom; eases between keys.
export const ChartCamera: React.FC<{
  keys: CameraKey[];
  anchor?: { x: number; y: number };
  children: React.ReactNode;
}> = ({ keys, anchor = DEFAULT_ANCHOR, children }) => {
  const frame = useCurrentFrame();
  const { x, y, zoom } = cameraAt(keys, frame);
  return (
    <AbsoluteFill
      style={{
        transformOrigin: "0 0",
        transform: `translate(${anchor.x - x * zoom}px, ${anchor.y - y * zoom}px) scale(${zoom})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

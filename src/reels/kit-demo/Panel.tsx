import { AbsoluteFill, Sequence } from "remotion";
import { GridPaper } from "../../kit";
import { colors, fonts } from "../../theme";

export const PANEL = 80;

// One labelled demo slot: numbered badge + name, content renders with local frames.
export const Panel: React.FC<{ index: number; title: string; dark?: boolean; children: React.ReactNode }> = ({
  index,
  title,
  dark = false,
  children,
}) => (
  <Sequence from={index * PANEL} durationInFrames={PANEL}>
    <GridPaper dark={dark} />
    <AbsoluteFill>{children}</AbsoluteFill>
    <div
      style={{
        position: "absolute",
        top: 1640,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        fontFamily: fonts.sans,
        fontWeight: 900,
        fontSize: 44,
        letterSpacing: 2,
        color: dark ? colors.paper : colors.ink,
      }}
    >
      <span
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: colors.marker,
          color: colors.paper,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.serif,
        }}
      >
        {index + 1}
      </span>
      {title}
    </div>
  </Sequence>
);

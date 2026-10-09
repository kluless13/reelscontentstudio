# References

The style guide was learned from these short tutorials. The videos belong to their creators, so
they're linked rather than included. To study one, download it locally into `references/`
(git-ignored), then pull frames: a 1 fps contact sheet
(`ffmpeg -i ref.mp4 -vf "fps=1,scale=200:-1,tile=8x5" -frames:v 1 sheet.png`), cut points
(`select='gt(scene,0.3)',showinfo`), and dense strips around the key move.

| Video | What we took from it | Kit |
|---|---|---|
| [How does Vox make their cuts look so smooth?](https://www.youtube.com/watch?v=KtEgj5hMEUk) | Cut the curve: heavy ease, hard cut at peak velocity | `curve.ts`, gold `motion.ts` |
| [3 Easy VOX-style effects](https://www.youtube.com/watch?v=ZPK_K5ep-vM) | Cursor, monospaced counters, radio waves | `Cursor`, `MonoCounter`, `RadioWaves` |
| [How Vox makes images look like videos](https://www.youtube.com/watch?v=KkckBGX6Yho) | Parallax from layered stills | `ParallaxStill` |
| [Vox text animations always feel so sophisticated](https://www.youtube.com/watch?v=OOry5FgjXEU) | Fill, random letters, odometer; one text move at a time | `FillText`, `RandomLetters`, `OdometerText` |
| [How to Create Vox-Style Markups](https://www.youtube.com/watch?v=TadVzMfcKDo) | Trim-path markups, roughen edges, chalk | `markup/` |
| [How Vox makes sure you don't miss key information](https://www.youtube.com/watch?v=XJTCTovyfGM) | Markups as the "invisible teacher's hand", spotlight | `markup/`, `Spotlight` |
| [How to hide low quality images in collage animations](https://www.youtube.com/watch?v=YljPhGRhxCM) | Colour system, tint photos into it, halftone + grain | `collage/` |

Add new references here with a one-line takeaway and the component that implements it.

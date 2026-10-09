# public/news — article screenshots (not committed)

Real news screenshots are third-party content, so they're git-ignored. Capture them locally:

```bash
npm run news:bonds          # the two articles BondsReel needs
npm run capture -- <url> public/news/<name>-raw.png 1100 900   # any other article
```

Then crop the raw capture to the article area (ffmpeg `crop=w:h:x:y`) and reference the cropped
file from a `NewsCard`. Mark coordinates for highlights are in the *cropped* image's pixels.
Rules: only real, published articles; the user approves each screenshot before it goes in a reel.

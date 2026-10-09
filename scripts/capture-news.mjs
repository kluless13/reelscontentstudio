// Capture real article pages as high-res screenshots for NewsCard.
// Usage: node scripts/capture-news.mjs <url> <out.png> [width] [height]
import os from "node:os";
import path from "node:path";
import puppeteer from "puppeteer-core";

const [url, out, width = "1100", height = "1000"] = process.argv.slice(2);
if (!url || !out) {
  console.error("Usage: node scripts/capture-news.mjs <url> <out.png> [width] [height]");
  process.exit(1);
}

const executablePath = path.join(
  os.homedir(),
  ".cache/remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell",
);

const browser = await puppeteer.launch({ executablePath, headless: true });
try {
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  );
  await page.setViewport({ width: Number(width), height: Number(height), deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 4000));
  await page.screenshot({ path: out });
  console.log(`saved ${out}`);
} catch (error) {
  console.error(`capture failed for ${url}:`, error.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}

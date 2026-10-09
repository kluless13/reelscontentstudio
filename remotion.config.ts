import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Config } from "@remotion/cli/config";

Config.setEntryPoint("src/index.ts");

// macOS blocks Remotion's bundled headless Chrome from reading files inside protected folders
// (~/Downloads, ~/Desktop, ~/Documents). If renders fail with "Target closed" / "icudtl.dat not
// found", copy the browser out (see README → Troubleshooting) and this picks it up automatically.
const browserCopy = path.join(
  os.homedir(),
  ".cache/remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell",
);
if (fs.existsSync(browserCopy)) {
  Config.setBrowserExecutable(browserCopy);
}

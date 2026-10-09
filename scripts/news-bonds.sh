#!/usr/bin/env bash
# Re-captures the two articles used by BondsReel and crops them to the boxes the reel expects.
# Needs: node deps installed, ffmpeg on PATH. Page layouts can change; if a crop looks off,
# open the -raw.png and adjust the crop numbers (and the mark boxes in src/reels/bonds/*Scene.tsx).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/news
node scripts/capture-news.mjs "https://www.insiderfinance.io/news/10-year-treasury-yield-hits-24-year-high" public/news/insiderfinance-raw.png 1100 700
node scripts/capture-news.mjs "https://tradingeconomics.com/united-states/government-bond-yield/news/586699" public/news/tradingeconomics-raw.png 1100 900
ffmpeg -loglevel error -y -i public/news/insiderfinance-raw.png -vf "crop=1420:700:100:80" public/news/insiderfinance.png
ffmpeg -loglevel error -y -i public/news/tradingeconomics-raw.png -vf "crop=1370:1060:60:450" public/news/tradingeconomics.png
echo "Saved public/news/insiderfinance.png and public/news/tradingeconomics.png — check them before rendering."

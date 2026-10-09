"""Narration with word timestamps via ElevenLabs.
Usage: python3 scripts/tts.py <script.txt> <out_dir>  -> out_dir/vo.mp3 + out_dir/vo-words.json
"""
import base64, json, os, sys, urllib.request

VOICE = "cjVigY5qzO86Huf0OWal"  # Eric — house narrator
SETTINGS = {"stability": 0.45, "similarity_boost": 0.8, "style": 0.35, "speed": 1.1, "use_speaker_boost": True}

def main(script_path: str, out_dir: str) -> None:
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        sys.exit("ELEVENLABS_API_KEY not set — add it to .env")
    text = open(script_path).read().strip()
    body = json.dumps({"text": text, "model_id": "eleven_multilingual_v2", "voice_settings": SETTINGS}).encode()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_128",
        data=body,
        headers={"xi-api-key": key, "Content-Type": "application/json"},
    )
    try:
        data = json.load(urllib.request.urlopen(req, timeout=120))
    except urllib.error.HTTPError as e:
        sys.exit(f"TTS failed: {e.code} {e.read()[:300]!r}")
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "vo.mp3"), "wb") as f:
        f.write(base64.b64decode(data["audio_base64"]))
    a = data["alignment"]
    words, cur, start, end = [], "", 0.0, 0.0
    for ch, s, e in zip(a["characters"], a["character_start_times_seconds"], a["character_end_times_seconds"]):
        if ch.isspace():
            if cur:
                words.append({"text": cur, "start": start, "end": end})
                cur = ""
            continue
        if not cur:
            start = s
        cur += ch
        end = e
    if cur:
        words.append({"text": cur, "start": start, "end": end})
    with open(os.path.join(out_dir, "vo-words.json"), "w") as f:
        json.dump(words, f, indent=1)
    for w in words:
        print(f'{w["start"]:6.2f} {w["text"]}')

if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])

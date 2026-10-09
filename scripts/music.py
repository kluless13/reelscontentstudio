"""Generate a music bed with ElevenLabs Music.
Usage: python3 scripts/music.py "<prompt>" <seconds> <out.mp3>
Tip: describe structure with timestamps ("0–7s calm piano… hit at 7s… fade at 28s"); the
returned track won't follow it exactly — always measure energy afterwards and cut to the real track.
"""
import json, os, sys, urllib.request

def main(prompt: str, seconds: float, out: str) -> None:
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        sys.exit("ELEVENLABS_API_KEY not set — copy .env.example to .env, or use the ElevenLabs MCP instead")
    body = json.dumps({"prompt": prompt, "music_length_ms": int(seconds * 1000)}).encode()
    req = urllib.request.Request(
        "https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128",
        data=body,
        headers={"xi-api-key": key, "Content-Type": "application/json"},
    )
    try:
        audio = urllib.request.urlopen(req, timeout=300).read()
    except urllib.error.HTTPError as e:
        sys.exit(f"Music generation failed: {e.code} {e.read()[:300]!r}")
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    with open(out, "wb") as f:
        f.write(audio)
    print(f"saved {out}")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    main(sys.argv[1], float(sys.argv[2]), sys.argv[3])

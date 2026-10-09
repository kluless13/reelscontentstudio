"""Sound effects with ElevenLabs sound generation → public/audio/sfx/<name>.mp3
Usage:
  python3 scripts/sfx.py                              # regenerate the core kit below
  python3 scripts/sfx.py <name> "<prompt>" <seconds>  # add one effect (0.5–30s)
Cue names in a reel's cues.ts map 1:1 to these file names.
"""
import json, os, sys, urllib.request

KEY = os.environ.get("ELEVENLABS_API_KEY")
if not KEY:
    sys.exit("ELEVENLABS_API_KEY not set — copy .env.example to .env, or use the ElevenLabs MCP instead")

SFX = {
    "whoosh": ("Fast cinematic swish whoosh transition, short and punchy, clean", 0.8),
    "stamp": ("Heavy rubber stamp slamming down on paper on a wooden desk, single hit", 0.7),
    "pop": ("Soft bubbly UI pop, single short click, satisfying", 0.5),
    "marker": ("Felt-tip marker quickly drawing a circle on paper, scribble", 0.9),
    "coin": ("Single gold coin ringing as it drops on a table, metallic chime", 1.0),
    "tick": ("Old wall clock ticking, three ticks, close mic", 1.5),
    "riser": ("Short tense cinematic riser into a deep boom impact hit", 1.8),
}

def generate(name: str, prompt: str, seconds: float) -> None:
    body = json.dumps({"text": prompt, "duration_seconds": seconds, "prompt_influence": 0.6}).encode()
    req = urllib.request.Request(
        "https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128",
        data=body,
        headers={"xi-api-key": KEY, "Content-Type": "application/json"},
    )
    try:
        audio = urllib.request.urlopen(req).read()
    except urllib.error.HTTPError as e:
        print(f"{name}: failed {e.code} {e.read()[:200]!r}")
        return
    with open(f"public/audio/sfx/{name}.mp3", "wb") as f:
        f.write(audio)
    print(f"{name}: ok")

if __name__ == "__main__":
    os.makedirs("public/audio/sfx", exist_ok=True)
    if len(sys.argv) == 4:
        generate(sys.argv[1], sys.argv[2], float(sys.argv[3]))
    elif len(sys.argv) == 1:
        for name, (prompt, seconds) in SFX.items():
            generate(name, prompt, seconds)
    else:
        sys.exit(__doc__)

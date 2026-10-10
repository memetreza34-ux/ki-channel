"""Armans eigene Aufnahme → fertige Sprachspur, Absatzzeiten, Musik, Wortzeiten.

Aufnahme: je Absatz aus skript.md eine Datei, benannt 1.m4a, 2.m4a … (auch .mp3/.wav/.aac/.caf),
abgelegt in  studio/public/projekte/<slug>/aufnahme/

Aufruf:  python3 studio/scripts/stimme-aufnahme.py <slug>

Macht:
  1. jede Datei: Brummen weg, Rauschen leiser, Stille vorn/hinten abschneiden
  2. zusammensetzen mit kurzen Pausen → public/projekte/<slug>/voiceover.wav (-16 LUFS)
  3. projekte/<slug>/absaetze.json (Start/Ende je Absatz) → das Video passt sich automatisch an
  4. Musik in passender Länge neu erzeugen (musik-kanal.py)
  5. Wortzeiten für das Absenken der Musik (npm run untertitel)
"""
import json
import re
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
SR = 48000
VORLAUF, PAUSE = 0.6, 0.8
ENDE_PIPER = 117.0

slug = sys.argv[1]
projekt = ROOT / 'studio' / 'projekte' / slug
public = ROOT / 'studio' / 'public' / 'projekte' / slug
ordner = public / 'aufnahme'

skript = (projekt / 'skript.md').read_text()
teil = skript.split('## Sprechertext', 1)[1].split('\n## ', 1)[0]
absaetze = [m.group(1).strip() for m in re.finditer(r'^\d+\.\s+(.+)$', teil, re.M)]

dateien = []
for i in range(1, len(absaetze) + 1):
    treffer = sorted(p for p in ordner.glob(f'{i}.*') if p.suffix.lower() in {'.m4a', '.mp3', '.wav', '.aac', '.caf', '.aiff', '.ogg'})
    if not treffer:
        sys.exit(f'Fehlt: {ordner}/{i}.m4a (Absatz {i}: „{absaetze[i - 1][:50]}…“)')
    dateien.append(treffer[0])

# Je Absatz säubern. Stille am Anfang/Ende weg (areverse-Trick für das Ende).
reinigen = (
    'highpass=f=80,afftdn=nr=10:nf=-42,'
    'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,'
    'areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.2,areverse'
)
tmp = ROOT / 'studio' / 'out' / f'{slug}-aufnahme-tmp'
tmp.mkdir(parents=True, exist_ok=True)
stuecke = [np.zeros(int(SR * VORLAUF))]
zeiten, t = [], VORLAUF
for i, (datei, text) in enumerate(zip(dateien, absaetze)):
    ziel = tmp / f'{i + 1}.wav'
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(datei), '-af', reinigen, '-ar', str(SR), '-ac', '1', '-c:a', 'pcm_s16le', str(ziel)], check=True)
    with wave.open(str(ziel)) as w:
        audio = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
    dauer = len(audio) / SR
    zeiten.append({'nr': i + 1, 'start': round(t, 3), 'ende': round(t + dauer, 3), 'text': text})
    stuecke += [audio, np.zeros(int(SR * PAUSE))]
    t += dauer + PAUSE
    print(f'{i + 1}: {dauer:5.1f}s  {datei.name}')

roh = tmp / 'zusammen.wav'
with wave.open(str(roh), 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((np.clip(np.concatenate(stuecke), -1, 1) * 32767).astype('<i2').tobytes())

master = 'equalizer=f=200:t=q:w=1:g=1.5,equalizer=f=3500:t=q:w=1.2:g=1.5,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,loudnorm=I=-16:TP=-1.5:LRA=7'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(roh), '-af', master, '-ar', str(SR), '-ac', '1', str(public / 'voiceover.wav')], check=True)
(projekt / 'absaetze.json').write_text(json.dumps(zeiten, ensure_ascii=False, indent=2))

# Musik passend zur neuen Länge (gleiche Rechnung wie im Video: Abspann bleibt gleich lang)
piper = json.loads((projekt / 'absaetze-piper.json').read_text())
dauer_video = zeiten[-1]['ende'] + (ENDE_PIPER - piper[-1]['ende'])
abschnitte = {
    'groove': round(zeiten[1]['start'] - 0.35, 2),
    'dunkel': [round(zeiten[6]['start'] - 1.0, 2), round(zeiten[7]['start'] - 0.9, 2)],
    'outro': round(zeiten[-1]['ende'] + 0.7, 2),
}
(projekt / 'musik-abschnitte.json').write_text(json.dumps(abschnitte))
subprocess.run(['python3', str(ROOT / 'studio' / 'scripts' / 'musik-kanal.py'), str(public / 'musik.wav'), f'{dauer_video:.2f}', str(projekt / 'musik-abschnitte.json')], check=True)
subprocess.run(['npm', 'run', 'untertitel', '--silent', '--', slug], check=True, cwd=ROOT)

print(f'\nFertig: Sprache {t:.1f}s, Video {dauer_video:.1f}s. Jetzt: npm run look -- <ID> und npm run render -- <ID>')

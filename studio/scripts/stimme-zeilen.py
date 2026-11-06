"""Sprach-Zeilen mit festen Pausen zu einer Sprachspur zusammensetzen (beliebige Stimme).

Erwartet:
  studio/projekte/<slug>/zeilen.json      [{"text": "...", "pause": 1.0}, ...]
  studio/public/projekte/<slug>/stimme/1.wav|.aiff|.m4a|.mp3 … (eine Datei je Zeile)

Aufruf:  python3 studio/scripts/stimme-zeilen.py <slug> [vorlauf_s]
Schreibt: public/projekte/<slug>/voiceover.wav (-16 LUFS) und projekte/<slug>/absaetze.json
"""
import json
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
SR = 48000
slug = sys.argv[1]
vorlauf = float(sys.argv[2]) if len(sys.argv) > 2 else 0.8
projekt = ROOT / 'studio' / 'projekte' / slug
public = ROOT / 'studio' / 'public' / 'projekte' / slug
zeilen = json.loads((projekt / 'zeilen.json').read_text())

reinigen = (
    'highpass=f=70,'
    'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,'
    'areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse'
)
tmp = ROOT / 'studio' / 'out' / f'{slug}-zeilen-tmp'
tmp.mkdir(parents=True, exist_ok=True)
stuecke = [np.zeros(int(SR * vorlauf))]
zeiten, t = [], vorlauf
for i, z in enumerate(zeilen, 1):
    quelle = next((p for p in sorted((public / 'stimme').glob(f'{i}.*'))), None)
    if quelle is None:
        sys.exit(f'Fehlt: stimme/{i}.* („{z["text"]}“)')
    ziel = tmp / f'{i}.wav'
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(quelle), '-af', reinigen, '-ar', str(SR), '-ac', '1', '-c:a', 'pcm_s16le', str(ziel)], check=True)
    with wave.open(str(ziel)) as w:
        audio = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768
    dauer = len(audio) / SR
    zeiten.append({'nr': i, 'start': round(t, 3), 'ende': round(t + dauer, 3), 'text': z['text']})
    stuecke += [audio, np.zeros(int(SR * z.get('pause', 0.8)))]
    t += dauer + z.get('pause', 0.8)

roh = tmp / 'zusammen.wav'
with wave.open(str(roh), 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((np.clip(np.concatenate(stuecke), -1, 1) * 32767).astype('<i2').tobytes())
master = 'acompressor=threshold=-20dB:ratio=2.5:attack=5:release=120,loudnorm=I=-16:TP=-1.5:LRA=7'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(roh), '-af', master, '-ar', str(SR), '-ac', '1', str(public / 'voiceover.wav')], check=True)
(projekt / 'absaetze.json').write_text(json.dumps(zeiten, ensure_ascii=False, indent=2))
print(f'{len(zeiten)} Zeilen, Gesamtlänge {t:.1f}s → voiceover.wav, absaetze.json')

"""Sprecherstimme lokal mit Piper (Stimme Thorsten, CC0) erzeugen.

Aufruf:  tts/bin/python studio/scripts/stimme-piper.py <slug>
Liest die nummerierten Absätze aus studio/projekte/<slug>/skript.md (Abschnitt "## Sprechertext"),
spricht jeden Absatz einzeln, setzt sie mit Pausen zusammen und schreibt:
  studio/public/projekte/<slug>/voiceover.wav
  studio/projekte/<slug>/absaetze.json   (Start/Ende jedes Absatzes in Sekunden)
"""
import json
import re
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np
from piper import PiperVoice, SynthesisConfig

ROOT = Path(__file__).resolve().parents[2]
slug = sys.argv[1]
skript = (ROOT / 'studio' / 'projekte' / slug / 'skript.md').read_text()
teil = skript.split('## Sprechertext', 1)[1].split('\n## ', 1)[0]
absaetze = [m.group(1).strip() for m in re.finditer(r'^\d+\.\s+(.+)$', teil, re.M)]

# Aussprache-Hilfen: nur für die Stimme, das Skript bleibt korrekt geschrieben.
AUSSPRACHE = {'Mount Everest': 'Maunt Ewwerest', 'ChatGPT': 'Tschätt Dschi Pi Ti', 'OpenAI': 'Open Ei Ai', 'James-Webb': 'Dschäims Webb', 'Air Canada': 'Är Kännäda', 'Bard': 'Baard', 'Chatbot': 'Tschättbott', 'Airline': 'Ärlain', 'Googles': 'Gugels', 'KIs': 'Ka-Is', 'Eiffelturm': 'Eiffelturm', '„': '', '“': '', ' – ': ', '}


def fuer_stimme(text):
    for a, b in AUSSPRACHE.items():
        text = text.replace(a, b)
    return text


voice = PiperVoice.load(str(ROOT / 'tts' / 'stimmen' / 'de_DE-thorsten-high.onnx'))
import os
TEMPO = float(os.environ.get('PIPER_TEMPO', '1.02'))
cfg = SynthesisConfig(length_scale=TEMPO, noise_scale=0.6, noise_w_scale=0.75)
sr = voice.config.sample_rate
VORLAUF, PAUSE = 0.6, float(os.environ.get('PIPER_PAUSE', '0.9'))

stuecke, zeiten, t = [np.zeros(int(sr * VORLAUF), dtype=np.int16)], [], VORLAUF
for i, text in enumerate(absaetze):
    audio = np.concatenate([np.frombuffer(c.audio_int16_bytes, dtype=np.int16) for c in voice.synthesize(fuer_stimme(text), syn_config=cfg)])
    dauer = len(audio) / sr
    zeiten.append({'nr': i + 1, 'start': round(t, 3), 'ende': round(t + dauer, 3), 'text': text})
    stuecke += [audio, np.zeros(int(sr * PAUSE), dtype=np.int16)]
    t += dauer + PAUSE
    print(f'{i + 1}: {dauer:5.1f}s  {text[:50]}')

roh = ROOT / 'studio' / 'out' / f'{slug}-stimme-roh.wav'
with wave.open(str(roh), 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(sr)
    w.writeframes(np.concatenate(stuecke).tobytes())

ziel = ROOT / 'studio' / 'public' / 'projekte' / slug / 'voiceover.wav'
ziel.parent.mkdir(parents=True, exist_ok=True)
# Aufbereitung: Rumpeln weg, etwas Wärme, sanfte Kompression, YouTube-taugliche Lautheit.
filt = 'highpass=f=75,equalizer=f=180:t=q:w=1:g=2,equalizer=f=3500:t=q:w=1.2:g=1.5,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,loudnorm=I=-16:TP=-1.5:LRA=7'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(roh), '-af', filt, '-ar', '48000', '-ac', '1', str(ziel)], check=True)
(ROOT / 'studio' / 'projekte' / slug / 'absaetze.json').write_text(json.dumps(zeiten, ensure_ascii=False, indent=2))
print(f'Gesamt: {t:.1f}s → {ziel}')

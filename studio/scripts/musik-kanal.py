"""Kanal-Musik: ruhiger, freundlicher Groove per Synthese (keine Lizenzfragen).

Aufruf:  python3 studio/scripts/musik-kanal.py <ziel.wav> <länge_s> [abschnitte.json]
abschnitte.json (optional): {"groove": 10.4, "dunkel": [71.3, 90.0], "outro": 107.5}
  groove = ab hier Bass + Percussion, dunkel = Abschnitt ohne Beat mit dunklerer Farbe,
  outro = Schlussakkord, klingt aus.
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

SR = 48000
BPM = 92
BEAT = 60 / BPM
BAR = 4 * BEAT
rng = np.random.default_rng(3)


def midi(n):
    return 440 * 2 ** ((n - 69) / 12)


def t_of(sec):
    return np.arange(int(SR * sec)) / SR


def env(t, attack, tau):
    return np.clip(t / attack, 0, 1) * np.exp(-np.maximum(t - attack, 0) / tau)


def marimba(f, sec=0.7, tau=0.28):
    t = t_of(sec)
    return np.sin(2 * np.pi * f * t) * env(t, 0.002, tau) + 0.22 * np.sin(2 * np.pi * f * 3.98 * t) * env(t, 0.001, tau * 0.15)


def pad_note(f, sec, hell=1.0):
    t = t_of(sec)
    x = np.zeros_like(t)
    for d in (-0.06, 0.0, 0.07):  # leicht verstimmt = breiter
        ff = f * 2 ** (d / 12)
        for h in range(1, 9):
            x += np.sin(2 * np.pi * ff * h * t + h) / h ** (1.6 / hell)
    a = np.clip(t / 0.5, 0, 1) * np.clip((sec - t) / 0.6, 0, 1)
    return x * a / 6


def kick():
    t = t_of(0.3)
    return np.sin(2 * np.pi * np.cumsum(45 + 70 * np.exp(-t / 0.03)) / SR) * env(t, 0.002, 0.11)


def rim():
    t = t_of(0.12)
    n = rng.standard_normal(len(t))
    n = np.convolve(n, [1, -1], 'same')  # heller
    return (0.5 * n * env(t, 0.0005, 0.012) + 0.4 * np.sin(2 * np.pi * 1750 * t) * env(t, 0.0005, 0.02))


def shaker():
    t = t_of(0.08)
    n = np.convolve(rng.standard_normal(len(t)), [1, -2, 1], 'same')
    return n * env(t, 0.004, 0.018)


def bass_note(f, sec):
    t = t_of(sec)
    x = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    return x * np.clip(t / 0.01, 0, 1) * np.exp(-t / 0.9) * np.clip((sec - t) / 0.05, 0, 1)


def place(buf, x, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    n = min(len(x), len(buf) - i)
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i : i + n, 0] += x[:n] * gain * l
    buf[i : i + n, 1] += x[:n] * gain * r


def lowpass(x, cutoff):
    spec = np.fft.rfft(x, axis=0)
    f = np.fft.rfftfreq(len(x), 1 / SR)[:, None]
    spec *= 1 / np.sqrt(1 + (f / cutoff) ** 4)
    return np.fft.irfft(spec, len(x), axis=0)


# Akkorde (MIDI) + Bass: Fmaj7 – G6 – Em7 – Am7 (warm, neugierig)
HELL = [([53, 57, 60, 64], 41), ([55, 59, 62, 64], 43), ([52, 55, 59, 62], 40), ([57, 60, 64, 67], 45)]
# Dunkel (Halluzination): Am7 – Fmaj7 – Dm7 – Esus
DUNKEL = [([57, 60, 64, 67], 45), ([53, 57, 60, 64], 41), ([50, 53, 57, 60], 38), ([52, 57, 59, 64], 40)]
ARP = [0, 2, 1, 3, 2, 1, 3, 2]
# Kinder: fröhlich, hell – C – G – Am – F, Glockenspiel-Lage
# News: ernst, treibend – Am – F – C – G
NEWS = [([57, 60, 64, 67], 45), ([53, 57, 60, 64], 41), ([48, 55, 60, 64], 36), ([55, 59, 62, 67], 43)]
KINDER = [([60, 64, 67, 72], 48), ([55, 59, 62, 67], 43), ([57, 60, 64, 69], 45), ([53, 57, 60, 65], 41)]


def main():
    ziel = Path(sys.argv[1])
    laenge = float(sys.argv[2])
    ab = json.loads(Path(sys.argv[3]).read_text()) if len(sys.argv) > 3 else {}
    global BPM, BEAT, BAR, HELL
    BPM = ab.get('bpm', BPM)
    BEAT = 60 / BPM
    BAR = 4 * BEAT
    kinder = ab.get('stil') == 'kinder'
    if kinder:
        HELL = KINDER
    if ab.get('stil') == 'news':
        HELL = NEWS
    groove = ab.get('groove', 8.0)
    dunkel = ab.get('dunkel', [laenge + 1, laenge + 1])
    outro = ab.get('outro', laenge - 8)

    pads = np.zeros((int(SR * (laenge + 4)), 2))
    plucks = np.zeros_like(pads)
    rhythm = np.zeros_like(pads)
    bass = np.zeros_like(pads)

    bar = 0
    while bar * BAR < outro:
        tb = bar * BAR
        ist_dunkel = dunkel[0] <= tb < dunkel[1]
        chords = DUNKEL if ist_dunkel else HELL
        noten, bassnote = chords[bar % 4]
        for n in noten:
            place(pads, pad_note(midi(n), BAR + 0.6, 0.7 if ist_dunkel else 1.0), tb, 0.10)
        # Arpeggio: im Intro nur Viertel, sonst Achtel; Ping-Pong im Panorama
        schritte = 4 if tb < groove else 8
        for i in range(schritte):
            note = noten[ARP[i * (8 // schritte)]] + (24 if kinder else 12)
            place(plucks, marimba(midi(note), 0.8, 0.22 if ist_dunkel else 0.3), tb + i * BAR / schritte, 0.16 if tb >= groove else 0.13, pan=0.35 if i % 2 else -0.35)
        if tb >= groove:
            place(bass, bass_note(midi(bassnote), BEAT * 1.6), tb, 0.30)
            place(bass, bass_note(midi(bassnote + (7 if not ist_dunkel else 12)), BEAT * 0.9), tb + 2.5 * BEAT, 0.22)
            if not ist_dunkel:
                for b in (0, 2):
                    place(rhythm, kick(), tb + b * BEAT, 0.42)
                for b in (1, 3):
                    place(rhythm, rim(), tb + b * BEAT, 0.07, pan=0.15)
                for s in range(16):
                    place(rhythm, shaker(), tb + s * BEAT / 4, 0.035 * (1.4 if s % 2 else 0.8), pan=-0.3)
            else:
                place(rhythm, kick(), tb, 0.28)
        bar += 1

    # Schluss: aufgelöster C-Dur-Akkord, klingt lang aus
    for n in [48, 55, 60, 64, 67]:
        place(pads, pad_note(midi(n), 7.0), outro, 0.11)
    for i, n in enumerate([72, 76, 79]):
        place(plucks, marimba(midi(n), 2.0, 0.8), outro + i * 0.15, 0.14)

    # Echo auf den Plucks (punktierte Achtel)
    d = int(SR * BEAT * 0.75)
    echo = np.zeros_like(plucks)
    echo[d:] += plucks[:-d] * 0.32
    echo[2 * d :] += plucks[: -2 * d] * 0.12
    echo = echo[:, ::-1]  # Ping-Pong
    plucks = plucks + echo

    # Dunkler Abschnitt: Plucks gedämpft
    if dunkel[0] < laenge:
        a, b = int(dunkel[0] * SR), int(dunkel[1] * SR)
        plucks[a:b] = lowpass(plucks[a:b], 1400)

    mix = lowpass(pads, 3500) + plucks + rhythm + lowpass(bass, 400)
    # Kleiner Raum
    t = t_of(1.2)
    ir = rng.standard_normal(len(t)) * np.exp(-t / 0.35)
    ir = np.convolve(ir, np.ones(24) / 24, 'same')
    ir /= np.sqrt(np.sum(ir**2))
    wet = np.stack([np.convolve(mix[:, c], ir)[: len(mix)] for c in (0, 1)], axis=1)
    mix = mix + 0.12 * wet

    n = int(SR * laenge)
    mix = mix[:n]
    fade_in = np.clip(np.arange(n) / (SR * 1.0), 0, 1)[:, None]
    fade_out = np.clip((n - np.arange(n)) / (SR * 2.5), 0, 1)[:, None]
    mix *= fade_in * fade_out
    mix /= np.max(np.abs(mix)) / 0.8

    import wave

    roh = ziel.with_suffix('.roh.wav')
    with wave.open(str(roh), 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(mix, -1, 1) * 32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(roh), '-af', 'loudnorm=I=-18:TP=-2:LRA=9', '-ar', '48000', str(ziel)], check=True)
    roh.unlink()
    print(f'{ziel}  {laenge:.1f}s')


if __name__ == '__main__':
    main()

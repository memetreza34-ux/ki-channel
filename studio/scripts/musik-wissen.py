"""Hintergrundmusik für die Wissens-Shorts: ruhig, neugierig, modern – per Synthese (keine Lizenzfragen).

Aufruf:  python3 studio/scripts/musik-wissen.py [ziel.wav] [takte]
Standard: studio/public/musik/wissen.wav, 16 Takte (≈ 40 s, nahtlos loopbar).
Weicher Pad-Teppich, gezupftes Arpeggio, tiefer Puls, sehr leiser Shaker. Läuft ohne ffmpeg.
"""
import sys
import wave
from pathlib import Path

import numpy as np
from scipy.signal import butter, lfilter

SR = 48000
BPM = 96
BEAT = 60 / BPM
BAR = 4 * BEAT
rng = np.random.default_rng(7)

# Fmaj7 – Am7 – Dm9 – Cmaj7 (warm, offen, leicht nachdenklich)
AKKORDE = [
    [53, 57, 60, 64],
    [57, 60, 64, 67],
    [50, 53, 57, 60, 64],
    [48, 52, 55, 59],
]


def hz(n):
    return 440 * 2 ** ((n - 69) / 12)


def zeit(sec):
    return np.arange(int(SR * sec)) / SR


def tiefpass(x, cutoff):
    b, a = butter(2, cutoff / (SR / 2))
    return lfilter(b, a, x)


def pad(noten, sec):
    t = zeit(sec)
    out = np.zeros_like(t)
    for n in noten:
        for verstimmung in (-0.08, 0.0, 0.08):
            f = hz(n + verstimmung)
            out += 2 * (t * f % 1) - 1  # Sägezahn
    out = tiefpass(out / (len(noten) * 3), 900)
    huelle = np.clip(t / 0.6, 0, 1) * np.clip((sec - t) / 0.6, 0, 1)
    return out * huelle


def zupf(n, sec=0.9):
    t = zeit(sec)
    f = hz(n)
    ton = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t) + 0.08 * np.sin(2 * np.pi * 3 * f * t)
    return ton * np.clip(t / 0.004, 0, 1) * np.exp(-t / 0.22)


def puls(n, sec):
    t = zeit(sec)
    return np.sin(2 * np.pi * hz(n) * t) * np.clip(t / 0.01, 0, 1) * np.exp(-t / 0.5)


def shaker(sec=0.08):
    t = zeit(sec)
    return tiefpass(rng.standard_normal(len(t)), 9000) * np.exp(-t / 0.025)


def lege(spur, klang, start):
    i = int(start * SR)
    j = min(len(spur), i + len(klang))
    spur[i:j] += klang[: j - i]


def main():
    ziel = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / 'public' / 'musik' / 'wissen.wav'
    takte = int(sys.argv[2]) if len(sys.argv) > 2 else 16
    laenge = takte * BAR
    n = int(laenge * SR)
    pads = np.zeros(n)
    zupfer = np.zeros(n)
    tief = np.zeros(n)
    rasseln = np.zeros(n)
    muster = [0, 2, 1, 3, 2, 1, 3, 2]  # Arpeggio-Reihenfolge in Achteln
    for takt in range(takte):
        akk = AKKORDE[takt % len(AKKORDE)]
        t0 = takt * BAR
        lege(pads, pad(akk, BAR + 0.6), t0)
        lege(tief, puls(akk[0] - 12, BEAT * 2), t0)
        lege(tief, puls(akk[0] - 12, BEAT * 2) * 0.6, t0 + 2 * BEAT)
        for k, idx in enumerate(muster):
            note = akk[idx % len(akk)] + 12
            staerke = 0.55 if k % 2 else 0.8
            lege(zupfer, zupf(note) * staerke, t0 + k * BEAT / 2)
        if takt >= 2:  # Shaker erst ab Takt 3
            for k in range(4):
                lege(rasseln, shaker(), t0 + k * BEAT + BEAT / 2)
    # nahtlos loopen: Ausklang des letzten Takts an den Anfang falten
    mix = 0.42 * pads + 0.22 * zupfer + 0.3 * tief + 0.035 * rasseln
    ueberhang = int(0.6 * SR)
    mix[:ueberhang] += 0.42 * pad(AKKORDE[(takte - 1) % len(AKKORDE)], BAR + 0.6)[int(BAR * SR):int(BAR * SR) + ueberhang]
    # Lautheit grob auf ≈ -20 dBFS RMS
    rms = np.sqrt(np.mean(mix ** 2)) or 1
    mix = mix * (10 ** (-20 / 20) / rms)
    mix = np.tanh(mix * 1.2) / 1.2
    ziel.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(ziel), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(mix, -1, 1) * 32767).astype('<i2').tobytes())
    print(f'{ziel} ({laenge:.1f} s)')


if __name__ == '__main__':
    main()

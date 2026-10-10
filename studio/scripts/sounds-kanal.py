"""Kanal-Sounds: eigenes, weiches Sound-Set per Synthese (keine Lizenzfragen).

Aufruf:  python3 studio/scripts/sounds-kanal.py
Ergebnis: studio/public/sfx/kanal/<name>.ogg  +  studio/out/kanal-sounds-probe.wav (alle nacheinander)

Klangidee: warm und dezent statt Spiele-Sound. Marimba/Glas für Ergebnisse,
gefiltertes Rauschen für Bewegung, tiefe Sinus-Schläge für Gewicht.
"""
from pathlib import Path
import subprocess

import numpy as np

SR = 48000
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'studio' / 'public' / 'sfx' / 'kanal'
PROBE = ROOT / 'studio' / 'out' / 'kanal-sounds-probe.wav'
rng = np.random.default_rng(7)


def t_of(sec):
    return np.arange(int(SR * sec)) / SR


def env(t, attack=0.003, tau=0.2):
    a = np.clip(t / attack, 0, 1)
    return a * np.exp(-np.maximum(t - attack, 0) / tau)


def tone(freq_fn, t):
    """Sinus mit zeitabhängiger Frequenz (Phase integriert)."""
    f = freq_fn(t) if callable(freq_fn) else np.full_like(t, freq_fn)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def marimba(freq, sec=0.6, tau=0.35, bright=0.25):
    t = t_of(sec)
    body = tone(freq, t) * env(t, 0.002, tau)
    over = tone(freq * 3.98, t) * env(t, 0.001, tau * 0.18) * bright
    click = tone(freq * 9.1, t) * env(t, 0.0005, 0.004) * 0.08
    return body + over + click


def glas(freq, sec=1.4, tau=0.7):
    t = t_of(sec)
    parts = [(1, 1.0, tau), (2.01, 0.28, tau * 0.5), (3.02, 0.1, tau * 0.25), (5.4, 0.04, tau * 0.12)]
    return sum(tone(freq * m, t) * env(t, 0.004, d) * a for m, a, d in parts)


def band_noise(sec, f_from, f_to, width=0.55, shape_peak=0.6):
    """Rauschen, dessen Klangband von f_from nach f_to wandert (STFT-Formung)."""
    n = int(SR * sec)
    win = 1024
    hop = 256
    x = rng.standard_normal(n + win)
    frames = []
    window = np.hanning(win)
    freqs = np.fft.rfftfreq(win, 1 / SR)
    starts = range(0, n, hop)
    out = np.zeros(n + win)
    norm = np.zeros(n + win)
    for i, s in enumerate(starts):
        p = s / n
        fc = f_from * (f_to / f_from) ** p
        spec = np.fft.rfft(x[s : s + win] * window)
        gain = np.exp(-0.5 * (np.log2(np.maximum(freqs, 1) / fc) / width) ** 2)
        frame = np.fft.irfft(spec * gain) * window
        out[s : s + win] += frame
        norm[s : s + win] += window**2
    out = out[:n] / np.maximum(norm[:n], 1e-3)
    t = t_of(sec)
    u = t / sec
    # Schwelle an, Gipfel bei shape_peak, sanft aus
    amp = np.where(u < shape_peak, (u / shape_peak) ** 2, ((1 - u) / (1 - shape_peak)) ** 1.5)
    return out * amp


def raum(x, wet=0.14, length=0.45):
    """Kleiner, warmer Raum: Faltung mit abklingendem, gedämpftem Rauschen."""
    t = t_of(length)
    ir = rng.standard_normal(len(t)) * np.exp(-t / 0.11)
    ir = np.convolve(ir, np.ones(12) / 12, mode='same')  # dumpfer
    ir /= np.sqrt(np.sum(ir**2))
    tail = np.convolve(x, ir)
    dry = np.concatenate([x, np.zeros(len(tail) - len(x))])
    return dry + wet * tail


def tiefpass(x, cutoff):
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    spec *= 1 / np.sqrt(1 + (f / cutoff) ** 4)
    return np.fft.irfft(spec, len(x))


def stereo(x, pan_from=0.0, pan_to=0.0):
    p = np.linspace(pan_from, pan_to, len(x))
    l = x * np.cos((p + 1) * np.pi / 4)
    r = x * np.sin((p + 1) * np.pi / 4)
    return np.stack([l, r], axis=1)


def norm(x, peak_db):
    m = np.max(np.abs(x))
    return x / m * 10 ** (peak_db / 20) if m > 0 else x


def trim(x, thresh=1e-4):
    idx = np.nonzero(np.abs(x if x.ndim == 1 else x.max(axis=1)) > thresh)[0]
    return x[: idx[-1] + int(SR * 0.02)] if len(idx) else x


# ───────────── Klänge ─────────────


def pop():
    t = t_of(0.14)
    f = lambda t: 330 + 620 * np.exp(-t / 0.011)
    x = tone(f, t) * env(t, 0.0015, 0.032) + 0.18 * tone(lambda t: 2 * f(t), t) * env(t, 0.001, 0.018)
    return raum(tiefpass(x, 3500), 0.1)


def tick():
    return raum(marimba(1318.5, 0.18, 0.05, 0.12), 0.08)


def tipp():
    t = t_of(0.05)
    x = tiefpass(rng.standard_normal(len(t)) * env(t, 0.002, 0.006), 2200) * 0.6 + tone(900, t) * env(t, 0.002, 0.012) * 0.4
    return raum(x, 0.06)


def whoosh():
    return raum(band_noise(0.5, 280, 2200, 0.6, 0.62), 0.12)


def swish():
    return raum(band_noise(0.26, 900, 3800, 0.5, 0.55), 0.08)


def ding():
    return raum(glas(1046.5, 1.3, 0.55) + 0.55 * glas(1568.0, 1.3, 0.45), 0.18)


def notify():
    a = marimba(783.99, 0.7, 0.28)
    b = marimba(1046.5, 0.8, 0.32)
    x = np.zeros(len(b) + int(SR * 0.11))
    x[: len(a)] += a
    x[int(SR * 0.11) :] += b
    return raum(x, 0.15)


def erfolg():
    notes = [523.25, 659.25, 783.99, 1046.5]
    x = np.zeros(int(SR * 1.3))
    for i, f in enumerate(notes):
        m = marimba(f, 0.9, 0.3 + i * 0.05)
        s = int(SR * 0.075 * i)
        x[s : s + len(m)] += m * (0.8 + 0.1 * i)
    return raum(x, 0.18)


def falsch():
    a = marimba(329.63, 0.5, 0.18, 0.15)
    b = marimba(261.63, 0.7, 0.26, 0.15)
    x = np.zeros(len(b) + int(SR * 0.14))
    x[: len(a)] += a
    x[int(SR * 0.14) :] += b
    return raum(tiefpass(x, 2500), 0.12)


def landen():
    t = t_of(0.32)
    body = tone(lambda t: 62 + 110 * np.exp(-t / 0.035), t) * env(t, 0.002, 0.075)
    tap = tiefpass(rng.standard_normal(len(t)), 900) * env(t, 0.0008, 0.012) * 0.35
    return raum(body + tap, 0.08)


def sprung():
    t = t_of(0.24)
    f = lambda t: 240 + 420 * (t / 0.24) ** 0.7 + 18 * np.sin(2 * np.pi * 28 * t)
    x = tone(f, t) * env(t, 0.01, 0.09) + 0.12 * tone(lambda t: 3 * f(t), t) * env(t, 0.01, 0.05)
    return raum(tiefpass(x, 3000), 0.1)


def anstieg():
    sec = 1.2
    t = t_of(sec)
    x = band_noise(sec, 400, 3000, 0.7, 0.92) * 0.6
    x += tone(lambda t: 220 * 2 ** (t / sec), t) * (t / sec) ** 2 * 0.25
    return raum(x, 0.15)


def muenze():
    """Metallisches Klimpern: unharmonische Teiltöne, kurz und hell."""
    t = t_of(0.35)
    x = np.zeros_like(t)
    for f, a, tau in [(2650, 1.0, 0.09), (3970, 0.6, 0.07), (5830, 0.35, 0.05), (7400, 0.2, 0.03)]:
        x += a * np.sin(2 * np.pi * f * t) * env(t, 0.0005, tau)
    x += 0.4 * tiefpass(rng.standard_normal(len(t)), 6000) * env(t, 0.0003, 0.004)
    return raum(x, 0.1)


def muenzen():
    """Mehrere Münzen kurz hintereinander (Geldregen)."""
    x = np.zeros(int(SR * 0.6))
    for i, (dt, g) in enumerate([(0.0, 1.0), (0.07, 0.7), (0.15, 0.85), (0.26, 0.55)]):
        m = muenze()
        s = int(SR * dt)
        x[s : s + len(m)] += m[: len(x) - s] * g
    return x


# ───────────── Stimme des Token-Wesens ─────────────
# Keine Wörter, sondern kurze, niedliche Laute: additive Synthese mit
# Vokal-Formanten (etwas höher als ein Mensch, damit es klein wirkt).

VOKALE = {'a': (800, 1250), 'o': (520, 900), 'u': (350, 780), 'e': (480, 1900), 'i': (320, 2400)}


def silbe(vokal, f0, dauer, glide=(1.03, 0.97), vib=0.012):
    t = t_of(dauer)
    f = f0 * (glide[0] + (glide[1] - glide[0]) * t / dauer) * (1 + vib * np.sin(2 * np.pi * 6 * t))
    phase = 2 * np.pi * np.cumsum(f) / SR
    f1, f2 = (v * 1.35 for v in VOKALE[vokal])
    x = np.zeros_like(t)
    for h in range(1, int(5000 / f0) + 1):
        fh = h * f0
        gain = (1 / h**0.9) * (np.exp(-0.5 * ((fh - f1) / (f1 * 0.25)) ** 2) + 0.7 * np.exp(-0.5 * ((fh - f2) / (f2 * 0.18)) ** 2) + 0.05)
        x += gain * np.sin(h * phase)
    hull = np.clip(t / 0.008, 0, 1) * np.clip((dauer - t) / 0.03, 0, 1)
    return x * hull


def stimme(silben, f0=560, gap=0.035):
    teile = []
    for vokal, halbton, dauer, glide in silben:
        teile.append(silbe(vokal, f0 * 2 ** (halbton / 12), dauer, glide))
        teile.append(np.zeros(int(SR * gap)))
    return raum(tiefpass(np.concatenate(teile), 6000), 0.12)


def hallo():
    return stimme([('a', 2, 0.09, (1.03, 1.0)), ('o', -1, 0.17, (1.0, 0.92))])


def oh():
    return stimme([('o', 0, 0.38, (0.94, 1.14))])


def hmm():
    return stimme([('u', -7, 0.5, (1.0, 0.94))])


def yay():
    return stimme([('a', 0, 0.1, (1.0, 1.02)), ('e', 5, 0.22, (1.0, 1.07))])


def huch():
    return stimme([('u', 5, 0.07, (1.0, 1.1)), ('i', 9, 0.13, (1.05, 0.97))])


def babbel(seed):
    r = np.random.default_rng(seed)
    silben = [(str(r.choice(list('aoeiu'))), int(r.choice([-2, 0, 2, 3, 5])), float(r.uniform(0.06, 0.1)), (1.02, 0.98)) for _ in range(5)]
    return lambda: stimme(silben, gap=0.03)


# ───────────── Sound-Logo ─────────────


def logo(abstand=0.14, vorlauf=0.28, mit_whoosh=True, mit_flaeche=True):
    sec = vorlauf + 2 * abstand + 1.6
    x = np.zeros(int(SR * sec))
    if mit_whoosh:
        w = band_noise(0.32, 600, 3200, 0.5, 0.85) * 0.5
        x[: len(w)] += w
    for i, f in enumerate([783.99, 1046.5, 1318.5]):
        start = int(SR * (vorlauf + i * abstand))
        n = marimba(f, 1.2, 0.3 + i * 0.12, 0.2) + glas(f, 1.2, 0.35 + i * 0.25) * (0.35 + i * 0.25)
        x[start : start + len(n)] += n[: len(x) - start]
    if mit_flaeche:
        t = t_of(sec - vorlauf)
        flaeche = (np.sin(2 * np.pi * 261.63 * t) + 0.6 * np.sin(2 * np.pi * 392.0 * t)) * np.clip(t / 0.25, 0, 1) * np.exp(-t / 0.7) * 0.18
        x[int(SR * vorlauf) :] += flaeche
    return raum(x, 0.2, 0.6)


def logo_kurz():
    return logo(abstand=0.09, vorlauf=0.0, mit_whoosh=False, mit_flaeche=False)


# ───────────── Steigende Ticks (Listen) ─────────────

TICK_TOENE = [1046.5, 1174.66, 1318.51, 1567.98, 1760.0, 2093.0]


def tick_stufe(i):
    return lambda: raum(marimba(TICK_TOENE[i], 0.18, 0.05, 0.12), 0.08)


# Ziel-Lautheit in LUFS (Klicks bewusst leiser), Panorama von → nach
SOUNDS = {
    'pop': (pop, -20, (0, 0)),
    'tick': (tick, -23, (0, 0)),
    'tipp': (tipp, -26, (0, 0)),
    'whoosh': (whoosh, -21, (-0.6, 0.6)),
    'swish': (swish, -23, (0.4, -0.4)),
    'ding': (ding, -20, (0, 0)),
    'notify': (notify, -20, (0, 0)),
    'erfolg': (erfolg, -19, (0, 0)),
    'falsch': (falsch, -20, (0, 0)),
    'landen': (landen, -19, (0, 0)),
    'sprung': (sprung, -21, (0, 0)),
    'anstieg': (anstieg, -21, (-0.3, 0.3)),
    **{f'tick{i + 1}': (tick_stufe(i), -23, (0, 0)) for i in range(len(TICK_TOENE))},
    'stimme-hallo': (hallo, -19, (0, 0)),
    'stimme-oh': (oh, -19, (0, 0)),
    'stimme-hmm': (hmm, -21, (0, 0)),
    'stimme-yay': (yay, -19, (0, 0)),
    'stimme-huch': (huch, -19, (0, 0)),
    'stimme-babbel1': (babbel(1), -20, (0, 0)),
    'stimme-babbel2': (babbel(2), -20, (0, 0)),
    'stimme-babbel3': (babbel(3), -20, (0, 0)),
    'muenze': (muenze, -22, (0, 0)),
    'muenzen': (muenzen, -21, (0, 0)),
    'logo': (logo, -17, (0, 0)),
    'logo-kurz': (logo_kurz, -18, (0, 0)),
}


def schreibe_wav(path, x):
    import wave

    data = (np.clip(x, -1, 1) * 32767).astype('<i2')
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def lufs(path):
    out = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(path), '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    zeilen = [z for z in out.splitlines() if z.strip().startswith('I:')]
    return float(zeilen[-1].split()[1])


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    probe = []
    for name, (fn, ziel, pan) in SOUNDS.items():
        st = stereo(trim(norm(fn(), -1)), *pan)
        wav = OUT / f'{name}.wav'
        schreibe_wav(wav, st)
        gain = ziel - lufs(wav)
        gain = min(gain, -1 - 20 * np.log10(np.max(np.abs(st))))  # nie über -1 dBFS
        st = st * 10 ** (gain / 20)
        schreibe_wav(wav, st)
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(wav), '-c:a', 'libvorbis', '-q:a', '6', str(OUT / f'{name}.ogg')], check=True)
        wav.unlink()
        probe.append(st)
        probe.append(np.zeros((int(SR * 0.6), 2)))
        print(f'{name:16s} {len(st) / SR:.2f}s  {gain:+.1f} dB')
    PROBE.parent.mkdir(parents=True, exist_ok=True)
    schreibe_wav(PROBE, np.concatenate(probe))


if __name__ == '__main__':
    main()

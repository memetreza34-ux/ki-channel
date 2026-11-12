"""Kürzt Pausen im Klon-Ton: im Satz 0,12 s, nach Komma 0,18 s, Satzende 0,30 s (Armans Wunsch 2026-11-12).
Aufruf: python3 kanal/stimme/pausen-kuerzen.py <roh.wav> <untertitel.json> <neu.wav>  (danach Wortzeiten neu holen)"""
import sys, json, re, subprocess, wave
import numpy as np
roh, caps_p, out = sys.argv[1:4]
caps = json.load(open(caps_p))
log = subprocess.run(['ffmpeg','-hide_banner','-i',roh,'-af','silencedetect=n=-38dB:d=0.12','-f','null','-'],capture_output=True,text=True).stderr
pausen = [(float(e)-float(d), float(e)) for e, d in re.findall(r'silence_end: ([\d.]+) \| silence_duration: ([\d.]+)', log)]
w = wave.open(roh); sr = w.getframerate(); ch = w.getnchannels(); sw = w.getsampwidth()
a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).reshape(-1, ch).astype(np.float32)
teile, pos, gespart = [], 0, 0.0
for st, en in pausen:
    i = min(range(len(caps)), key=lambda k: abs(caps[k]['startMs']/1000 - en))
    vor = caps[i-1]['text'].strip() if i > 0 else ''
    ziel = 0.30 if vor[-1:] in '.?!' else 0.18 if vor[-1:] in ',:' else 0.12
    dauer = en - st
    print(f'{st:6.2f} {dauer:4.2f} -> {min(dauer, ziel):4.2f}  nach „{vor}“')
    if dauer <= ziel: continue
    rest = ziel / 2
    s1, s2 = int((st + rest) * sr), int((en - rest) * sr)
    teile.append(a[pos:s1]); pos = s2; gespart += dauer - ziel
teile.append(a[pos:])
# kurze Blenden an den Schnittstellen gegen Knacken
f = int(0.008 * sr)
for k in range(len(teile) - 1):
    teile[k][-f:] *= np.linspace(1, 0, f)[:, None]; teile[k+1][:f] *= np.linspace(0, 1, f)[:, None]
b = np.concatenate(teile).astype(np.int16)
o = wave.open(out, 'wb'); o.setnchannels(ch); o.setsampwidth(sw); o.setframerate(sr); o.writeframes(b.tobytes()); o.close()
print(f'gespart {gespart:.2f} s, neu {len(b)/sr:.2f} s')

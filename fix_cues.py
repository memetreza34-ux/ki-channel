import json

with open('ki/reels/2026-08-24_bis_2026-08-30/04_ChatGPT-Study-Mode-statt-Sofortloesung/03-caption/subtitle-cues.json', 'r') as f:
    data = json.load(f)

old_duration = 1950
new_duration = 1205
scale = new_duration / old_duration

for cue in data['cues']:
    cue['startFrame'] = int(cue['startFrame'] * scale)
    cue['endFrame'] = int(cue['endFrame'] * scale)
    
    words = []
    text_words = cue['text'].split()
    if len(text_words) > 0:
        word_duration = (cue['endFrame'] - cue['startFrame']) / len(text_words)
        for i, w in enumerate(text_words):
            words.append({
                "text": w,
                "startFrame": int(cue['startFrame'] + i * word_duration),
                "endFrame": int(cue['startFrame'] + (i + 1) * word_duration)
            })
    cue['words'] = words

data['timingStatus'] = "FINAL"

with open('ki/reels/2026-08-24_bis_2026-08-30/04_ChatGPT-Study-Mode-statt-Sofortloesung/03-caption/subtitle-cues.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

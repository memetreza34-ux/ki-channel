import json

# Update subtitle-cues.json
with open('ki/reels/2026-08-24_bis_2026-08-30/05_DALLE-GPT-wird-eingestellt/03-caption/subtitle-cues.json', 'r') as f:
    cues_data = json.load(f)

old_duration = 1380
new_duration = 1281
scale = new_duration / old_duration

for cue in cues_data['cues']:
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

cues_data['timingStatus'] = "FINAL"

with open('ki/reels/2026-08-24_bis_2026-08-30/05_DALLE-GPT-wird-eingestellt/03-caption/subtitle-cues.json', 'w') as f:
    json.dump(cues_data, f, indent=2, ensure_ascii=False)

# Update reel.json
with open('ki/reels/2026-08-24_bis_2026-08-30/05_DALLE-GPT-wird-eingestellt/06-projektdateien/reel.json', 'r') as f:
    reel_data = json.load(f)

reel_data['format']['finalDurationInFrames'] = new_duration
for scene in reel_data['scenes']:
    if scene['startFrame'] != 0:
        scene['startFrame'] = int(scene['startFrame'] * scale)
    scene['endFrame'] = int(scene['endFrame'] * scale)
    if scene['endFrame'] > new_duration - 5:
        scene['endFrame'] = new_duration
    scene['timingStatus'] = "FINAL_LOCKED_TO_AUDIO"

with open('ki/reels/2026-08-24_bis_2026-08-30/05_DALLE-GPT-wird-eingestellt/06-projektdateien/reel.json', 'w') as f:
    json.dump(reel_data, f, indent=2, ensure_ascii=False)

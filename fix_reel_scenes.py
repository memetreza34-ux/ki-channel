import json

with open('ki/reels/2026-08-24_bis_2026-08-30/05_DALLE-GPT-wird-eingestellt/03-caption/subtitle-cues.json', 'r') as f:
    cues_data = json.load(f)

# Find first start frame for each scene
scene_starts = {}
for cue in cues_data['cues']:
    scene_id = cue['sceneId']
    if scene_id not in scene_starts:
        scene_starts[scene_id] = cue['startFrame']

with open('ki/reels/2026-08-24_bis_2026-08-30/05_DALLE-GPT-wird-eingestellt/06-projektdateien/reel.json', 'r') as f:
    reel_data = json.load(f)

for i, scene in enumerate(reel_data['scenes']):
    scene_id = scene['sceneId']
    if scene_id in scene_starts:
        scene['startFrame'] = scene_starts[scene_id]
        
    # Set end frame to next scene's start, or final duration
    if i < len(reel_data['scenes']) - 1:
        next_scene_id = reel_data['scenes'][i+1]['sceneId']
        if next_scene_id in scene_starts:
            scene['endFrame'] = scene_starts[next_scene_id]
    else:
        scene['endFrame'] = 1281 # Final duration

with open('ki/reels/2026-08-24_bis_2026-08-30/05_DALLE-GPT-wird-eingestellt/06-projektdateien/reel.json', 'w') as f:
    json.dump(reel_data, f, indent=2, ensure_ascii=False)

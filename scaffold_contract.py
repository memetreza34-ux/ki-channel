import json

with open('./ki/reels/2026-08-24_bis_2026-08-30/03_ChatGPT-schaetzt-dein-Alter-und-schaltet-Teen-Schutz-ein/06-projektdateien/reel.json', 'r') as f:
    reel = json.load(f)

with open('./ki/reels/2026-08-24_bis_2026-08-30/03_ChatGPT-schaetzt-dein-Alter-und-schaltet-Teen-Schutz-ein/03-caption/subtitle-cues.json', 'r') as f:
    cues_data = json.load(f)

content = f"""export const CHATGPT_TEENS_COMPOSITION_ID = 'KI-ChatGPTForTeens';
export const CHATGPT_TEENS_FPS = 30;
export const CHATGPT_TEENS_WIDTH = 1080;
export const CHATGPT_TEENS_HEIGHT = 1920;
export const CHATGPT_TEENS_DURATION_IN_FRAMES = {reel['format']['durationInFrames']};

export type ChatGPTTeensScene = {{
  sceneId: string;
  startFrame: number;
  endFrame: number;
  title: string;
  icon: string;
}};

export type ChatGPTTeensCue = {{
  sceneId: string;
  startFrame: number;
  endFrame: number;
  text: string;
  words?: Array<{{text: string; startFrame: number; endFrame: number}}>;
}};

export const CHATGPT_TEENS_SCENES: ChatGPTTeensScene[] = [
"""
for s in reel["scenes"]:
    content += f"  {{sceneId: '{s['sceneId']}', startFrame: {s['startFrame']}, endFrame: {s['endFrame']}, title: '{s['title']}', icon: '{s['icon']}'}},\n"

content += "];\n\nexport const CHATGPT_TEENS_SUBTITLES: ChatGPTTeensCue[] = [\n"

for c in cues_data["cues"]:
    text = c['text'].replace("'", "\\'")
    content += f"  {{sceneId:'{c['sceneId']}',startFrame:{c['startFrame']},endFrame:{c['endFrame']},text:'{text}'"
    if "words" in c:
        words_str = ", words: ["
        for w in c["words"]:
            escaped_text = w["text"].replace("'", "\\'")
            words_str += f"{{text:'{escaped_text}',startFrame:{w['startFrame']},endFrame:{w['endFrame']}}},"
        words_str += "]"
        content += words_str
    content += "},\n"

content += "];\n"

with open('ki/src/reels/chatgpt-teens/contract.ts', 'w') as f:
    f.write(content)

import re

with open('ki/src/reels/chatgpt-study-mode/contract.ts', 'r') as f:
    content = f.read()

# Replace duration
content = re.sub(r'STUDY_MODE_PLANNING_DURATION_IN_FRAMES = \d+;', 'STUDY_MODE_PLANNING_DURATION_IN_FRAMES = 1205;', content)

# Scale scene frames
def replace_frames(match):
    start = int(match.group(1))
    end = int(match.group(2))
    new_start = int(start * 1205 / 1950) if start != 0 else 0
    new_end = int(end * 1205 / 1950)
    if new_end > 1200: new_end = 1205
    return f'startFrame:{new_start},endFrame:{new_end}'

content = re.sub(r'startFrame:(\d+),endFrame:(\d+)', replace_frames, content)

with open('ki/src/reels/chatgpt-study-mode/contract.ts', 'w') as f:
    f.write(content)

import re

with open('ki/src/reels/chatgpt-teens/ReelChatGPTTeens.tsx', 'r') as f:
    content = f.read()

content = content.replace("CHATGPT_TEENS_CAPTION_ZONE_Y,", "")
content = content.replace("scene.headline", "scene.title")

with open('ki/src/reels/chatgpt-teens/ReelChatGPTTeens.tsx', 'w') as f:
    f.write(content)

with open('ki/src/reels/chatgpt-teens/contract.ts', 'r') as f:
    content = f.read()
if "CHATGPT_TEENS_CAPTION_ZONE_Y" not in content:
    content += "\nexport const CHATGPT_TEENS_CAPTION_ZONE_Y = 1450;\n"
with open('ki/src/reels/chatgpt-teens/contract.ts', 'w') as f:
    f.write(content)

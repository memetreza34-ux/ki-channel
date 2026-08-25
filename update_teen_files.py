import re

# Update index.ts
with open('ki/src/reels/chatgpt-teens/index.ts', 'r') as f:
    content = f.read()
content = content.replace('AI_PRODUCT_AD_', 'CHATGPT_TEENS_')
content = content.replace('ai-product-ad', 'chatgpt-teens')
content = content.replace('ReelAIProductAd', 'ReelChatGPTTeens')
with open('ki/src/reels/chatgpt-teens/index.ts', 'w') as f:
    f.write(content)

# Update ReelChatGPTTeens.tsx
with open('ki/src/reels/chatgpt-teens/ReelChatGPTTeens.tsx', 'r') as f:
    content = f.read()
content = content.replace('AI_PRODUCT_AD_', 'CHATGPT_TEENS_')
content = content.replace('AIProductAdScene', 'ChatGPTTeensScene')
content = content.replace('AIProductAdCue', 'ChatGPTTeensCue')
content = content.replace('ReelAIProductAd', 'ReelChatGPTTeens')
content = content.replace('ai-product-ad', 'chatgpt-teens')
with open('ki/src/reels/chatgpt-teens/ReelChatGPTTeens.tsx', 'w') as f:
    f.write(content)

# Update Visuals.tsx
with open('ki/src/reels/chatgpt-teens/Visuals.tsx', 'r') as f:
    content = f.read()
content = content.replace('AI_PRODUCT_AD_', 'CHATGPT_TEENS_')
content = content.replace('AIProductAdScene', 'ChatGPTTeensScene')
content = content.replace('AIProductAdCue', 'ChatGPTTeensCue')
with open('ki/src/reels/chatgpt-teens/Visuals.tsx', 'w') as f:
    f.write(content)

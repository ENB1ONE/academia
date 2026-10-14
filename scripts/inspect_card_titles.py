with open('eload_dashboard.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
titles = re.findall(r'class="[^"]*card-title[^"]*"[^>]*>(.*?)<', text, re.I)
print('Card titles:', titles)

subtitles = re.findall(r'class="[^"]*card-header[^"]*"[^>]*>(.*?)</div>', text, re.S)
for s in subtitles[:15]:
    clean = re.sub(r'<[^>]+>', ' ', s).strip()
    if clean:
        print('Card Header:', clean)

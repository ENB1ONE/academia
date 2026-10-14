with open('eload_dashboard.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.finditer(r'[ÚU]LTIMAS ATIVIDADES', text, re.I)
for m in matches:
    idx = m.start()
    block = text[idx:idx+8000]
    items = re.findall(r'<li[^>]*>(.*?)</li>', block, re.S)
    print('Recent activities count:', len(items))
    for it in items[:10]:
        clean = re.sub(r'<[^>]+>', ' ', it).strip()
        print('  *', re.sub(r'\s+', ' ', clean))

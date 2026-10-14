with open('eload_dashboard.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.finditer(r'ATLETAS EM RISCO - AGUDO:CR[OÔÓ]NICO', text, re.I)
for m in matches:
    idx = m.start()
    print(text[idx:idx+3500])
    print('='*50)

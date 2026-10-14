with open('eload_atletas.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'createDefaultTable', text)]
for idx in matches:
    print(text[max(0, idx-200):min(len(text), idx+500)])
    print('='*50)

with open('eload_atletas.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
scripts = re.findall(r'<script[^>]*>(.*?)</script>', text, re.S)
for s in scripts:
    if 'showGrid' in s:
        print('=== SHOWGRID SCRIPT ===\n', s)

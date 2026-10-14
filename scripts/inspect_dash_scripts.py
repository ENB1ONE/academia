with open('eload_dashboard.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
scripts = re.findall(r'<script[^>]*>(.*?)</script>', text, re.S)
for i, s in enumerate(scripts):
    if 'NREUM' in s:
        continue
    if len(s.strip()) > 30:
        print(f'=== SCRIPT {i} (len {len(s)}) ===\n', s[:600])

with open('eload_dashboard.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'<script[^>]*>(.*?)</script>', text, re.S)
for s in matches:
    if 'chart' in s.lower() or 'acwr' in s.lower() or 'risco' in s.lower() or 'dados' in s.lower() or 'url:' in s.lower() or 'ajax' in s.lower():
        print('=== DASH SCRIPT MATCH ===\n', s[:1000])
        print('='*40)

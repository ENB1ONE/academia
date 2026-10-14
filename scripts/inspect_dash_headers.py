with open('eload_dashboard.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# check widgets / tables in dashboard html
cards = re.findall(r'<div[^>]*class="[^"]*card[^"]*"[^>]*>(.*?)</div>', text, re.S)
print('Dashboard cards found:', len(cards))

headers = re.findall(r'<h[1-6][^>]*>(.*?)</h[1-6]>', text, re.S)
for h in headers[:25]:
    clean = re.sub(r'<[^>]+>', '', h).strip()
    if clean:
        print('Header:', clean)

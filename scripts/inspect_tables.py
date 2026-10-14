with open('eload_atletas.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
tables = re.findall(r'<table[^>]*>(.*?)</table>', text, re.S)
print('Tables in Atleta:', len(tables))
if tables:
    print('First 1500 chars of table 0:\n', tables[0][:1500])

scripts = re.findall(r'<script[^>]*>(.*?)</script>', text, re.S)
for i, s in enumerate(scripts):
    if 'ajax' in s.lower() or 'datatable' in s.lower() or 'atleta' in s.lower():
        print(f'Script {i} matches keywords (len {len(s)}):\n', s[:500])

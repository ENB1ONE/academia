with open('eload_dashboard.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
scripts_src = re.findall(r'<script[^>]*src=[\'"]([^\'"]+)[\'"]', text)
print('Dashboard scripts:')
for s in scripts_src:
    if 'views' in s or 'dashboard' in s.lower() or 'admin' in s.lower():
        print(' ', s)

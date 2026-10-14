with open('eload_atletas.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
scripts_src = re.findall(r'<script[^>]*src=[\'"]([^\'"]+)[\'"]', text)
print('Script sources:')
for s in scripts_src:
    print(' ', s)

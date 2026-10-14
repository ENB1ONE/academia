with open('eload_dashboard.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.finditer(r'ATLETAS EM RISCO - STRAIN', text, re.I)
for m in matches:
    idx = m.start()
    block = text[idx:idx+8000]
    names = re.findall(r'<a href="MonitoramentoIndividual/Atleta/\d+">\s*<i[^>]*></i>\s*([^<]+)</a>', block)
    print('Athletes in Strain Risk:', [n.strip() for n in names])

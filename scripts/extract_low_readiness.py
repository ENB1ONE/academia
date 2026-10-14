with open('eload_dashboard.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.finditer(r'ALERTA DE PRONTID[AÃA]O BAIXA', text, re.I)
for m in matches:
    idx = m.start()
    block = text[idx:idx+8000]
    names = re.findall(r'<a href="MonitoramentoIndividual/Atleta/\d+">\s*<i[^>]*></i>\s*([^<]+)</a>', block)
    print('Low readiness athletes:', [n.strip() for n in names])

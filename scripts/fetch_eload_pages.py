import requests
import re
import json
import os

s = requests.Session()
r1 = s.get('https://app.eload.com.br/')
token_match = re.search(r'name="__RequestVerificationToken"\s+type="hidden"\s+value="([^"]+)"', r1.text)
token = token_match.group(1) if token_match else ''

payload = {
    'email': 'ctformclub@gmail.com',
    'senha': 'formclub10',
    'lembrar': 'true',
    '__RequestVerificationToken': token
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://app.eload.com.br/',
    'Origin': 'https://app.eload.com.br'
}

r2 = s.post('https://app.eload.com.br/', data=payload, headers=headers, allow_redirects=True)
if 'sair' not in r2.text.lower() and 'Dashboard' not in r2.url:
    print('Failed to login to eLoad')
    exit(1)

print('Logged in successfully!')

# 1. Fetch Atletas page
r_atletas = s.get('https://app.eload.com.br/Atleta')
with open('eload_atletas.html', 'w', encoding='utf-8') as f:
    f.write(r_atletas.text)
print('Saved eload_atletas.html, length:', len(r_atletas.text))

# 2. Fetch Grupos page
r_grupos = s.get('https://app.eload.com.br/Grupo')
with open('eload_grupos.html', 'w', encoding='utf-8') as f:
    f.write(r_grupos.text)
print('Saved eload_grupos.html, length:', len(r_grupos.text))

# 3. Fetch Tipos de Treino
r_tipos = s.get('https://app.eload.com.br/TipoTreino')
with open('eload_tipos.html', 'w', encoding='utf-8') as f:
    f.write(r_tipos.text)
print('Saved eload_tipos.html, length:', len(r_tipos.text))

# 4. Fetch Totem page
r_totem = s.get('https://app.eload.com.br/Totem')
with open('eload_totem.html', 'w', encoding='utf-8') as f:
    f.write(r_totem.text)
print('Saved eload_totem.html, length:', len(r_totem.text))

# 5. Fetch Dashboard page
r_dash = s.get('https://app.eload.com.br/Dashboard')
with open('eload_dashboard.html', 'w', encoding='utf-8') as f:
    f.write(r_dash.text)
print('Saved eload_dashboard.html, length:', len(r_dash.text))

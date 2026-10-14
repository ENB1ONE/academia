import requests
import re
import json

s = requests.Session()
r1 = s.get('https://app.eload.com.br/')
token = re.search(r'name="__RequestVerificationToken"\s+type="hidden"\s+value="([^"]+)"', r1.text).group(1)
payload = {'email': 'ctformclub@gmail.com', 'senha': 'formclub10', 'lembrar': 'true', '__RequestVerificationToken': token}
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://app.eload.com.br/',
    'Origin': 'https://app.eload.com.br'
}
s.post('https://app.eload.com.br/', data=payload, headers=headers)

# Test /Atleta/GetData
dt_payload = {
    'draw': '1',
    'start': '0',
    'length': '150',
    'search[value]': '',
    'search[regex]': 'false',
    'formSerialize': ''
}
dt_headers = {
    'X-Requested-With': 'XMLHttpRequest',
    'Referer': 'https://app.eload.com.br/Atleta'
}

r_atletas_data = s.post('https://app.eload.com.br/Atleta/GetData', data=dt_payload, headers=dt_headers)
print('Atleta/GetData status:', r_atletas_data.status_code)
try:
    data = r_atletas_data.json()
    print('Records Total:', data.get('recordsTotal'))
    print('Records Filtered:', data.get('recordsFiltered'))
    print('First item:', data.get('data', [])[0] if data.get('data') else None)
    with open('eload_atletas_full.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print('Saved eload_atletas_full.json with items:', len(data.get('data', [])))
except Exception as e:
    print('Error decoding json:', e)
    print('Response:', r_atletas_data.text[:500])

# Test /Grupo/GetData
r_grupos_data = s.post('https://app.eload.com.br/Grupo/GetData', data=dt_payload, headers=dt_headers)
print('Grupo/GetData status:', r_grupos_data.status_code)
try:
    gdata = r_grupos_data.json()
    print('Grupos count:', len(gdata.get('data', [])))
    with open('eload_grupos_full.json', 'w', encoding='utf-8') as f:
        json.dump(gdata, f, ensure_ascii=False, indent=2)
except Exception as e:
    print('Error grupos json:', e)

# Test /TipoTreino/GetData
r_tipos_data = s.post('https://app.eload.com.br/TipoTreino/GetData', data=dt_payload, headers=dt_headers)
print('TipoTreino/GetData status:', r_tipos_data.status_code)
try:
    tdata = r_tipos_data.json()
    print('Tipos count:', len(tdata.get('data', [])))
    with open('eload_tipos_full.json', 'w', encoding='utf-8') as f:
        json.dump(tdata, f, ensure_ascii=False, indent=2)
except Exception as e:
    print('Error tipos json:', e)

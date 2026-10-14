import requests
import re
import json

s = requests.Session()
r1 = s.get('https://app.eload.com.br/')
token_match = re.search(r'name="__RequestVerificationToken"\s+type="hidden"\s+value="([^"]+)"', r1.text)
token = token_match.group(1) if token_match else ''
print('Token found:', bool(token))

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
print('After login url:', r2.url)
print('Status code:', r2.status_code)
print('Cookies:', s.cookies.get_dict())

if 'Dashboard' in r2.url or 'Home' in r2.url or 'sair' in r2.text.lower():
    print('LOGIN SUCCESSFUL!')
    with open('eload_dashboard.html', 'w', encoding='utf-8') as f:
        f.write(r2.text)
else:
    print('Login failed. Page size:', len(r2.text))
    with open('eload_login_failed.html', 'w', encoding='utf-8') as f:
        f.write(r2.text)

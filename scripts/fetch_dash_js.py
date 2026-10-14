import requests

s = requests.Session()
r1 = s.get('https://app.eload.com.br/')
import re
token = re.search(r'name="__RequestVerificationToken"\s+type="hidden"\s+value="([^"]+)"', r1.text).group(1)
payload = {'email': 'ctformclub@gmail.com', 'senha': 'formclub10', 'lembrar': 'true', '__RequestVerificationToken': token}
s.post('https://app.eload.com.br/', data=payload)

r_dash_js = s.get('https://app.eload.com.br/views/dashboard/index.js')
with open('eload_dash_index.js', 'w', encoding='utf-8') as f:
    f.write(r_dash_js.text)
print('Saved eload_dash_index.js, len:', len(r_dash_js.text))
print(r_dash_js.text[:2000])

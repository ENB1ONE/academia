import requests

s = requests.Session()
# load previous cookies from login
# Let's do login again to get fresh session
r1 = s.get('https://app.eload.com.br/')
import re
token = re.search(r'name="__RequestVerificationToken"\s+type="hidden"\s+value="([^"]+)"', r1.text).group(1)
payload = {'email': 'ctformclub@gmail.com', 'senha': 'formclub10', 'lembrar': 'true', '__RequestVerificationToken': token}
s.post('https://app.eload.com.br/', data=payload)

r_dt = s.get('https://app.eload.com.br/admin/scripts/DataTableDefaultControllers.js')
print('DataTableDefaultControllers.js content:\n', r_dt.text[:1500])

import re
import json

with open('eload_grupos.html', 'r', encoding='utf-8') as f:
    grupos_html = f.read()

# Inspect groups table
print('--- GRUPOS ---')
groups = re.findall(r'<tr[^>]*>.*?<td>(.*?)</td>', grupos_html, re.S)
for g in groups[:15]:
    clean = re.sub(r'<[^>]+>', '', g).strip()
    if clean:
        print('Grupo row:', clean)

with open('eload_tipos.html', 'r', encoding='utf-8') as f:
    tipos_html = f.read()

print('--- TIPOS ---')
tipos = re.findall(r'<tr[^>]*>.*?<td>(.*?)</td>', tipos_html, re.S)
for t in tipos[:20]:
    clean = re.sub(r'<[^>]+>', '', t).strip()
    if clean:
        print('Tipo row:', clean)

with open('eload_totem.html', 'r', encoding='utf-8') as f:
    totem_html = f.read()

print('--- TOTEM ATLETAS ---')
# Check how athletes are rendered in totem
totem_cards = re.findall(r'class="[^"]*atleta[^"]*"[^>]*>|data-nome="([^"]+)"|data-id="([^"]+)"|data-nascimento="([^"]+)"', totem_html, re.I)
print('Totem card patterns found:', len(totem_cards))

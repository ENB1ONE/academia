import os

files = [
    'frontend/src/pages/monitoring/PainMapPage.jsx',
    'frontend/src/pages/monitoring/MenstrualCyclePage.jsx',
    'frontend/src/pages/monitoring/PhysicalTestsPage.jsx'
]

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    content = content.replace('Ó', '"')
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

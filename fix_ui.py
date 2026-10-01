import os
import re

def fix_utf8(content):
    replacements = {
        "ǜ": "çã",
        "?": "Í",
        "\"": "Ó",
        "ǭ": "á",
        "Ǹ": "é",
        "es": "ções",
        "mǧsculos": "músculos",
        "articulaes": "articulações"
    }
    for bad, good in replacements.items():
        content = content.replace(bad, good)
    return content

def hide_athlete_select(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Apply UTF-8 fixes just in case
    content = fix_utf8(content)

    # PainMapPage.jsx: 
    # <Card padding="p-4" className="mb-4">
    #    ... select ...
    # </Card>
    if "PainMapPage" in filepath:
        if "{!isAtleta && (" not in content and '<Card padding="p-4" className="mb-4">' in content:
            content = content.replace('<Card padding="p-4" className="mb-4">', '{!isAtleta && (\n      <Card padding="p-4" className="mb-4">')
            # find the next </Card> after that
            idx = content.find('{!isAtleta && (\n      <Card padding="p-4" className="mb-4">')
            idx2 = content.find('</Card>', idx)
            content = content[:idx2+7] + '\n      )}' + content[idx2+7:]

    elif "MenstrualCyclePage" in filepath:
        if "{!isAtleta && (" not in content and '<div className="mb-6">' in content:
            content = content.replace('<div className="mb-6">\n          <label className="block text-sm font-medium text-gray-300 mb-1.5">Atleta</label>', '{!isAtleta && (\n        <div className="mb-6">\n          <label className="block text-sm font-medium text-gray-300 mb-1.5">Atleta</label>')
            content = content.replace('</select>\n        </div>', '</select>\n        </div>\n        )}')

    elif "PhysicalTestsPage" in filepath:
        if "{!isAtleta && (" not in content and '<div className="mb-6">' in content:
            content = content.replace('<div className="mb-6">\n          <label className="block text-sm font-medium text-gray-300 mb-1.5">Atleta</label>', '{!isAtleta && (\n        <div className="mb-6">\n          <label className="block text-sm font-medium text-gray-300 mb-1.5">Atleta</label>')
            content = content.replace('</select>\n        </div>', '</select>\n        </div>\n        )}')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

files = [
    'frontend/src/pages/monitoring/PainMapPage.jsx',
    'frontend/src/pages/monitoring/MenstrualCyclePage.jsx',
    'frontend/src/pages/monitoring/PhysicalTestsPage.jsx'
]

for f in files:
    hide_athlete_select(f)

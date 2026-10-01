import re

with open('src/pages/athletes/AthletesPage.jsx', 'r', encoding='utf-8') as f:
    data = f.read()

target = r"const savedAvatar = localStorage.getItem(\thleteAvatar_\\);"
replacement = r"const savedAvatar = localStorage.getItem(\thleteAvatar_\\) || (athlete.user_id ? localStorage.getItem(\userAvatar_\\) : null);"

data = data.replace(target.replace('\\', ''), replacement.replace('\\', ''))

with open('src/pages/athletes/AthletesPage.jsx', 'w', encoding='utf-8') as f:
    f.write(data)

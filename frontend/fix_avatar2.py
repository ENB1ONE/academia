with open('src/pages/athletes/AthletesPage.jsx', 'r', encoding='utf-8') as f:
    data = f.read()

target = "const savedAvatar = localStorage.getItem(\thleteAvatar_\\);"
replacement = "const savedAvatar = localStorage.getItem(\thleteAvatar_\\) || (athlete.user_id ? localStorage.getItem(\userAvatar_\\) : null);"

data = data.replace(target, replacement)

with open('src/pages/athletes/AthletesPage.jsx', 'w', encoding='utf-8') as f:
    f.write(data)

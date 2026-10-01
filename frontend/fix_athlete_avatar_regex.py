import re

with open("src/pages/athletes/AthleteDetailPage.jsx", "r", encoding="utf-8") as f:
    data = f.read()

target = r'const savedAvatar = localStorage\.getItem\(`athleteAvatar_\$\{athlete\.id\}`\) \|\| \(athlete\.user_id \? localStorage\.getItem\(`userAvatar_\$\{athlete\.user_id\}`\) : null\);'
replacement = 'const savedAvatar = athlete.photo_url || localStorage.getItem(`athleteAvatar_${athlete.id}`) || (athlete.user_id ? localStorage.getItem(`userAvatar_${athlete.user_id}`) : null);'

data = re.sub(target, replacement, data)

with open("src/pages/athletes/AthleteDetailPage.jsx", "w", encoding="utf-8") as f:
    f.write(data)

import re

with open("src/pages/athletes/AthletesPage.jsx", "r", encoding="utf-8") as f:
    data = f.read()

target1 = r'const savedAvatar = localStorage\.getItem\(`athleteAvatar_\$\{athlete\.id\}`\) \|\| \(athlete\.user_id \? localStorage\.getItem\(`userAvatar_\$\{athlete\.user_id\}`\) : null\);'
replacement1 = 'const savedAvatar = athlete.photo_url || localStorage.getItem(`athleteAvatar_${athlete.id}`) || (athlete.user_id ? localStorage.getItem(`userAvatar_${athlete.user_id}`) : null);'

target2 = r'const avatar = localStorage\.getItem\(`athleteAvatar_\$\{athlete\.id\}`\) \|\| \(athlete\.user_id \? localStorage\.getItem\(`userAvatar_\$\{athlete\.user_id\}`\) : null\);'
replacement2 = 'const avatar = athlete.photo_url || localStorage.getItem(`athleteAvatar_${athlete.id}`) || (athlete.user_id ? localStorage.getItem(`userAvatar_${athlete.user_id}`) : null);'

data = re.sub(target1, replacement1, data)
data = re.sub(target2, replacement2, data)

with open("src/pages/athletes/AthletesPage.jsx", "w", encoding="utf-8") as f:
    f.write(data)

with open("src/pages/athletes/AthleteDetailPage.jsx", "r", encoding="utf-8") as f:
    data = f.read()

target = """            {(() => {
              const savedAvatar = localStorage.getItem(`athleteAvatar_${athlete.id}`) || (athlete.user_id ? localStorage.getItem(`userAvatar_${athlete.user_id}`) : null);
              return savedAvatar ? ("""

replacement = """            {(() => {
              const savedAvatar = athlete.photo_url || localStorage.getItem(`athleteAvatar_${athlete.id}`) || (athlete.user_id ? localStorage.getItem(`userAvatar_${athlete.user_id}`) : null);
              return savedAvatar ? ("""

data = data.replace(target, replacement)

with open("src/pages/athletes/AthleteDetailPage.jsx", "w", encoding="utf-8") as f:
    f.write(data)

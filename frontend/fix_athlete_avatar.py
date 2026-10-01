with open("src/pages/athletes/AthleteDetailPage.jsx", "r", encoding="utf-8") as f:
    data = f.read()

target = """  useEffect(() => {
    if (athlete) {
      const savedAvatar = localStorage.getItem(`athleteAvatar_${athlete.id}`) || 
                          (athlete.user_id ? localStorage.getItem(`userAvatar_${athlete.user_id}`) : null);
      if (savedAvatar) {
        setAvatar(savedAvatar);
      }
    }
  }, [athlete]);"""

replacement = """  useEffect(() => {
    if (athlete) {
      if (athlete.photo_url) {
        setAvatar(athlete.photo_url);
      } else {
        const savedAvatar = localStorage.getItem(`athleteAvatar_${athlete.id}`) || 
                            (athlete.user_id ? localStorage.getItem(`userAvatar_${athlete.user_id}`) : null);
        if (savedAvatar) {
          setAvatar(savedAvatar);
        }
      }
    }
  }, [athlete]);"""

data = data.replace(target, replacement)

with open("src/pages/athletes/AthleteDetailPage.jsx", "w", encoding="utf-8") as f:
    f.write(data)

with open("src/pages/athletes/AthletesPage.jsx", "r", encoding="utf-8") as f:
    data2 = f.read()

target2 = """        const savedAvatar = localStorage.getItem(`athleteAvatar_${athlete.id}`) || (athlete.user_id ? localStorage.getItem(`userAvatar_${athlete.user_id}`) : null);
        setAvatar(savedAvatar || null);"""

replacement2 = """        const savedAvatar = athlete.photo_url || localStorage.getItem(`athleteAvatar_${athlete.id}`) || (athlete.user_id ? localStorage.getItem(`userAvatar_${athlete.user_id}`) : null);
        setAvatar(savedAvatar || null);"""

target3 = """                  const avatar = localStorage.getItem(`athleteAvatar_${athlete.id}`) || (athlete.user_id ? localStorage.getItem(`userAvatar_${athlete.user_id}`) : null);"""
replacement3 = """                  const avatar = athlete.photo_url || localStorage.getItem(`athleteAvatar_${athlete.id}`) || (athlete.user_id ? localStorage.getItem(`userAvatar_${athlete.user_id}`) : null);"""

data2 = data2.replace(target2, replacement2)
data2 = data2.replace(target3, replacement3)

with open("src/pages/athletes/AthletesPage.jsx", "w", encoding="utf-8") as f:
    f.write(data2)

import re
with open("src/pages/athletes/AthleteDetailPage.jsx", "r", encoding="utf-8") as f:
    data = f.read()

target = r'<div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl border border-primary/30">\s*\{athlete\.name\.charAt\(0\)\}\s*</div>'

replacement = """{(() => {
            const savedAvatar = localStorage.getItem(`athleteAvatar_${athlete.id}`) || (athlete.user_id ? localStorage.getItem(`userAvatar_${athlete.user_id}`) : null);
            return savedAvatar ? (
              <img src={savedAvatar} alt={athlete.name} className="h-20 w-20 rounded-full object-cover border-2 border-primary/50" />
            ) : (
              <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl border border-primary/30">
                {athlete.name.charAt(0).toUpperCase()}
              </div>
            );
          })()}"""

data = re.sub(target, replacement, data)

with open("src/pages/athletes/AthleteDetailPage.jsx", "w", encoding="utf-8") as f:
    f.write(data)

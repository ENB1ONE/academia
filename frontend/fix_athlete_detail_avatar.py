with open("src/pages/athletes/AthleteDetailPage.jsx", "r", encoding="utf-8") as f:
    data = f.read()

target = """        <Card padding="p-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl border border-primary/30">
              {athlete.name.charAt(0)}
            </div>"""

replacement = """        <Card padding="p-6">
          <div className="flex items-center gap-6">
            {(() => {
              const savedAvatar = localStorage.getItem(`athleteAvatar_${athlete.id}`) || (athlete.user_id ? localStorage.getItem(`userAvatar_${athlete.user_id}`) : null);
              return savedAvatar ? (
                <img src={savedAvatar} alt={athlete.name} className="h-20 w-20 rounded-full object-cover border-2 border-primary/50" />
              ) : (
                <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl border border-primary/30">
                  {athlete.name.charAt(0).toUpperCase()}
                </div>
              );
            })()}"""

data = data.replace(target, replacement)

with open("src/pages/athletes/AthleteDetailPage.jsx", "w", encoding="utf-8") as f:
    f.write(data)

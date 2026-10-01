with open("src/pages/athletes/AthleteDetailPage.jsx", "r", encoding="utf-8") as f:
    data = f.read()

data = data.replace("Histórico de Dores", "Histórico de Dores") # if already fixed
data = data.replace("Histrico de Dores", "Histórico de Dores")
data = data.replace("Nvel", "Nível")

with open("src/pages/athletes/AthleteDetailPage.jsx", "w", encoding="utf-8") as f:
    f.write(data)

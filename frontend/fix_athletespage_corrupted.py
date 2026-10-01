# coding: utf-8
with open("src/pages/athletes/AthletesPage.jsx", "r", encoding="utf-8") as f:
    data = f.read()

data = data.replace("GÃªnero", "G�nero")
data = data.replace("gÃªnero", "g�nero")
data = data.replace("PosiÃ§Ã£o", "Posi��o")

with open("src/pages/athletes/AthletesPage.jsx", "w", encoding="utf-8") as f:
    f.write(data)

# coding: utf-8
with open("src/pages/athletes/AthleteDetailPage.jsx", "r", encoding="utf-8") as f:
    data = f.read()

data = data.replace("Histrico de Dores", "Hist\u00f3rico de Dores")
data = data.replace("Hist\ufffdrico de Dores", "Hist\u00f3rico de Dores")
data = data.replace("Nvel", "N\u00edvel")
data = data.replace("N\ufffdvel", "N\u00edvel")

with open("src/pages/athletes/AthleteDetailPage.jsx", "w", encoding="utf-8") as f:
    f.write(data)

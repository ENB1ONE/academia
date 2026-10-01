# coding: utf-8
import os

filepath = "src/pages/athletes/AthletesPage.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    data = f.read()

replacements = {
    "JoÃ£o": "João",
    "PosiÃ§Ã£o": "Posição",
    "GÃªnero": "Gênero",
    "gÃªnero": "gênero",
    "AlteraÃ§Ãµes": "Alterações",
    "PosiÃƒÂ§ÃƒÂ£o": "Posição",
    "GÃƒÂªnero": "Gênero",
    "gÃƒÂªnero": "gênero",
    "AlteraÃƒÂ§ÃƒÂµes": "Alterações"
}

for bad, good in replacements.items():
    data = data.replace(bad, good)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(data)

print("Fixed encoding in AthletesPage.jsx")

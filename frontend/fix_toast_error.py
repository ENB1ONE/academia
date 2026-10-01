with open("src/pages/athletes/AthletesPage.jsx", "r", encoding="utf-8") as f:
    data = f.read()

target = "toast.error('Erro ao salvar atleta. Verifique os dados.');"
replacement = "toast.error(error.response?.data?.detail || 'Erro ao salvar atleta. Verifique os dados.');"

data = data.replace(target, replacement)

with open("src/pages/athletes/AthletesPage.jsx", "w", encoding="utf-8") as f:
    f.write(data)

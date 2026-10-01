with open("src/components/layout/PwaInstallPrompt.jsx", "r", encoding="utf-8") as f:
    data = f.read()
data = data.replace("Adicionar   Tela", "Adicionar à Tela")
with open("src/components/layout/PwaInstallPrompt.jsx", "w", encoding="utf-8") as f:
    f.write(data)

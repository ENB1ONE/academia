with open("src/components/layout/Sidebar.jsx", "r", encoding="utf-8") as f:
    data = f.read()

data = data.replace("athleteProfile?.gender === 'F'", "athleteProfile?.gender === 'Feminino'")

with open("src/components/layout/Sidebar.jsx", "w", encoding="utf-8") as f:
    f.write(data)

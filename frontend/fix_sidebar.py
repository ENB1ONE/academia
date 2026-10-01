with open("src/components/layout/Sidebar.jsx", "r", encoding="utf-8") as f:
    data = f.read()

data = data.replace("const { user, logout } = useAuthStore();", "const { user, athleteProfile, logout } = useAuthStore();")

target = r"{ to: '/monitoring/menstrual', icon: Flower2, label: 'Ciclo Menstrual', show: true },"
replacement = r"{ to: '/monitoring/menstrual', icon: Flower2, label: 'Ciclo Menstrual', show: isTreinador || (user?.role === 'atleta' && athleteProfile?.gender === 'F') },"

data = data.replace(target, replacement)
data = data.replace("{ to: '/monitoring/menstrual', icon: Flower2, label: 'Ciclo Menstrual', show: user?.role === 'atleta' }", replacement)

with open("src/components/layout/Sidebar.jsx", "w", encoding="utf-8") as f:
    f.write(data)

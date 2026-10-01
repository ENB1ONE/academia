with open("src/components/auth/ForcePasswordChangeModal.jsx", "r", encoding="utf-8") as f:
    data = f.read()

data = data.replace("const { user, setUser } = useAuthStore();", "const { user, updateUser } = useAuthStore();")
data = data.replace("setUser({ ...user, force_password_change: false });", "updateUser({ ...user, force_password_change: false });")

with open("src/components/auth/ForcePasswordChangeModal.jsx", "w", encoding="utf-8") as f:
    f.write(data)

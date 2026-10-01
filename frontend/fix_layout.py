with open("src/components/layout/DashboardLayout.jsx", "r", encoding="utf-8") as f:
    data = f.read()

data = data.replace("import Sidebar from './Sidebar';", "import Sidebar from './Sidebar';\nimport ForcePasswordChangeModal from '../auth/ForcePasswordChangeModal';")
data = data.replace("<Sidebar />", "<ForcePasswordChangeModal />\n      <Sidebar />")

with open("src/components/layout/DashboardLayout.jsx", "w", encoding="utf-8") as f:
    f.write(data)

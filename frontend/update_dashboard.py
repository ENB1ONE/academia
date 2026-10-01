with open("src/components/layout/DashboardLayout.jsx", "r", encoding="utf-8") as f:
    data = f.read()

import_statement = "import CompleteSetupModal from './CompleteSetupModal';\n"
if "CompleteSetupModal" not in data:
    data = data.replace("import Sidebar from './Sidebar';", import_statement + "import Sidebar from './Sidebar';")
    
    # insert inside the main div
    data = data.replace("<div className=\"min-h-screen bg-background flex\">", "<div className=\"min-h-screen bg-background flex\">\n      <CompleteSetupModal />")

    with open("src/components/layout/DashboardLayout.jsx", "w", encoding="utf-8") as f:
        f.write(data)

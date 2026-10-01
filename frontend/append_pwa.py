with open("src/App.jsx", "r", encoding="utf-8") as f:
    data = f.read()

import_str = "import PwaInstallPrompt from './components/layout/PwaInstallPrompt';\n"
if "PwaInstallPrompt" not in data:
    data = data.replace("import useAuthStore", import_str + "import useAuthStore")
    
    target = "    <Routes>"
    replacement = "    <>\n      <PwaInstallPrompt />\n      <Routes>"
    data = data.replace(target, replacement)
    
    data = data.replace("    </Routes>\n  );", "    </Routes>\n    </>\n  );")

with open("src/App.jsx", "w", encoding="utf-8") as f:
    f.write(data)

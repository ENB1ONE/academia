with open("src/App.jsx", "r", encoding="utf-8") as f:
    data = f.read()

import_statement = "import CookieConsent from './components/layout/CookieConsent';\n"
if "CookieConsent" not in data:
    data = data.replace("import PwaInstallPrompt", import_statement + "import PwaInstallPrompt")
    data = data.replace("<PwaInstallPrompt />", "<PwaInstallPrompt />\n      <CookieConsent />")

    with open("src/App.jsx", "w", encoding="utf-8") as f:
        f.write(data)

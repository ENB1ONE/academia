# coding: utf-8
import re
with open("src/pages/athletes/AthletesPage.jsx", "r", encoding="utf-8") as f:
    data = f.read()

data = data.replace("position: athlete.position || ''", "position: athlete.position || '',\n          gender: athlete.gender || ''")
data = data.replace("position: '' }", "position: '', gender: '' }")

form_html = """
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">G\u00eanero</label>
                  <select
                    className="w-full bg-background border border-gray-700 rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="">Selecione...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Esporte/Modalidade</label>
"""

target = r'<div>\s*<label className="block text-sm font-medium text-gray-400 mb-1">Esporte/Modalidade</label>'
data = re.sub(target, form_html.strip(), data)

with open("src/pages/athletes/AthletesPage.jsx", "w", encoding="utf-8") as f:
    f.write(data)

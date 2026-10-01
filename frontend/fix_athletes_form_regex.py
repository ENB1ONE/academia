# coding: utf-8
import re

with open("src/pages/athletes/AthletesPage.jsx", "r", encoding="utf-8") as f:
    data = f.read()

def replace_func(match):
    return match.group(0) + """
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">G\u00eanero</label>
                  <select 
                    value={formData.gender || ''} 
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="block w-full rounded-lg bg-background border border-gray-700 text-text focus:ring-primary focus:border-primary sm:text-sm px-3 py-2"
                  >
                    <option value="">Selecione o g\u00eanero...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                  </select>
                </div>"""

# Find the end of the <div className="grid grid-cols-2 gap-4"> block
pattern = r'<div className="grid grid-cols-2 gap-4">[\s\S]*?</div>'

# Sub the first match (there is only one grid grid-cols-2 gap-4)
data = re.sub(pattern, lambda m: replace_func(m).encode('utf-8').decode('unicode_escape'), data, count=1)

with open("src/pages/athletes/AthletesPage.jsx", "w", encoding="utf-8") as f:
    f.write(data)

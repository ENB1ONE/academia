# coding: utf-8
with open("src/pages/athletes/AthletesPage.jsx", "r", encoding="utf-8") as f:
    data = f.read()

target = """                <div className="grid grid-cols-2 gap-4">
                  <Input label="Modalidade" placeholder="Ex: Futebol" value={formData.sport} onChange={(e) => setFormData({...formData, sport: e.target.value})} />
                  <Input label="Posi\u00e7\u00e3o" placeholder="Ex: Goleiro" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} />
                </div>"""

replacement = """                <div className="grid grid-cols-2 gap-4">
                  <Input label="Modalidade" placeholder="Ex: Futebol" value={formData.sport} onChange={(e) => setFormData({...formData, sport: e.target.value})} />
                  <Input label="Posi\u00e7\u00e3o" placeholder="Ex: Goleiro" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} />
                </div>
                
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

data = data.replace(target.encode('utf-8').decode('unicode_escape'), replacement.encode('utf-8').decode('unicode_escape'))

with open("src/pages/athletes/AthletesPage.jsx", "w", encoding="utf-8") as f:
    f.write(data)

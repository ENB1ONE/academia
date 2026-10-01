const fs = require('fs');
let f = fs.readFileSync('src/pages/athletes/AthletesPage.jsx', 'utf8');

f = f.replace("position: athlete.position || ''", "position: athlete.position || '',\n          gender: athlete.gender || ''");
f = f.replace("position: '' }", "position: '', gender: '' }");

let formHtml = \
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Gênero</label>
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
\;
f = f.replace(/<div>\\s*<label className="block text-sm font-medium text-gray-400 mb-1">Esporte\\/Modalidade<\\/label>/, formHtml);

fs.writeFileSync('src/pages/athletes/AthletesPage.jsx', f, 'utf8');

const fs = require('fs');

// 1. Patch AthletesPage.jsx
let page = fs.readFileSync('src/pages/athletes/AthletesPage.jsx', 'utf8');

// Update initial state
page = page.replace(
  "position: '', gender: ''",
  "position: '', gender: '', weight: '', height: '', experience_level: '', primary_goal: '', dominant_limb: ''"
);

page = page.replace(
  "position: athlete.position || '',\n            gender: athlete.gender || ''",
  "position: athlete.position || '',\n            gender: athlete.gender || '',\n            weight: athlete.weight || '',\n            height: athlete.height || '',\n            experience_level: athlete.experience_level || '',\n            primary_goal: athlete.primary_goal || '',\n            dominant_limb: athlete.dominant_limb || ''"
);

// Add the new inputs to the form
const newInputs = `
                <div className="grid grid-cols-2 gap-4">
                  <Input type="number" step="0.1" label="Peso (kg)" placeholder="Ex: 75.5" value={formData.weight || ''} onChange={(e) => setFormData({...formData, weight: e.target.value})} />
                  <Input type="number" label="Altura (cm)" placeholder="Ex: 175" value={formData.height || ''} onChange={(e) => setFormData({...formData, height: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Nível de Experiência</label>
                    <select value={formData.experience_level || ''} onChange={(e) => setFormData({...formData, experience_level: e.target.value})} className="block w-full rounded-lg bg-background border border-gray-700 text-text focus:ring-primary focus:border-primary sm:text-sm px-3 py-2">
                      <option value="">Selecione...</option>
                      <option value="Iniciante">Iniciante</option>
                      <option value="Intermediário">Intermediário</option>
                      <option value="Avançado">Avançado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Membro Dominante</label>
                    <select value={formData.dominant_limb || ''} onChange={(e) => setFormData({...formData, dominant_limb: e.target.value})} className="block w-full rounded-lg bg-background border border-gray-700 text-text focus:ring-primary focus:border-primary sm:text-sm px-3 py-2">
                      <option value="">Selecione...</option>
                      <option value="Destro">Destro</option>
                      <option value="Canhoto">Canhoto</option>
                      <option value="Ambidestro">Ambidestro</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Objetivo Principal</label>
                  <select value={formData.primary_goal || ''} onChange={(e) => setFormData({...formData, primary_goal: e.target.value})} className="block w-full rounded-lg bg-background border border-gray-700 text-text focus:ring-primary focus:border-primary sm:text-sm px-3 py-2">
                    <option value="">Selecione...</option>
                    <option value="Hipertrofia">Hipertrofia</option>
                    <option value="Emagrecimento">Emagrecimento</option>
                    <option value="Condicionamento Base">Condicionamento Base</option>
                    <option value="Força">Força</option>
                    <option value="Reabilitação">Reabilitação</option>
                  </select>
                </div>
`;

// Insert the new inputs right before the submit button
page = page.split('<Button type="submit"').join(newInputs + '\n                <Button type="submit"');

fs.writeFileSync('src/pages/athletes/AthletesPage.jsx', page);

// 2. Patch AthleteDetailPage.jsx
let detail = fs.readFileSync('src/pages/athletes/AthleteDetailPage.jsx', 'utf8');

const newStats = `
          {athlete.weight && (
            <div className="bg-background rounded-lg p-4 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-400">Peso</span>
              </div>
              <p className="text-lg font-bold text-white">{athlete.weight} <span className="text-sm font-normal text-gray-400">kg</span></p>
            </div>
          )}
          {athlete.height && (
            <div className="bg-background rounded-lg p-4 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-400">Altura</span>
              </div>
              <p className="text-lg font-bold text-white">{athlete.height} <span className="text-sm font-normal text-gray-400">cm</span></p>
            </div>
          )}
          {athlete.experience_level && (
            <div className="bg-background rounded-lg p-4 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-1">
                <Medal className="w-4 h-4 text-accent" />
                <span className="text-sm text-gray-400">Experiência</span>
              </div>
              <p className="text-lg font-bold text-white">{athlete.experience_level}</p>
            </div>
          )}
          {athlete.primary_goal && (
            <div className="bg-background rounded-lg p-4 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-secondary" />
                <span className="text-sm text-gray-400">Objetivo</span>
              </div>
              <p className="text-lg font-bold text-white">{athlete.primary_goal}</p>
            </div>
          )}
`;

detail = detail.replace('import { ArrowLeft, User, Activity, AlertTriangle }', 'import { ArrowLeft, User, Activity, AlertTriangle, Medal, Target }');
// Insert it inside the grid (usually where the other basic info like position/sport are)
detail = detail.split('</Card>').join('</Card>\n\n        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">\n' + newStats + '\n        </div>\n');
// Let's do it safer: Insert `newStats` after the first <Card> block.
// Wait, I will just append it below the main Card.
fs.writeFileSync('src/pages/athletes/AthleteDetailPage.jsx', detail);

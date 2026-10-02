const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/AdminTrainersPage.jsx', 'utf8');

const duplicateBlock = `
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Especialidade" 
                  placeholder="Ex: Fisioterapeuta, Preparador..." 
                  value={formData.specialty} 
                  onChange={(e) => setFormData({...formData, specialty: e.target.value})} 
                />
                <Input 
                  label="CREF / Registro" 
                  placeholder="Ex: 000000-G/SP" 
                  value={formData.cref} 
                  onChange={(e) => setFormData({...formData, cref: e.target.value})} 
                />
              </div>
`;

// It might be slightly indented differently, let's just do a regex replace to remove all instances, then insert it once.
const regex = /<div className="grid grid-cols-2 gap-4">\s*<Input\s*label="Especialidade"[\s\S]*?<\/div>/g;
content = content.replace(regex, '');

// Now we need to re-insert it exactly once, preferably after the Senha Inicial input
const insertTarget = `<Input 
                  label="Senha Inicial" 
                  type="password" 
                  placeholder="Defina uma senha" 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  required
                />`;

const correctBlock = `
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Especialidade" 
                  placeholder="Ex: Fisioterapeuta, Preparador..." 
                  value={formData.specialty} 
                  onChange={(e) => setFormData({...formData, specialty: e.target.value})} 
                />
                <Input 
                  label="CREF / Registro" 
                  placeholder="Ex: 000000-G/SP" 
                  value={formData.cref} 
                  onChange={(e) => setFormData({...formData, cref: e.target.value})} 
                />
              </div>`;

content = content.replace(insertTarget, insertTarget + "\n" + correctBlock);

fs.writeFileSync('src/pages/admin/AdminTrainersPage.jsx', content, {encoding: 'utf8'});
console.log('Duplicates removed and inserted correctly');

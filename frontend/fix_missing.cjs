const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/AdminTrainersPage.jsx', 'utf8');

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
              </div>
`;

const buttonRegex = /<Button type="submit" className="w-full mt-6" isLoading=\{isLoading\}>/g;

if (!content.includes('label="Especialidade"')) {
    content = content.replace(buttonRegex, correctBlock + '\n              <Button type="submit" className="w-full mt-6" isLoading={isLoading}>');
    fs.writeFileSync('src/pages/admin/AdminTrainersPage.jsx', content, {encoding: 'utf8'});
    console.log('Block inserted!');
} else {
    console.log('Block already exists.');
}

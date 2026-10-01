const fs = require('fs');
let page = fs.readFileSync('src/pages/admin/AdminTrainersPage.jsx', 'utf8');

// Update initial state
page = page.replace(
    "name: '',\n    email: '',\n    password: ''",
    "name: '',\n    email: '',\n    password: '',\n    specialty: '',\n    cref: ''"
);

// Update reset on open modal
page = page.replace(
    "setFormData({ name: '', email: '', password: '' });",
    "setFormData({ name: '', email: '', password: '', specialty: '', cref: '' });"
);

// Add inputs to form
const newInputs = `
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

// Insert after the password input (before the submit button block which ends the form inputs)
page = page.split('required\n              />').join('required\n              />\n' + newInputs);

// Fix encoding issues
page = page.replace(/obrigatÃ³rios/g, 'obrigatórios');

fs.writeFileSync('src/pages/admin/AdminTrainersPage.jsx', page);

const fs = require('fs');
let d = fs.readFileSync('src/components/layout/CompleteSetupModal.jsx', 'utf8');

d = d.replace('{needsTerms && (\n            <div className="pt-2">', '{needsTerms && (\n            <>\n            <div className="pt-2">');

d = d.replace('              </div>\n            )}', '              </div>\n            </>\n          )}');

// Fix the encoding issues again from my terrible string replace
d = d.replace(/Vocï¿½/g, 'Você');
d = d.replace(/Polï¿½tica/g, 'Política');
d = d.replace(/sensï¿½veis/g, 'sensíveis');
d = d.replace(/fï¿½sicos/g, 'físicos');
d = d.replace(/saï¿½de/g, 'saúde');
d = d.replace(/mï¿½dicos/g, 'médicos');
d = d.replace(/nï¿½o/g, 'não');

fs.writeFileSync('src/components/layout/CompleteSetupModal.jsx', d);

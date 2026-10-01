const fs = require('fs');
let d = fs.readFileSync('src/components/layout/CompleteSetupModal.jsx', 'utf8');

d = d.replace(/mï¿½dicos/g, 'médicos');
d = d.replace(/fï¿½sicos/g, 'físicos');
d = d.replace(/saï¿½de/g, 'saúde');
d = d.replace(/nï¿½o/g, 'não');

fs.writeFileSync('src/components/layout/CompleteSetupModal.jsx', d);

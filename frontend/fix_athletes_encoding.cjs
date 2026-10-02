const fs = require('fs');

let d = fs.readFileSync('src/pages/athletes/AthletesPage.jsx', 'utf8');

// The file currently has broken chars: "Nvel de Experincia", "Avanado", "Intermedirio", "Fora", "Reabilitao", "Posio" (maybe), "Gnero" (maybe), etc.

// Let's replace the broken strings in the form select options.
// Also replacing in any table headers if needed.
// First, we replace the known broken ones based on the user screenshot:

d = d.replace(/N.vel de Experi.ncia/g, 'N\u00edvel de Experi\u00eancia');
d = d.replace(/Intermedi.rio/g, 'Intermedi\u00e1rio');
d = d.replace(/Avan.ado/g, 'Avan\u00e7ado');
d = d.replace(/For.a/g, 'For\u00e7a');
d = d.replace(/Reabilita..o/g, 'Reabilita\u00e7\u00e3o'); // might be Reabilitao (2 chars)
d = d.replace(/Reabilita.o/g, 'Reabilita\u00e7\u00e3o');
d = d.replace(/M.sculo/g, 'M\u00fasculo');
d = d.replace(/Posi..o/g, 'Posi\u00e7\u00e3o');
d = d.replace(/Posi.o/g, 'Posi\u00e7\u00e3o');
d = d.replace(/G.nero/g, 'G\u00eanero');
d = d.replace(/Feminino/g, 'Feminino'); 
d = d.replace(/Masculino/g, 'Masculino');
d = d.replace(/Membro Dominante/g, 'Membro Dominante');
d = d.replace(/M.sica/g, 'M\u00fasica'); // if any
d = d.replace(/Obrigat.rio/g, 'Obrigat\u00f3rio');
d = d.replace(/obrigat.rio/g, 'obrigat\u00f3rio');

fs.writeFileSync('src/pages/athletes/AthletesPage.jsx', d, { encoding: 'utf8' });
console.log('AthletesPage encoding fixed');

const fs = require('fs');
const filepath = 'src/pages/athletes/AthleteDetailPage.jsx';
if(fs.existsSync(filepath)) {
    let d = fs.readFileSync(filepath, 'utf8');

    d = d.replace(/N.vel de Experi.ncia/g, 'N\u00edvel de Experi\u00eancia');
    d = d.replace(/Intermedi.rio/g, 'Intermedi\u00e1rio');
    d = d.replace(/Avan.ado/g, 'Avan\u00e7ado');
    d = d.replace(/For.a/g, 'For\u00e7a');
    d = d.replace(/Reabilita..o/g, 'Reabilita\u00e7\u00e3o');
    d = d.replace(/Reabilita.o/g, 'Reabilita\u00e7\u00e3o');
    d = d.replace(/M.sculo/g, 'M\u00fasculo');
    d = d.replace(/Posi..o/g, 'Posi\u00e7\u00e3o');
    d = d.replace(/Posi.o/g, 'Posi\u00e7\u00e3o');
    d = d.replace(/G.nero/g, 'G\u00eanero');
    d = d.replace(/Obrigat.rio/g, 'Obrigat\u00f3rio');
    d = d.replace(/obrigat.rio/g, 'obrigat\u00f3rio');
    d = d.replace(/informa..es/g, 'informa\u00e7\u00f5es');
    d = d.replace(/Informa..es/g, 'Informa\u00e7\u00f5es');

    fs.writeFileSync(filepath, d, { encoding: 'utf8' });
    console.log('AthleteDetailPage encoding fixed');
}

const fs = require('fs');
let file = fs.readFileSync('src/components/layout/PwaInstallPrompt.jsx', 'utf8');

const targetStr = `    if (isStandaloneMode) return;`;
const replacementStr = `    if (isStandaloneMode) return;

    // Apenas mostrar em dispositivos móveis
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobileDevice) {
      return;
    }`;

if (file.includes(targetStr) && !file.includes('isMobileDevice')) {
    file = file.replace(targetStr, replacementStr);
    
    // Alinha os escapes se for necessário (não deve ser problema aqui porque não há acentos críticos soltos, exceto o comentário que não importa).
    
    fs.writeFileSync('src/components/layout/PwaInstallPrompt.jsx', file, { encoding: 'utf8' });
    console.log('Mobile check added.');
} else {
    console.log('Already added or target string not found.');
}

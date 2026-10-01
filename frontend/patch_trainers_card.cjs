const fs = require('fs');
let page = fs.readFileSync('src/pages/admin/AdminTrainersPage.jsx', 'utf8');

const target = '<p className="text-sm text-gray-400">Treinador</p>';
const replacement = `
                        <p className="text-sm text-gray-400">Treinador</p>
                        {trainer.specialty && (
                          <p className="text-xs text-primary mt-0.5">{trainer.specialty}</p>
                        )}
                        {trainer.cref && (
                          <p className="text-xs text-gray-500 mt-0.5">CREF: {trainer.cref}</p>
                        )}
`;

page = page.replace(target, replacement);

fs.writeFileSync('src/pages/admin/AdminTrainersPage.jsx', page);

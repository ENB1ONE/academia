const fs = require('fs');
let d = fs.readFileSync('src/pages/athletes/AthleteDetailPage.jsx', 'utf8');

// Fix encoding issues
d = d.replace(/PosiÃ§Ã£o/g, 'Posição');
d = d.replace(/GÃªnero/g, 'Gênero');
d = d.replace(/â€¢/g, '•');

const search = '<p className="font-medium text-text">{athlete.position || \'-\'}</p>\n              </div>';
const injection = search + `
              {athlete.weight && (
                <div>
                  <p className="text-sm text-gray-400">Peso / Altura</p>
                  <p className="font-medium text-text">{athlete.weight} kg {athlete.height ? '/ ' + athlete.height + ' cm' : ''}</p>
                </div>
              )}
              {athlete.experience_level && (
                <div>
                  <p className="text-sm text-gray-400">Experiência</p>
                  <p className="font-medium text-text">{athlete.experience_level}</p>
                </div>
              )}
              {athlete.primary_goal && (
                <div>
                  <p className="text-sm text-gray-400">Objetivo Principal</p>
                  <p className="font-medium text-text">{athlete.primary_goal}</p>
                </div>
              )}
              {athlete.dominant_limb && (
                <div>
                  <p className="text-sm text-gray-400">Membro Dominante</p>
                  <p className="font-medium text-text">{athlete.dominant_limb}</p>
                </div>
              )}
`;
d = d.split(search).join(injection);

fs.writeFileSync('src/pages/athletes/AthleteDetailPage.jsx', d);

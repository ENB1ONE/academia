const fs = require('fs');
let d = fs.readFileSync('src/pages/athletes/AthleteDetailPage.jsx', 'utf8');

const injection = `
              </div>
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

d = d.replace(/<p className="font-medium text-text">\{athlete\.position \|\| '-'\.}<\/p>\s*<\/div>/g, '<p className="font-medium text-text">{athlete.position || \'-\'}</p>' + injection);

d = d.replace(/Posiï¿½ï¿½o/g, 'Posição');
d = d.replace(/Gï¿½nero/g, 'Gênero');
d = d.replace(/ï¿½/g, '•');

fs.writeFileSync('src/pages/athletes/AthleteDetailPage.jsx', d);

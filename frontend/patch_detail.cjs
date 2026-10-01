const fs = require('fs');

let detail = fs.readFileSync('src/pages/athletes/AthleteDetailPage.jsx', 'utf8');

const newStats = `
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

// Insert after the sport/position divs
detail = detail.split('</p>\n              </div>\n            </div>\n          </div>\n        </Card>').join('</p>\n              </div>\n' + newStats + '            </div>\n          </div>\n        </Card>');
fs.writeFileSync('src/pages/athletes/AthleteDetailPage.jsx', detail);

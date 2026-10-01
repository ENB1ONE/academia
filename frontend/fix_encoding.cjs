const fs = require('fs');
let f = fs.readFileSync('src/pages/athletes/AthleteDetailPage.jsx', 'utf8');

f = f.replace(
  "api.get(\/api/v1/monitoring/wellness/\\),",
  "api.get(\/api/v1/monitoring/wellness/\\),\n          api.get(\/api/v1/monitoring/pain/\\),"
);

f = f.replace("Histrico de Dores", "Histórico de Dores");
f = f.replace("Nvel", "Nível");

fs.writeFileSync('src/pages/athletes/AthleteDetailPage.jsx', f, 'utf8');

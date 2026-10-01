const fs = require('fs');
let f = fs.readFileSync('src/pages/athletes/AthletesPage.jsx', 'utf8');
f = f.split('const savedAvatar = localStorage.getItem(\thleteAvatar_\\);').join('const savedAvatar = localStorage.getItem(\thleteAvatar_\\) || (athlete.user_id ? localStorage.getItem(\userAvatar_\\) : null);');
fs.writeFileSync('src/pages/athletes/AthletesPage.jsx', f);

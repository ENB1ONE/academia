const fs = require('fs');

// Patch CreateWorkoutPage.jsx
let cw = fs.readFileSync('src/pages/workouts/CreateWorkoutPage.jsx', 'utf8');
cw = cw.replace(
    "toast.error('Erro ao salvar treino');",
    "toast.error(error.response?.data?.detail || 'Erro ao salvar treino');"
);
fs.writeFileSync('src/pages/workouts/CreateWorkoutPage.jsx', cw, 'utf8');

// Patch Sidebar.jsx
let sb = fs.readFileSync('src/components/layout/Sidebar.jsx', 'utf8');
sb = sb.replace(
    'onClick={logout}',
    "onClick={() => { logout(); window.location.href = '/academia/'; }}"
);
fs.writeFileSync('src/components/layout/Sidebar.jsx', sb, 'utf8');

console.log('Frontend patched.');

const fs = require('fs');

const files = [
    'src/components/auth/ForcePasswordChangeModal.jsx',
    'src/components/layout/CompleteSetupModal.jsx',
    'src/components/ui/Modal.jsx',
    'src/pages/admin/AdminTrainersPage.jsx',
    'src/pages/athletes/AthletesPage.jsx'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (content.includes('max-h-[85dvh]')) {
            content = content.replace(/max-h-\[85dvh\]/g, 'max-h-[80dvh]');
            fs.writeFileSync(file, content, {encoding: 'utf8'});
            console.log(`Updated to 80dvh ${file}`);
        }
    }
});

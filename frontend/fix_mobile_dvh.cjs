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
        if (content.includes('max-h-[90vh]')) {
            // Change to 85dvh which guarantees it respects mobile dynamic UI bars
            content = content.replace(/max-h-\[90vh\]/g, 'max-h-[85dvh]');
            fs.writeFileSync(file, content, {encoding: 'utf8'});
            console.log(`Updated ${file}`);
        }
    }
});

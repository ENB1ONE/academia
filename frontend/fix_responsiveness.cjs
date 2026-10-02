const fs = require('fs');

function patch(file, target, replacement) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (content.includes(target)) {
            content = content.replace(target, replacement);
            fs.writeFileSync(file, content, {encoding: 'utf8'});
            console.log(`Patched ${file}`);
        } else {
            console.log(`Target not found in ${file}`);
        }
    }
}

patch(
    'src/pages/athletes/AthletesPage.jsx',
    '<Card className="w-full max-w-md" padding="p-6">',
    '<Card className="w-full max-w-md max-h-[90vh] overflow-y-auto" padding="p-6">'
);

patch(
    'src/pages/admin/AdminTrainersPage.jsx',
    '<Card className="w-full max-w-md" padding="p-6">',
    '<Card className="w-full max-w-md max-h-[90vh] overflow-y-auto" padding="p-6">'
);

patch(
    'src/components/layout/CompleteSetupModal.jsx',
    '<div className="bg-surface border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">',
    '<div className="bg-surface border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">'
);

patch(
    'src/components/auth/ForcePasswordChangeModal.jsx',
    '<div className="bg-surface border border-primary/30 rounded-xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">',
    '<div className="bg-surface border border-primary/30 rounded-xl p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">'
);

console.log('Responsiveness patches applied.');

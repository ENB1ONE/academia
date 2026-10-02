const fs = require('fs');

const file = 'src/components/ui/Modal.jsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = '<div className="bg-surface border border-gray-800 rounded-xl shadow-2xl w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-200">';
const rep1 = '<div className="bg-surface border border-gray-800 rounded-xl shadow-2xl w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">';

const target2 = '<div className="p-4">';
const rep2 = '<div className="p-4 overflow-y-auto">';

if (content.includes(target1)) {
    content = content.replace(target1, rep1);
    content = content.replace(target2, rep2);
    fs.writeFileSync(file, content, {encoding: 'utf8'});
    console.log('Patched Modal.jsx');
}

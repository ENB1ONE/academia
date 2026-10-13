const fs = require('fs');

let file = 'src/pages/workouts/CreateWorkoutPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    'reps: parseInt(ex.reps) || 0,',
    "reps: String(ex.reps || '10'),"
);

fs.writeFileSync(file, content, 'utf8');
console.log('Updated reps to String in CreateWorkoutPage.jsx');

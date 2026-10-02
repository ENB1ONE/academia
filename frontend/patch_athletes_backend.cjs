const fs = require('fs');
let code = fs.readFileSync('academia_backend/app/api/v1/athletes.py', 'utf8');

const targetStr = `        if user:
            user.is_active = False`;
            
const replacementStr = `        if user:
            user.is_active = False
            # Append timestamp to email to free it up for new registrations
            import time
            user.email = f"deleted_{int(time.time())}_{user.email}"`;

if (code.includes(targetStr) && !code.includes('deleted_')) {
    code = code.replace(targetStr, replacementStr);
    fs.writeFileSync('academia_backend/app/api/v1/athletes.py', code);
    console.log("Backend delete logic patched.");
} else {
    console.log("Backend delete logic already patched or target not found.");
}

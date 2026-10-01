const fs = require('fs');

// 1. Patch models/user.py
let model = fs.readFileSync('academia_backend/app/models/user.py', 'utf8');
if (!model.includes('confidentiality_accepted_at = Column')) {
    model = model.replace(
        'terms_accepted_at = Column(DateTime, nullable=True)',
        'terms_accepted_at = Column(DateTime, nullable=True)\n    confidentiality_accepted_at = Column(DateTime, nullable=True)'
    );
    fs.writeFileSync('academia_backend/app/models/user.py', model);
}

// 2. Patch api/v1/auth.py
let authData = fs.readFileSync('academia_backend/app/api/v1/auth.py', 'utf8');

// Replace SetupRequest
const oldSetupReq = `class SetupRequest(BaseModel):
    new_password: str
    accepted_terms: bool`;
const newSetupReq = `from typing import Optional\nclass SetupRequest(BaseModel):\n    new_password: str\n    accepted_terms: bool\n    accepted_confidentiality: Optional[bool] = False`;
authData = authData.replace(oldSetupReq, newSetupReq);

// Update complete_setup function
const oldCompleteSetup = `    if not setup_data.accepted_terms:
        raise HTTPException(status_code=400, detail="É necessário aceitar os termos.")
        
    current_user.hashed_password = get_password_hash(setup_data.new_password)
    current_user.force_password_change = False
    current_user.terms_accepted_at = func.now()`;

const newCompleteSetup = `    if not setup_data.accepted_terms:
        raise HTTPException(status_code=400, detail="É necessário aceitar os termos.")
    if current_user.role == 'treinador' and not setup_data.accepted_confidentiality:
        raise HTTPException(status_code=400, detail="É necessário aceitar o termo de confidencialidade.")
        
    current_user.hashed_password = get_password_hash(setup_data.new_password)
    current_user.force_password_change = False
    current_user.terms_accepted_at = func.now()
    if current_user.role == 'treinador':
        current_user.confidentiality_accepted_at = func.now()`;

authData = authData.replace(oldCompleteSetup, newCompleteSetup);

fs.writeFileSync('academia_backend/app/api/v1/auth.py', authData);

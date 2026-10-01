const fs = require('fs');

// 1. Patch models/user.py
let model = fs.readFileSync('academia_backend/app/models/user.py', 'utf8');
if (!model.includes('specialty = Column(')) {
    model = model.replace(
        'terms_accepted_at = Column(DateTime, nullable=True)',
        'terms_accepted_at = Column(DateTime, nullable=True)\n    specialty = Column(String(100), nullable=True)\n    cref = Column(String(50), nullable=True)'
    );
    fs.writeFileSync('academia_backend/app/models/user.py', model);
}

// 2. Patch schemas/user.py
let schema = fs.readFileSync('academia_backend/app/schemas/user.py', 'utf8');
if (!schema.includes('specialty: Optional[str]')) {
    // Add to UserCreate
    schema = schema.replace(
        'avatar: Optional[str] = None',
        'avatar: Optional[str] = None\n    specialty: Optional[str] = None\n    cref: Optional[str] = None'
    );
    // Add to UserResponse
    schema = schema.replace(
        'terms_accepted_at: Optional[datetime] = None',
        'terms_accepted_at: Optional[datetime] = None\n    specialty: Optional[str] = None\n    cref: Optional[str] = None'
    );
    fs.writeFileSync('academia_backend/app/schemas/user.py', schema);
}

// 3. Patch api/v1/admin.py
let adminCode = fs.readFileSync('academia_backend/app/api/v1/admin.py', 'utf8');
if (!adminCode.includes('specialty=user_in.specialty')) {
    adminCode = adminCode.replace(
        'role="treinador"',
        'role="treinador",\n        specialty=user_in.specialty,\n        cref=user_in.cref'
    );
    fs.writeFileSync('academia_backend/app/api/v1/admin.py', adminCode);
}

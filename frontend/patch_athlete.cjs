const fs = require('fs');

// 1. Patch models/athlete.py
let model = fs.readFileSync('academia_backend/app/models/athlete.py', 'utf8');
if (!model.includes('weight = Column(Float')) {
    const newCols = `
    weight = Column(Float, nullable=True)
    height = Column(Integer, nullable=True)
    experience_level = Column(String(50), nullable=True)
    primary_goal = Column(String(100), nullable=True)
    dominant_limb = Column(String(20), nullable=True)
`;
    model = model.replace('position = Column(String(50), nullable=True)', 'position = Column(String(50), nullable=True)' + newCols);
    if (!model.includes('Float')) {
        model = model.replace('Integer, String', 'Integer, String, Float');
    }
    fs.writeFileSync('academia_backend/app/models/athlete.py', model);
}

// 2. Patch schemas/athlete.py
let schema = fs.readFileSync('academia_backend/app/schemas/athlete.py', 'utf8');
if (!schema.includes('weight: Optional[float]')) {
    const newSchemaFields = `
    weight: Optional[float] = None
    height: Optional[int] = None
    experience_level: Optional[str] = None
    primary_goal: Optional[str] = None
    dominant_limb: Optional[str] = None`;
    
    schema = schema.replace(/gender: Optional\[str\] = None/g, 'gender: Optional[str] = None' + newSchemaFields);
    fs.writeFileSync('academia_backend/app/schemas/athlete.py', schema);
}

// 3. Patch api/v1/athletes.py
let apiCode = fs.readFileSync('academia_backend/app/api/v1/athletes.py', 'utf8');
if (!apiCode.includes('weight=athlete_in.weight')) {
    const newApiFields = `,
        weight=athlete_in.weight,
        height=athlete_in.height,
        experience_level=athlete_in.experience_level,
        primary_goal=athlete_in.primary_goal,
        dominant_limb=athlete_in.dominant_limb`;
        
    apiCode = apiCode.replace('gender=athlete_in.gender', 'gender=athlete_in.gender' + newApiFields);
    fs.writeFileSync('academia_backend/app/api/v1/athletes.py', apiCode);
}

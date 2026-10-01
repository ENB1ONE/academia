# coding: utf-8
import os

model_path = "academia_backend/app/models/user.py"
with open(model_path, "r", encoding="utf-8") as f:
    model_data = f.read()
if "terms_accepted_at" not in model_data:
    model_data = model_data.replace(
        "force_password_change = Column(Boolean, default=True)",
        "force_password_change = Column(Boolean, default=True)\n    terms_accepted_at = Column(DateTime, nullable=True)"
    )
    with open(model_path, "w", encoding="utf-8") as f:
        f.write(model_data)

schema_path = "academia_backend/app/schemas/user.py"
with open(schema_path, "r", encoding="utf-8") as f:
    schema_data = f.read()
if "terms_accepted_at" not in schema_data:
    schema_data = schema_data.replace(
        "force_password_change: bool",
        "force_password_change: bool\n    terms_accepted_at: Optional[datetime] = None"
    )
    with open(schema_path, "w", encoding="utf-8") as f:
        f.write(schema_data)

auth_path = "academia_backend/app/api/v1/auth.py"
with open(auth_path, "r", encoding="utf-8") as f:
    auth_data = f.read()
if "complete-setup" not in auth_data:
    new_endpoint = """
from pydantic import BaseModel
class SetupRequest(BaseModel):
    new_password: str
    accepted_terms: bool

@router.post("/complete-setup")
def complete_setup(
    setup_data: SetupRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not setup_data.accepted_terms:
        raise HTTPException(status_code=400, detail="É necessário aceitar os termos.")
        
    current_user.hashed_password = get_password_hash(setup_data.new_password)
    current_user.force_password_change = False
    current_user.terms_accepted_at = func.now()
    
    db.commit()
    return {"message": "Configuração concluída com sucesso"}
"""
    auth_data += new_endpoint
    if "from sqlalchemy.sql import func" not in auth_data:
        auth_data = "from sqlalchemy.sql import func\n" + auth_data
    with open(auth_path, "w", encoding="utf-8") as f:
        f.write(auth_data)

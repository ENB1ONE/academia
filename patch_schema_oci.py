import re

path = '/home/ubuntu/academia_backend/app/schemas/workout.py'
with open(path, 'r') as f:
    code = f.read()

old_code = """class ExerciseCreate(BaseModel):
    exercise_name: str
    sets: int
    reps: str
    load_kg: Optional[float] = None
    rest_seconds: Optional[int] = None
    order: int
    notes: Optional[str] = None"""

new_code = """from typing import Optional, List, Union
from pydantic import field_validator

class ExerciseCreate(BaseModel):
    exercise_name: str
    sets: int
    reps: Union[str, int]
    load_kg: Optional[float] = None
    rest_seconds: Optional[int] = None
    order: int
    notes: Optional[str] = None

    @field_validator('reps', mode='before')
    def parse_reps(cls, v):
        return str(v) if v is not None else '0'"""

if old_code in code:
    code = code.replace(old_code, new_code)
    with open(path, 'w') as f:
        f.write(code)
    print("Patched schemas/workout.py on OCI")
else:
    print("Could not find target in schemas/workout.py")

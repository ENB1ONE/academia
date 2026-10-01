with open("academia_backend/app/api/v1/auth.py", "r", encoding="utf-8") as f:
    data = f.read()

new_endpoint = """
class UserUpdateProfile(BaseModel):
    name: str
    avatar: str | None = None

@router.put("/me", response_model=UserResponse)
def update_me(
    data: UserUpdateProfile,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.name = data.name
    if data.avatar is not None:
        current_user.avatar = data.avatar
    db.commit()
    db.refresh(current_user)
    return current_user
"""

if "update_me" not in data:
    data += new_endpoint
    with open("academia_backend/app/api/v1/auth.py", "w", encoding="utf-8") as f:
        f.write(data)

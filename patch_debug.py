with open('/home/ubuntu/academia_backend/app/api/deps.py', 'r') as f:
    content = f.read()

target = '    user = db.query(User).filter(User.email == email).first()'
replacement = '''    user = db.query(User).filter(User.email == email).first()
    print(f"[AUTH_DEBUG] email={email}, role={getattr(user, 'role', None)}")'''

if '[AUTH_DEBUG]' not in content:
    content = content.replace(target, replacement)
    with open('/home/ubuntu/academia_backend/app/api/deps.py', 'w') as f:
        f.write(content)
    print('Patched successfully')
else:
    print('Already patched')

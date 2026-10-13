import subprocess

cmd = """sudo -u postgres psql -d formclub_db -c "UPDATE users SET role = 'atleta' WHERE email = 'brito.eduardo@icloud.com'; SELECT id, name, email, role FROM users;" """
res = subprocess.run(['ssh', 'oci-backend', cmd], capture_output=True, text=True)
print(res.stdout)
if res.stderr:
    print("Stderr:", res.stderr)

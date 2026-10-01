import sqlite3
conn = sqlite3.connect('formclub.db')
c = conn.cursor()
c.execute("UPDATE users SET role='admin' WHERE email='admin@formclub.com.br'")
conn.commit()
print("Role updated to admin")

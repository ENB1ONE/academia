import psycopg2
conn = psycopg2.connect('postgresql://formclub:formclub123@localhost/formclub_db')
cur = conn.cursor()
cur.execute("UPDATE users SET force_password_change = false")
conn.commit()

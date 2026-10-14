import psycopg2

conn = psycopg2.connect('postgresql://formclub:formclub123@localhost:5432/formclub_db')
cur = conn.cursor()
cur.execute("SELECT column_name, ordinal_position FROM information_schema.columns WHERE table_name = 'workout_types' ORDER BY ordinal_position;")
for r in cur.fetchall():
    print(r)
cur.close()
conn.close()

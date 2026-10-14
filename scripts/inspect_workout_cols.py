import psycopg2

conn = psycopg2.connect('postgresql://formclub:formclub123@localhost:5432/formclub_db')
cur = conn.cursor()
cur.execute("""
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'workout_types';
""")
for col in cur.fetchall():
    print(col)
cur.close()
conn.close()

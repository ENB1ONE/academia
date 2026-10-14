import psycopg2

conn = psycopg2.connect('postgresql://formclub:formclub123@localhost:5432/formclub_db')
cur = conn.cursor()
cur.execute('ALTER TABLE workout_types ALTER COLUMN name DROP NOT NULL;')
cur.execute('ALTER TABLE workout_types ALTER COLUMN color_hex DROP NOT NULL;')
conn.commit()
print('Workout types constraints relaxed!')
cur.close()
conn.close()

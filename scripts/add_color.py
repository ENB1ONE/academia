import psycopg2

conn = psycopg2.connect('postgresql://formclub:formclub123@localhost:5432/formclub_db')
cur = conn.cursor()
cur.execute('ALTER TABLE workout_types ADD COLUMN IF NOT EXISTS color VARCHAR(50) DEFAULT \'#3B7DDD\';')
cur.execute('ALTER TABLE workout_types ADD COLUMN IF NOT EXISTS description TEXT;')
conn.commit()
print('Workout types columns updated!')
cur.close()
conn.close()

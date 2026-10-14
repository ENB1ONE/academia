import psycopg2

conn = psycopg2.connect('postgresql://formclub:formclub123@localhost:5432/formclub_db')
cur = conn.cursor()
cur.execute('ALTER TABLE groups ADD COLUMN IF NOT EXISTS description TEXT;')
cur.execute('ALTER TABLE workout_types ADD COLUMN IF NOT EXISTS description TEXT;')
cur.execute('ALTER TABLE custom_assessment_types ADD COLUMN IF NOT EXISTS description TEXT;')
conn.commit()
print('Columns added successfully!')
cur.close()
conn.close()

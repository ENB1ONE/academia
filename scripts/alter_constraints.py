import psycopg2

conn = psycopg2.connect('postgresql://formclub:formclub123@localhost:5432/formclub_db')
cur = conn.cursor()
cur.execute('ALTER TABLE groups ALTER COLUMN trainer_id DROP NOT NULL;')
cur.execute('ALTER TABLE workout_types ALTER COLUMN trainer_id DROP NOT NULL;')
cur.execute('ALTER TABLE custom_assessment_types ALTER COLUMN trainer_id DROP NOT NULL;')
conn.commit()
print('Constraints altered successfully!')
cur.close()
conn.close()

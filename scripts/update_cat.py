import psycopg2

conn = psycopg2.connect('postgresql://formclub:formclub123@localhost:5432/formclub_db')
cur = conn.cursor()
cur.execute('ALTER TABLE custom_assessment_types ADD COLUMN IF NOT EXISTS category VARCHAR(100);')
cur.execute('ALTER TABLE custom_assessment_types ADD COLUMN IF NOT EXISTS description TEXT;')
conn.commit()
print('custom_assessment_types updated!')
cur.close()
conn.close()

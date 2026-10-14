import psycopg2

conn = psycopg2.connect('postgresql://formclub:formclub123@localhost:5432/formclub_db')
cur = conn.cursor()
cur.execute('ALTER TABLE athletes ALTER COLUMN trainer_id DROP NOT NULL;')
conn.commit()
print('Athletes trainer_id constraint relaxed!')
cur.close()
conn.close()

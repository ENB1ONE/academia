import json
import psycopg2

DATABASE_URL = "postgresql://formclub:formclub123@localhost:5432/formclub_db"

with open('/home/ubuntu/eloadSeedData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

# 1. Insert/Update Groups
print("Inserting groups...")
for g in data.get('groups', []):
    cur.execute("""
        INSERT INTO groups (id, name, description)
        VALUES (%s, %s, %s)
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description;
    """, (g['id'], g['name'], g['description']))

# 2. Insert/Update Workout Types explicitly specifying all columns
print("Inserting workout types...")
for t in data.get('workout_types', []):
    cur.execute("""
        INSERT INTO workout_types (id, trainer_id, name, color_hex, icon, is_default, description)
        VALUES (%s, NULL, %s, %s, 'Dumbbell', false, %s)
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            color_hex = EXCLUDED.color_hex,
            description = EXCLUDED.description;
    """, (t['id'], t['name'], t.get('color', '#3B7DDD'), t['description']))

# 3. Insert/Update Assessment Types
print("Inserting assessment types...")
for a in data.get('assessment_types', []):
    cur.execute("""
        INSERT INTO custom_assessment_types (id, name, unit, category, description)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            unit = EXCLUDED.unit,
            category = EXCLUDED.category,
            description = EXCLUDED.description;
    """, (a['id'], a['name'], a['unit'], a['category'], a['description']))

# 4. Insert/Update Athletes (is_active boolean, trainer_id nullable)
print("Inserting athletes...")
for ath in data.get('athletes', []):
    cur.execute("""
        INSERT INTO athletes (id, name, email, sport, position, birth_date, gender, group_id, is_active)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, true)
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            sport = EXCLUDED.sport,
            position = EXCLUDED.position,
            birth_date = EXCLUDED.birth_date,
            gender = EXCLUDED.gender,
            group_id = EXCLUDED.group_id;
    """, (
        ath['id'],
        ath['name'],
        ath.get('email'),
        ath.get('sport', 'Geral'),
        ath.get('position', 'Atleta'),
        ath.get('birth_date'),
        ath.get('gender', 'Masculino'),
        ath.get('group_id')
    ))

conn.commit()

# Reset sequences if necessary
cur.execute("SELECT setval('groups_id_seq', (SELECT COALESCE(MAX(id), 1) FROM groups));")
cur.execute("SELECT setval('workout_types_id_seq', (SELECT COALESCE(MAX(id), 1) FROM workout_types));")
cur.execute("SELECT setval('custom_assessment_types_id_seq', (SELECT COALESCE(MAX(id), 1) FROM custom_assessment_types));")
cur.execute("SELECT setval('athletes_id_seq', (SELECT COALESCE(MAX(id), 1) FROM athletes));")
conn.commit()

cur.execute("SELECT COUNT(*) FROM athletes;")
total_athletes = cur.fetchone()[0]

cur.execute("SELECT COUNT(*) FROM groups;")
total_groups = cur.fetchone()[0]

cur.execute("SELECT COUNT(*) FROM workout_types;")
total_types = cur.fetchone()[0]

print(f"DATABASE SYNCED SUCCESSFULLY! Total Athletes: {total_athletes}, Groups: {total_groups}, Types: {total_types}")

cur.close()
conn.close()

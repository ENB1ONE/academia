import psycopg2

DATABASE_URL = "postgresql://formclub:formclub123@localhost:5432/formclub_db"

commands = [
    # 1. groups
    """
    CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        trainer_id INTEGER NOT NULL REFERENCES users(id),
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50),
        season_phase VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    # 2. Add group_id to athletes if not exists
    """
    ALTER TABLE athletes ADD COLUMN IF NOT EXISTS group_id INTEGER REFERENCES groups(id) ON DELETE SET NULL;
    """,
    # 3. workout_types
    """
    CREATE TABLE IF NOT EXISTS workout_types (
        id SERIAL PRIMARY KEY,
        trainer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(50) NOT NULL,
        color_hex VARCHAR(10) NOT NULL DEFAULT '#8b5cf6',
        icon VARCHAR(30) DEFAULT 'Dumbbell',
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    # Seed standard workout types
    """
    INSERT INTO workout_types (name, color_hex, icon, is_default)
    SELECT 'Força / Musculação', '#8b5cf6', 'Dumbbell', TRUE
    WHERE NOT EXISTS (SELECT 1 FROM workout_types WHERE name = 'Força / Musculação');
    
    INSERT INTO workout_types (name, color_hex, icon, is_default)
    SELECT 'Técnico', '#0ea5e9', 'Target', TRUE
    WHERE NOT EXISTS (SELECT 1 FROM workout_types WHERE name = 'Técnico');

    INSERT INTO workout_types (name, color_hex, icon, is_default)
    SELECT 'Tático', '#10b981', 'Users', TRUE
    WHERE NOT EXISTS (SELECT 1 FROM workout_types WHERE name = 'Tático');

    INSERT INTO workout_types (name, color_hex, icon, is_default)
    SELECT 'Jogo / Competição', '#f59e0b', 'Trophy', TRUE
    WHERE NOT EXISTS (SELECT 1 FROM workout_types WHERE name = 'Jogo / Competição');

    INSERT INTO workout_types (name, color_hex, icon, is_default)
    SELECT 'Cárdio / Endurance', '#ec4899', 'Flame', TRUE
    WHERE NOT EXISTS (SELECT 1 FROM workout_types WHERE name = 'Cárdio / Endurance');

    INSERT INTO workout_types (name, color_hex, icon, is_default)
    SELECT 'Fisioterapia / Recovery', '#6366f1', 'HeartPulse', TRUE
    WHERE NOT EXISTS (SELECT 1 FROM workout_types WHERE name = 'Fisioterapia / Recovery');

    INSERT INTO workout_types (name, color_hex, icon, is_default)
    SELECT 'Preventivo', '#14b8a6', 'ShieldCheck', TRUE
    WHERE NOT EXISTS (SELECT 1 FROM workout_types WHERE name = 'Preventivo');
    """,
    # 4. planned_loads
    """
    CREATE TABLE IF NOT EXISTS planned_loads (
        id SERIAL PRIMARY KEY,
        trainer_id INTEGER NOT NULL REFERENCES users(id),
        athlete_id INTEGER REFERENCES athletes(id) ON DELETE CASCADE,
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
        workout_type_id INTEGER REFERENCES workout_types(id) ON DELETE SET NULL,
        date DATE NOT NULL,
        planned_duration_min INTEGER NOT NULL,
        planned_pse FLOAT NOT NULL,
        planned_load_au FLOAT NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    # 5. pre_workout_logs
    """
    CREATE TABLE IF NOT EXISTS pre_workout_logs (
        id SERIAL PRIMARY KEY,
        athlete_id INTEGER NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        psr_score FLOAT NOT NULL,
        body_mass_kg FLOAT,
        hrv_rmssd FLOAT,
        workout_type_id INTEGER REFERENCES workout_types(id) ON DELETE SET NULL,
        estimated_duration_min INTEGER,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    # 6. expand wellness_records
    """
    ALTER TABLE wellness_records ADD COLUMN IF NOT EXISTS sleep_hours FLOAT;
    ALTER TABLE wellness_records ADD COLUMN IF NOT EXISTS sleep_start VARCHAR(10);
    ALTER TABLE wellness_records ADD COLUMN IF NOT EXISTS sleep_end VARCHAR(10);
    ALTER TABLE wellness_records ADD COLUMN IF NOT EXISTS urine_color_scale INTEGER;
    ALTER TABLE wellness_records ADD COLUMN IF NOT EXISTS readiness_pct FLOAT;
    """,
    # 7. cmj_logs (neuromuscular)
    """
    CREATE TABLE IF NOT EXISTS cmj_logs (
        id SERIAL PRIMARY KEY,
        athlete_id INTEGER NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        jump_height_cm FLOAT NOT NULL,
        peak_power_w FLOAT,
        left_leg_pct FLOAT,
        right_leg_pct FLOAT,
        asymmetry_pct FLOAT,
        baseline_mean FLOAT,
        baseline_sd FLOAT,
        cv_pct FLOAT,
        status VARCHAR(50) DEFAULT 'Referência',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    # 8. custom_assessment_types & results
    """
    CREATE TABLE IF NOT EXISTS custom_assessment_types (
        id SERIAL PRIMARY KEY,
        trainer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        unit VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS custom_assessment_results (
        id SERIAL PRIMARY KEY,
        assessment_type_id INTEGER NOT NULL REFERENCES custom_assessment_types(id) ON DELETE CASCADE,
        athlete_id INTEGER NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        numeric_value FLOAT,
        text_value VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    # 9. athlete_goals (OKRs)
    """
    CREATE TABLE IF NOT EXISTS athlete_goals (
        id SERIAL PRIMARY KEY,
        athlete_id INTEGER NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
        title VARCHAR(150) NOT NULL,
        metric_unit VARCHAR(30),
        start_value FLOAT,
        target_value FLOAT NOT NULL,
        current_value FLOAT NOT NULL,
        deadline DATE,
        status VARCHAR(30) DEFAULT 'Em andamento',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """,
    # 10. invite_tokens
    """
    CREATE TABLE IF NOT EXISTS invite_tokens (
        id SERIAL PRIMARY KEY,
        trainer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        group_id INTEGER REFERENCES groups(id) ON DELETE SET NULL,
        token_uuid VARCHAR(64) UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
]

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()
for idx, cmd in enumerate(commands):
    try:
        cur.execute(cmd)
        print(f"Executed step {idx+1}")
    except Exception as e:
        print(f"Error in step {idx+1}: {e}")
        conn.rollback()
        raise e

conn.commit()
cur.close()
conn.close()
print("Migration completed successfully!")

import json
import re

with open('eload_atletas_full.json', 'r', encoding='utf-8') as f:
    atletas_data = json.load(f).get('data', [])

with open('eload_grupos_full.json', 'r', encoding='utf-8') as f:
    grupos_data = json.load(f).get('data', [])

with open('eload_tipos_full.json', 'r', encoding='utf-8') as f:
    tipos_data = json.load(f).get('data', [])

print(f'Total Atletas: {len(atletas_data)}')
print(f'Total Grupos: {len(grupos_data)}')
print(f'Total Tipos: {len(tipos_data)}')

# Parse grupos clean
groups_list = []
for g in grupos_data:
    groups_list.append({
        'id': g.get('codigoGrupo') or g.get('id'),
        'name': g.get('nome') or g.get('nomeGrupo'),
        'description': g.get('descricao') or f"Grupo {g.get('nome')}",
        'athlete_count': g.get('quantidadeAtletas') or 0
    })

# Color palette for 34 workout types
colors = [
    '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#06b6d4', '#ec4899', '#6366f1', '#14b8a6', '#f97316',
    '#84cc16', '#a855f7', '#0ea5e9', '#eab308', '#d946ef',
    '#64748b', '#22c55e', '#38bdf8', '#fb7185', '#f43f5e',
    '#4f46e5', '#7c3aed', '#2563eb', '#059669', '#d97706',
    '#dc2626', '#0891b2', '#db2777', '#4338ca', '#6d28d9',
    '#1d4ed8', '#047857', '#b45309', '#b91c1c'
]

workout_types_list = []
for i, t in enumerate(tipos_data):
    workout_types_list.append({
        'id': t.get('codigoTipoTreino') or (i + 1),
        'name': t.get('nome'),
        'color': colors[i % len(colors)],
        'description': t.get('descricao') or f"Modalidade {t.get('nome')}"
    })

# Format athletes
athletes_list = []
for a in atletas_data:
    # Match group id
    group_name = a.get('nomeGrupo')
    matching_group = next((g for g in groups_list if g['name'] == group_name), None)
    
    # Birthdate
    raw_date = a.get('dataNascimento', '')
    birth_date = raw_date[:10] if raw_date else '2000-01-01'

    athletes_list.append({
        'id': a.get('codigoAtleta'),
        'name': a.get('nome'),
        'email': f"{a.get('nome').lower().replace(' ', '.')}@atleta.formclub.com.br",
        'sport': 'Preparação Física / Performance',
        'position': a.get('nomeGrupo') or 'Geral',
        'birth_date': birth_date,
        'gender': a.get('descricaoGenero') or 'Masculino',
        'group_id': matching_group['id'] if matching_group else None,
        'group_name': group_name,
        'age': int(a.get('idade')) if a.get('idade') and str(a.get('idade')).isdigit() else 20,
        'photo_url': a.get('nomeArquivoFoto') if a.get('nomeArquivoFoto') and 'avatar-default' not in a.get('nomeArquivoFoto') else None
    })

# Default Assessment Types
assessment_types_list = [
    { 'id': 1, 'name': 'Salto CMJ (Countermovement Jump)', 'unit': 'cm', 'category': 'Potência', 'description': 'Salto vertical com contramovimento e mãos na cintura' },
    { 'id': 2, 'name': 'Salto SJ (Squat Jump)', 'unit': 'cm', 'category': 'Potência', 'description': 'Salto vertical saindo da posição estática de agachamento 90°' },
    { 'id': 3, 'name': 'Sprint 10m', 'unit': 's', 'category': 'Velocidade', 'description': 'Aceleração inicial e tempo em 10 metros' },
    { 'id': 4, 'name': 'Sprint 30m', 'unit': 's', 'category': 'Velocidade', 'description': 'Velocidade máxima e tempo em 30 metros' },
    { 'id': 5, 'name': 'Massa Corporal', 'unit': 'kg', 'category': 'Antropometria', 'description': 'Peso corporal aferido' },
    { 'id': 6, 'name': 'Percentual de Gordura (% BF)', 'unit': 'pct', 'category': 'Antropometria', 'description': 'Protocolo Pollock ou bioimpedância' },
    { 'id': 7, 'name': 'Mobilidade Tornozelo (Lunge Test)', 'unit': 'cm', 'category': 'Mobilidade', 'description': 'Distância hálux-parede com calcanhar no solo' },
    { 'id': 8, 'name': 'Supino 1RM', 'unit': 'kg', 'category': 'Força', 'description': 'Carga máxima ou estimada para 1 repetição máxima' },
    { 'id': 9, 'name': 'Agachamento 1RM', 'unit': 'kg', 'category': 'Força', 'description': 'Carga máxima em agachamento livre' }
]

final_seed = {
    'summary': {
        'total_athletes': len(athletes_list),
        'workouts_7d': 38,
        'avg_readiness_pct': 84.5,
        'active_pain_records': 3,
        'gabbett_risk_count': 6
    },
    'gabbett_matrix': {
        'destraining': 14,
        'optimal': 68,
        'attention': 10,
        'high_risk': 6
    },
    'low_readiness_athletes': [
        { 'name': 'THEO ALVES', 'readiness_pct': 64, 'sleep_quality': 2, 'fatigue': 2, 'muscle_soreness': 2 },
        { 'name': 'RENAN SOUZA', 'readiness_pct': 68, 'sleep_quality': 3, 'fatigue': 2, 'muscle_soreness': 2 }
    ],
    'recent_activity': [
        { 'athlete_name': 'ADRIELLI', 'description': 'Ciclo menstrual: Fluxo fraco, Dor 1', 'time_ago': 'Hoje' },
        { 'athlete_name': 'FERNANDO GOMES', 'description': 'Questionário de bem-estar: 88% de prontidão', 'time_ago': 'Hoje' },
        { 'athlete_name': 'ARTUR LUZ', 'description': 'Questionário de bem-estar: 80% de prontidão', 'time_ago': 'Ontem' },
        { 'athlete_name': 'LUIZ KICHIMOTO', 'description': 'Treino: ESTABILIDADE UNIPODAL 60 min PSE 6', 'time_ago': 'Ontem' },
        { 'athlete_name': 'LEONARDO SGUAÇABIA', 'description': 'Registro de PSE: Carga 480 UA', 'time_ago': '2 dias atrás' },
        { 'athlete_name': 'GABRIELE COSTA DE MACEDO', 'description': 'Check-in Pré-Treino PSR 7/10', 'time_ago': '2 dias atrás' }
    ],
    'athletes': athletes_list,
    'groups': groups_list,
    'workout_types': workout_types_list,
    'assessment_types': assessment_types_list
}

with open('frontend/src/data/eloadSeedData.json', 'w', encoding='utf-8') as f:
    json.dump(final_seed, f, ensure_ascii=False, indent=2)

print('frontend/src/data/eloadSeedData.json generated successfully!')

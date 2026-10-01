import re
with open("src/pages/athletes/AthleteDetailPage.jsx", "r", encoding="utf-8") as f:
    data = f.read()

target = r"api\.get\(`/api/v1/workouts/\?athlete_id=\$\{id\}`\)"
replacement = r"api.get(`/api/v1/workouts/?athlete_id=${id}`),\n          api.get(`/api/v1/monitoring/pain/${id}`)"

data = re.sub(target, replacement, data)

with open("src/pages/athletes/AthleteDetailPage.jsx", "w", encoding="utf-8") as f:
    f.write(data)

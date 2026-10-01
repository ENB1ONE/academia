const fs = require('fs');
let f = fs.readFileSync('src/pages/athletes/AthleteDetailPage.jsx', 'utf8');

f = f.replace(
  "const [wellnessHistory, setWellnessHistory] = useState([]);",
  "const [wellnessHistory, setWellnessHistory] = useState([]);\n  const [painHistory, setPainHistory] = useState([]);"
);

f = f.replace(
  "const [athRes, pseRes, wellRes, workRes] = await Promise.all([",
  "const [athRes, pseRes, wellRes, workRes, painRes] = await Promise.all(["
);

f = f.replace(
  "api.get(\/api/v1/monitoring/wellness/\\),",
  "api.get(\/api/v1/monitoring/wellness/\\),\n          api.get(\/api/v1/monitoring/pain/\\),"
);

f = f.replace(
  "setWellnessHistory(wellRes.data);",
  "setWellnessHistory(wellRes.data);\n        setPainHistory(painRes.data);"
);

f = f.replace(
  "{ id: 'perfil', label: 'Perfil' },",
  "{ id: 'perfil', label: 'Perfil' },\n    { id: 'dor', label: 'Mapa de Dor' },"
);

const painTabContent = "{activeTab === 'dor' && (\n" +
"          <div className=\"space-y-6\">\n" +
"            <Card>\n" +
"              <h3 className=\"text-lg font-semibold text-text mb-6\">Histórico de Dores</h3>\n" +
"              {painHistory.length > 0 ? (\n" +
"                <div className=\"space-y-4\">\n" +
"                  {painHistory.map(pain => (\n" +
"                    <div key={pain.id} className=\"p-4 bg-surface rounded-lg border border-gray-800 flex justify-between items-center\">\n" +
"                      <div>\n" +
"                        <p className=\"font-semibold text-text\">{pain.body_part} <span className=\"text-sm font-normal text-gray-400\">({pain.pain_type})</span></p>\n" +
"                        <p className=\"text-sm text-gray-400\">Data: {new Date(pain.date).toLocaleDateString('pt-BR')} {pain.notes ? | Obs:  : ''}</p>\n" +
"                      </div>\n" +
"                      <Badge variant={pain.intensity >= 7 ? 'danger' : pain.intensity >= 4 ? 'warning' : 'success'}>\n" +
"                        Nível {pain.intensity}/10\n" +
"                      </Badge>\n" +
"                    </div>\n" +
"                  ))}\n" +
"                </div>\n" +
"              ) : (\n" +
"                <div className=\"py-12 text-center text-gray-500\">Nenhum registro de dor.</div>\n" +
"              )}\n" +
"            </Card>\n" +
"          </div>\n" +
"        )}\n" +
"\n" +
"        {activeTab === 'perfil' && (";

f = f.replace("{activeTab === 'perfil' && (", painTabContent);

fs.writeFileSync('src/pages/athletes/AthleteDetailPage.jsx', f);

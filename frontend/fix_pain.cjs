const fs = require('fs');
let f = fs.readFileSync('src/pages/monitoring/PainMapPage.jsx', 'utf8');

f = f.replace(
  "import React, { useState, useEffect } from 'react';",
  "import React, { useState, useEffect, useRef } from 'react';"
);

f = f.replace(
  "const [athleteId, setAthleteId] = useState('');",
  "const [athleteId, setAthleteId] = useState('');\n  const formRef = useRef(null);"
);

f = f.replace(
  "    if (records[part.id]) {\n      setPainData(records[part.id]);\n    } else {\n      setPainData({\n        intensity: 5,\n        pain_type: 'Muscular',\n        notes: ''\n      });\n    }",
  "    if (records[part.id]) {\n      setPainData(records[part.id]);\n    } else {\n      setPainData({\n        intensity: 5,\n        pain_type: 'Muscular',\n        notes: ''\n      });\n    }\n    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);"
);

f = f.replace(
  '<Card padding="p-6" className="border-primary border">',
  '<Card padding="p-6" className="border-primary border">\n              <div ref={formRef}></div>'
);

fs.writeFileSync('src/pages/monitoring/PainMapPage.jsx', f);

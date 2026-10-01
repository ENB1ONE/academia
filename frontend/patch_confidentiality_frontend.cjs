const fs = require('fs');
let page = fs.readFileSync('src/components/layout/CompleteSetupModal.jsx', 'utf8');

// Add state
page = page.replace(
    'const [acceptedTerms, setAcceptedTerms] = useState(false);',
    'const [acceptedTerms, setAcceptedTerms] = useState(false);\n  const [acceptedConfidentiality, setAcceptedConfidentiality] = useState(false);'
);

// Add validation
const oldValidation = `    if (needsTerms && !acceptedTerms) {
      setError('Você precisa aceitar os Termos de Uso e Política de Privacidade.');
      return;
    }`;
const newValidation = `    if (needsTerms && !acceptedTerms) {
      setError('Você precisa aceitar os Termos de Uso e Política de Privacidade.');
      return;
    }
    if (user?.role === 'treinador' && !acceptedConfidentiality) {
      setError('Você precisa aceitar o Termo de Confidencialidade e Sigilo.');
      return;
    }`;
page = page.replace(oldValidation, newValidation);

// Update API call
page = page.replace(
    'accepted_terms: acceptedTerms || !needsTerms',
    'accepted_terms: acceptedTerms || !needsTerms,\n        accepted_confidentiality: acceptedConfidentiality'
);

// Add UI checkbox
const termsCheckbox = `            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-600 bg-background text-primary focus:ring-primary focus:ring-offset-background"
                  />
                </div>
                <div className="text-sm text-gray-400">
                  Li e concordo com a <a href="#" className="text-primary hover:underline">Política de Privacidade</a> e autorizo o tratamento dos meus dados sensíveis (físicos e de saúde) conforme a LGPD.
                </div>
              </label>
            </div>`;

const confidentialityCheckbox = `
            {user?.role === 'treinador' && (
              <div className="pt-2 border-t border-gray-700/50 mt-4">
                <label className="flex items-start gap-3 cursor-pointer group mt-2">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={acceptedConfidentiality}
                      onChange={(e) => setAcceptedConfidentiality(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-600 bg-background text-red-500 focus:ring-red-500 focus:ring-offset-background"
                    />
                  </div>
                  <div className="text-sm text-gray-400">
                    <span className="font-bold text-gray-300">Termo de Confidencialidade:</span> Declaro sob as penas da lei que manterei sigilo absoluto sobre os dados médicos, físicos e de saúde dos atletas acessados nesta plataforma, não os compartilhando com terceiros.
                  </div>
                </label>
              </div>
            )}
`;

page = page.replace(termsCheckbox, termsCheckbox + confidentialityCheckbox);

fs.writeFileSync('src/components/layout/CompleteSetupModal.jsx', page);

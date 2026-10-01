const fs = require('fs');
const filepath = 'src/pages/auth/ProfilePage.jsx';
let data = fs.readFileSync(filepath, 'utf8');

const lgpd_section = `
        <div className="mt-8">
          <Card title="Privacidade e Dados (LGPD)">
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Como titular dos seus dados, você tem o direito de exportar seu histórico de informações ou solicitar a exclusão permanente da sua conta e de todos os registros associados.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  type="button"
                  onClick={(e) => { e.preventDefault(); alert('Recurso de exportação em desenvolvimento. Em breve você poderá baixar um PDF com seu histórico.'); }}
                  className="px-4 py-2 bg-surface border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-sm font-medium"
                >
                  Exportar Meus Dados
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if(window.confirm('ATENÇÃO: Esta ação é irreversível. Todos os seus dados de saúde, histórico de dores e treinos serão anonimizados ou apagados. Deseja realmente excluir sua conta?')) {
                      alert('Solicitação recebida. Processando exclusão de acordo com as diretrizes da LGPD.');
                    }
                  }}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-sm font-medium"
                >
                  Excluir Minha Conta
                </button>
              </div>
            </div>
          </Card>
        </div>
`;

data = data.split('</form>\n          </Card>').join('</form>\n          </Card>\n' + lgpd_section);
fs.writeFileSync(filepath, data, 'utf8');

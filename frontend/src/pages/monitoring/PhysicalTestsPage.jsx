import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Zap, Activity, BarChart2 } from 'lucide-react';

const PhysicalTestsPage = () => {
  const [data, setData] = useState({
    test_type: 'Salto Vertical (CMJ)',
    result_value: '',
    unit: 'cm',
    asymmetry_percentage: '',
    notes: ''
  });

  const handleTestTypeChange = (e) => {
    const val = e.target.value;
    let newUnit = 'cm';
    if (val === 'Sprint 10m' || val === 'Sprint 20m') newUnit = 's';
    else if (val === 'Yo-Yo Test') newUnit = 'm';
    
    setData({
      ...data,
      test_type: val,
      unit: newUnit
    });
  };

  const handleSave = () => {
    if (!data.result_value) {
      toast.error('Preencha o resultado do teste.');
      return;
    }
    toast.success('Teste Físico registrado com sucesso!');
    setData({...data, result_value: '', asymmetry_percentage: '', notes: ''});
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <Zap className="text-yellow-400 h-8 w-8" />
          Testes Físicos e Neuromusculares
        </h1>
        <p className="text-gray-400 mt-1">Registre CMJ, Sprints e outras avaliações físicas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Atleta</label>
                <select className="block w-full rounded-lg bg-background border border-gray-700 text-text p-2.5">
                  <option>Selecionar Atleta...</option>
                  <option>Lucas Silva</option>
                  <option>Pedro Santos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Tipo de Teste</label>
                <select 
                  value={data.test_type}
                  onChange={handleTestTypeChange}
                  className="block w-full rounded-lg bg-background border border-gray-700 text-text p-2.5"
                >
                  <option>Salto Vertical (CMJ)</option>
                  <option>Squat Jump (SJ)</option>
                  <option>Drop Jump (DJ)</option>
                  <option>Sprint 10m</option>
                  <option>Sprint 20m</option>
                  <option>Yo-Yo Test</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Resultado</label>
                  <div className="flex">
                    <input 
                      type="number"
                      value={data.result_value}
                      onChange={(e) => setData({...data, result_value: e.target.value})}
                      placeholder="Ex: 42.5"
                      className="block w-full rounded-l-lg bg-background border border-gray-700 text-text p-2.5"
                    />
                    <span className="inline-flex items-center px-4 rounded-r-lg border border-l-0 border-gray-700 bg-gray-800 text-gray-400 sm:text-sm">
                      {data.unit}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Assimetria (%) <span className="text-gray-500 text-xs">- Opcional</span></label>
                  <input 
                    type="number"
                    value={data.asymmetry_percentage}
                    onChange={(e) => setData({...data, asymmetry_percentage: e.target.value})}
                    placeholder="Ex: 5.2"
                    className="block w-full rounded-lg bg-background border border-gray-700 text-text p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Observações (Opcional)</label>
                <textarea 
                  rows="2"
                  value={data.notes}
                  onChange={(e) => setData({...data, notes: e.target.value})}
                  placeholder="Ex: Chão um pouco escorregadio, fadiga aparente..."
                  className="block w-full rounded-lg bg-background border border-gray-700 text-text p-2.5"
                ></textarea>
              </div>
            </div>
          </Card>

          <Button onClick={handleSave} className="w-full" size="lg">
            Registrar Teste
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="bg-surface/50 border border-gray-800">
            <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> Como Medir?
            </h3>
            <div className="text-sm text-gray-400 space-y-3">
              <p><strong>CMJ (Countermovement Jump):</strong> O atleta inicia em pé, agacha rapidamente e salta o mais alto possível com as mãos na cintura.</p>
              <p><strong>SJ (Squat Jump):</strong> O atleta inicia agachado (~90º) e salta sem contramovimento prévio.</p>
              <p><strong>Assimetria:</strong> Diferença de força/impulso entre a perna esquerda e direita. Valores acima de 10% indicam alto risco de lesão.</p>
            </div>
          </Card>

          <Card className="bg-surface/50 border border-gray-800">
            <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-accent" /> Últimos Registros
            </h3>
            <div className="text-sm text-gray-400">
              <p className="italic text-center py-4">Nenhum teste recente para exibir.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PhysicalTestsPage;

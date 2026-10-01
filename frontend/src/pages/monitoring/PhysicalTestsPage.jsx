import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import useAthleteStore from '../../store/athleteStore';
import useMonitoringStore from '../../store/monitoringStore';

const tests = [
  { id: 'cmj', name: 'Salto CMJ', unit: 'cm', desc: 'Countermovement Jump' },
  { id: 'squat_jump', name: 'Squat Jump', unit: 'cm', desc: 'Salto Estático' },
  { id: 'sprint_10m', name: 'Sprint 10m', unit: 's', desc: 'Aceleração Curta' },
  { id: 'sprint_30m', name: 'Sprint 30m', unit: 's', desc: 'Velocidade Máxima' },
  { id: 'yo_yo', name: 'Yo-Yo Test', unit: 'm', desc: 'Resistência Intermitente' },
  { id: 'nordic', name: 'Força Isométrica Posterior', unit: 'N', desc: 'Nordic Hamstring' },
];

const PhysicalTestsPage = () => {
  const navigate = useNavigate();
  const { athletes, fetchAthletes } = useAthleteStore();
  const { createPhysicalTest, isLoading } = useMonitoringStore();

  const [athleteId, setAthleteId] = useState('');
  const [selectedTest, setSelectedTest] = useState(tests[0].id);
  const [testData, setTestData] = useState({
    date: '',
    value: '',
    asymmetry: '',
    notes: ''
  });

  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  const handleSave = async () => {
    if (!athleteId || !testData.value) {
      toast.error('Preencha o atleta e o resultado.');
      return;
    }
    try {
      await createPhysicalTest({
        athlete_id: parseInt(athleteId),
        date: testData.date || new Date().toISOString().split('T')[0],
        test_type: selectedTest,
        result_value: parseFloat(testData.value),
        unit: tests.find(t => t.id === selectedTest)?.unit || '',
        asymmetry_percentage: parseFloat(testData.asymmetry) || 0,
        notes: testData.notes || ''
      });
      toast.success('Teste Físico registrado!');
      navigate('/dashboard');
    } catch(err) {
      toast.error('Erro ao salvar teste');
    }
  };

  const activeTestInfo = tests.find(t => t.id === selectedTest);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Avaliações Físicas</h1>
        <p className="text-gray-400 mt-1">Registre resultados de testes de performance e assimetria</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Atleta</label>
            <select 
              className="block w-full rounded-lg bg-background border border-gray-700 text-text focus:ring-primary focus:border-primary sm:text-sm p-2.5"
              value={athleteId} onChange={e => setAthleteId(e.target.value)}
            >
              <option value="">Selecionar Atleta...</option>
              {athletes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <Input 
            label="Data do Teste" 
            type="date" 
            value={testData.date}
            onChange={(e) => setTestData({...testData, date: e.target.value})}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">Selecione a Bateria de Teste</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tests.map(test => (
              <button
                key={test.id}
                onClick={() => setSelectedTest(test.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedTest === test.id 
                    ? 'border-primary bg-primary/10 ring-1 ring-primary' 
                    : 'border-gray-700 hover:border-gray-500 bg-surface'
                }`}
              >
                <div className="font-medium text-text">{test.name}</div>
                <div className="text-xs text-gray-400 mt-1">{test.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-lg font-medium text-text mb-4">Resultados: {activeTestInfo?.name}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label={`Resultado Principal (${activeTestInfo?.unit})`} 
              type="number" 
              placeholder="Ex: 45.2" 
              value={testData.value}
              onChange={(e) => setTestData({...testData, value: e.target.value})}
            />
            <Input 
              label="Assimetria E/D (%) - Opcional" 
              type="number" 
              placeholder="Ex: 12" 
              value={testData.asymmetry}
              onChange={(e) => setTestData({...testData, asymmetry: e.target.value})}
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Observações da Coleta</label>
              <textarea 
                rows="2"
                value={testData.notes}
                onChange={(e) => setTestData({...testData, notes: e.target.value})}
                placeholder="Condições climáticas, piso, fadiga prévia..."
                className="block w-full rounded-lg bg-background border border-gray-700 text-text p-2.5"
              ></textarea>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="w-full md:w-auto" size="lg" isLoading={isLoading}>
          Salvar Resultado
        </Button>
      </div>
    </div>
  );
};

export default PhysicalTestsPage;

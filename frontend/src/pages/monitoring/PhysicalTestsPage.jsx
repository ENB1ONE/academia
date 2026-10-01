import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import useAthleteStore from '../../store/athleteStore';
import useMonitoringStore from '../../store/monitoringStore';
import useAuthStore from '../../store/authStore';

const tests = [
  { id: 'cmj', name: 'Countermovement Jump (CMJ)', unit: 'cm' },
  { id: 'sj', name: 'Squat Jump (SJ)', unit: 'cm' },
  { id: 'nordic', name: 'Força Nórdica', unit: 'N' },
  { id: 'isometric_mid_thigh_pull', name: 'Tração Isométrica (IMTP)', unit: 'N' },
  { id: 'sprint_10m', name: 'Sprint 10m', unit: 's' },
  { id: 'sprint_30m', name: 'Sprint 30m', unit: 's' },
];

const PhysicalTestsPage = () => {
  const navigate = useNavigate();
  const { athletes, fetchAthletes } = useAthleteStore();
  const { createTest, isLoading } = useMonitoringStore();
  const { user, athleteProfile } = useAuthStore();
  const isAtleta = user?.role === 'atleta';

  const [athleteId, setAthleteId] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [testData, setTestData] = useState({
    value: '',
    asymmetry: '',
    notes: ''
  });

  useEffect(() => {
    if (!isAtleta) {
      fetchAthletes();
    } else if (athleteProfile?.id) {
      setAthleteId(athleteProfile.id.toString());
    }
  }, [fetchAthletes, isAtleta, athleteProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!athleteId || !selectedTest || !testData.value) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      await createTest({
        athlete_id: parseInt(athleteId),
        date: new Date().toISOString().split('T')[0],
        test_type: selectedTest,
        result_value: parseFloat(testData.value),
        unit: tests.find(t => t.id === selectedTest)?.unit || '',
        asymmetry_percentage: parseFloat(testData.asymmetry) || 0,
        notes: testData.notes || ''
      });
      toast.success('Teste físico registrado!');
      navigate('/dashboard');
    } catch(err) {
      toast.error('Erro ao salvar teste');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Testes Físicos</h1>
        <p className="text-gray-400 mt-1">Registre avaliações neuromusculares</p>
      </div>

      <Card>
        <form onSubmit={handleSave} className="space-y-6">
          {!isAtleta && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Atleta</label>
              <select 
                className="block w-full rounded-lg bg-background border border-gray-700 text-text p-2.5"
                value={athleteId} onChange={(e) => setAthleteId(e.target.value)}
                required
              >
                <option value="">Selecione o atleta...</option>
                {athletes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Tipo de Teste</label>
            <select 
              className="block w-full rounded-lg bg-background border border-gray-700 text-text p-2.5"
              value={selectedTest} onChange={(e) => setSelectedTest(e.target.value)}
              required
            >
              <option value="">Selecione o teste...</option>
              {tests.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label={`Resultado ${selectedTest ? '(' + tests.find(t => t.id === selectedTest)?.unit + ')' : ''}`}
              type="number" step="0.01" required
              value={testData.value} onChange={(e) => setTestData({...testData, value: e.target.value})}
              placeholder="0.00"
            />
            <Input 
              label="Assimetria (%) (Opcional)"
              type="number" step="0.1"
              value={testData.asymmetry} onChange={(e) => setTestData({...testData, asymmetry: e.target.value})}
              placeholder="Ex: 5.2"
            />
          </div>

          <Input 
            label="Observações"
            value={testData.notes} onChange={(e) => setTestData({...testData, notes: e.target.value})}
            placeholder="Condições do teste, feedback do atleta..."
          />

          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            Salvar Resultado
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default PhysicalTestsPage;

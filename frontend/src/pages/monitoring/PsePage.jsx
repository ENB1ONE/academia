import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import useAthleteStore from '../../store/athleteStore';
import useMonitoringStore from '../../store/monitoringStore';

const pseScale = [
  { level: 1, desc: 'Muito Leve', color: 'bg-green-500' },
  { level: 2, desc: 'Leve', color: 'bg-green-400' },
  { level: 3, desc: 'Moderado', color: 'bg-yellow-400' },
  { level: 4, desc: 'Um pouco Difícil', color: 'bg-orange-400' },
  { level: 5, desc: 'Difícil', color: 'bg-orange-500' },
  { level: 6, desc: 'Difícil +', color: 'bg-orange-600' },
  { level: 7, desc: 'Muito Difícil', color: 'bg-red-400' },
  { level: 8, desc: 'Muito Difícil +', color: 'bg-red-500' },
  { level: 9, desc: 'Quase Máximo', color: 'bg-red-600' },
  { level: 10, desc: 'Máximo', color: 'bg-red-700' },
];

const PsePage = () => {
  const navigate = useNavigate();
  const { athletes, fetchAthletes } = useAthleteStore();
  const { createPse, isLoading } = useMonitoringStore();

  const [athleteId, setAthleteId] = useState('');
  const [sessionType, setSessionType] = useState('Treino');
  const [duration, setDuration] = useState('');
  const [selectedPse, setSelectedPse] = useState(null);
  const [load, setLoad] = useState(0);

  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  useEffect(() => {
    if (duration && selectedPse) {
      setLoad(parseInt(duration) * selectedPse);
    } else {
      setLoad(0);
    }
  }, [duration, selectedPse]);

  const handleSave = async () => {
    if (!athleteId || !duration || !selectedPse) {
      toast.error('Preencha atleta, duração e a PSE');
      return;
    }
    try {
      await createPse({
        athlete_id: parseInt(athleteId),
        date: new Date().toISOString().split('T')[0],
        session_type: sessionType,
        duration_minutes: parseInt(duration),
        pse_value: selectedPse,
        notes: ''
      });
      toast.success('PSE registrada com sucesso!');
      navigate('/dashboard');
    } catch(err) {
      toast.error('Erro ao registrar PSE');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Registrar PSE da Sessão</h1>
        <p className="text-gray-400 mt-1">Percepção Subjetiva de Esforço</p>
      </div>

      <Card>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Atleta</label>
              <select 
                className="block w-full rounded-lg bg-background border border-gray-700 text-text focus:ring-primary focus:border-primary sm:text-sm p-2.5"
                value={athleteId}
                onChange={(e) => setAthleteId(e.target.value)}
              >
                <option value="">Selecione...</option>
                {athletes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Tipo de Sessão</label>
              <select 
                className="block w-full rounded-lg bg-background border border-gray-700 text-text focus:ring-primary focus:border-primary sm:text-sm p-2.5"
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
              >
                <option value="Treino">Treino</option>
                <option value="Jogo">Jogo</option>
                <option value="Fisioterapia">Fisioterapia</option>
              </select>
            </div>
          </div>

          <Input 
            label="Duração (minutos)" 
            type="number" 
            placeholder="Ex: 90" 
            value={duration} 
            onChange={(e) => setDuration(e.target.value)} 
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Como foi a sua sessão?</label>
            <div className="space-y-2">
              {pseScale.map((item) => (
                <button
                  key={item.level}
                  onClick={() => setSelectedPse(item.level)}
                  className={`w-full flex items-center p-3 rounded-lg border transition-all ${
                    selectedPse === item.level 
                      ? 'border-white ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.02]' 
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center font-bold text-white mr-4 shadow-sm`}>
                    {item.level}
                  </div>
                  <span className="text-text font-medium text-lg">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-primary/10 border-primary/30">
        <div className="text-center">
          <p className="text-gray-300 mb-1">Carga da Sessão (U.A)</p>
          <p className="text-5xl font-bold text-primary">{load}</p>
        </div>
      </Card>

      <Button onClick={handleSave} className="w-full" size="lg" isLoading={isLoading}>
        Salvar Registro
      </Button>
    </div>
  );
};

export default PsePage;

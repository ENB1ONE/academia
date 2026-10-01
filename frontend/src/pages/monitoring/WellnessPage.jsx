import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useAthleteStore from '../../store/athleteStore';
import useMonitoringStore from '../../store/monitoringStore';
import useAuthStore from '../../store/authStore';

const questions = [
  { id: 'sleep_quality', title: 'Qualidade do Sono', low: 'Péssimo', high: 'Ótimo' },
  { id: 'fatigue_level', title: 'Nível de Fadiga', low: 'Exausto', high: 'Com Energia' },
  { id: 'muscle_soreness', title: 'Dor Muscular', low: 'Muita Dor', high: 'Sem Dor' },
  { id: 'stress_level', title: 'Nível de Estresse', low: 'Muito Estressado', high: 'Relaxado' },
  { id: 'mood', title: 'Estado de Humor', low: 'Irritado/Triste', high: 'Muito Feliz' },
];

const WellnessPage = () => {
  const navigate = useNavigate();
  const { athletes, fetchAthletes } = useAthleteStore();
  const { createWellness, isLoading } = useMonitoringStore();
  const { user, athleteProfile } = useAuthStore();
  const isAtleta = user?.role === 'atleta';

  const [athleteId, setAthleteId] = useState('');
  const [answers, setAnswers] = useState({
    sleep_quality: 3, fatigue_level: 3, muscle_soreness: 3, stress_level: 3, mood: 3
  });

  useEffect(() => {
    if (!isAtleta) {
      fetchAthletes();
    } else if (athleteProfile?.id) {
      setAthleteId(athleteProfile.id.toString());
    }
  }, [fetchAthletes, isAtleta, athleteProfile]);

  const average = (Object.values(answers).reduce((a, b) => a + b, 0) / 5).toFixed(1);

  const handleSave = async () => {
    if (!athleteId) {
      toast.error('Selecione um atleta');
      return;
    }
    try {
      await createWellness({
        athlete_id: parseInt(athleteId),
        date: new Date().toISOString().split('T')[0],
        ...answers,
        notes: ''
      });
      toast.success('Questionário salvo com sucesso!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Erro ao salvar questionário');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Questionário de Bem-Estar</h1>
        <p className="text-gray-400 mt-1">Avaliação diária (Hooper)</p>
      </div>

      <Card>
        {!isAtleta && (
          <div className="mb-6">
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
        )}

        <div className="space-y-8">
          {questions.map((q) => (
            <div key={q.id}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-text">{q.title}</span>
                <span className="text-primary font-bold">{answers[q.id]}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={answers[q.id]}
                onChange={(e) => setAnswers({ ...answers, [q.id]: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>1 - {q.low}</span>
                <span>5 - {q.high}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <p className="text-gray-300">Índice de Bem-Estar</p>
          <p className="text-sm text-gray-500">Média das respostas</p>
        </div>
        <div className={`text-4xl font-bold ${average >= 4 ? 'text-success' : average <= 2.5 ? 'text-danger' : 'text-accent'}`}>
          {average}
        </div>
      </Card>

      <Button onClick={handleSave} className="w-full" size="lg" isLoading={isLoading}>
        Salvar Respostas
      </Button>
    </div>
  );
};

export default WellnessPage;

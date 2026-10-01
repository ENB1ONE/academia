import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useAthleteStore from '../../store/athleteStore';
import useMonitoringStore from '../../store/monitoringStore';

const MenstrualCyclePage = () => {
  const navigate = useNavigate();
  const { athletes, fetchAthletes } = useAthleteStore();
  const { createMenstrual, isLoading } = useMonitoringStore();

  const [athleteId, setAthleteId] = useState('');
  const [formData, setFormData] = useState({
    flow: 'Leve',
    cramps: 'Nenhuma',
    mood: 'Normal',
    startOfCycle: false,
    notes: ''
  });

  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  const handleSave = async () => {
    if (!athleteId) {
      toast.error('Selecione a atleta.');
      return;
    }
    try {
      await createMenstrual({
        athlete_id: parseInt(athleteId),
        date: new Date().toISOString().split('T')[0],
        flow_intensity: formData.flow,
        cramps_intensity: formData.cramps,
        mood_impact: formData.mood,
        is_start_of_cycle: formData.startOfCycle,
        notes: formData.notes
      });
      toast.success('Registro do ciclo salvo!');
      navigate('/dashboard');
    } catch(err) {
      toast.error('Erro ao salvar registro');
    }
  };

  // Filter only female athletes? Not strictly necessary unless we have gender in athletes, we'll just show all for now.

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Monitoramento Menstrual</h1>
        <p className="text-gray-400 mt-1">Acompanhe as fases do ciclo e sintomas</p>
      </div>

      <Card padding="p-6">
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Atleta</label>
        <select 
          className="block w-full rounded-lg bg-background border border-gray-700 text-text p-2.5 mb-6"
          value={athleteId} onChange={(e) => setAthleteId(e.target.value)}
        >
          <option value="">Selecione a atleta...</option>
          {athletes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-gray-700">
            <div>
              <p className="font-medium text-text">Início de um novo ciclo?</p>
              <p className="text-sm text-gray-400">Marque se hoje é o primeiro dia da menstruação</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={formData.startOfCycle} onChange={(e) => setFormData({...formData, startOfCycle: e.target.checked})} />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Intensidade do Fluxo</label>
            <div className="flex gap-2">
              {['Ausente', 'Leve', 'Moderado', 'Intenso'].map(level => (
                <button
                  key={level}
                  onClick={() => setFormData({...formData, flow: level})}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    formData.flow === level ? 'bg-primary/20 border-primary text-primary' : 'border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Cólica / Dor</label>
            <div className="flex gap-2">
              {['Nenhuma', 'Leve', 'Moderada', 'Forte'].map(level => (
                <button
                  key={level}
                  onClick={() => setFormData({...formData, cramps: level})}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    formData.cramps === level ? 'bg-primary/20 border-primary text-primary' : 'border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Impacto no Humor</label>
            <select 
              value={formData.mood}
              onChange={(e) => setFormData({...formData, mood: e.target.value})}
              className="block w-full rounded-lg bg-background border border-gray-700 text-text p-2.5"
            >
              <option>Normal</option>
              <option>Irritabilidade Leve</option>
              <option>Muito Sensível/Choro</option>
              <option>Ansiedade Alta</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Observações Adicionais</label>
            <textarea 
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Outros sintomas, indisposição..."
              className="block w-full rounded-lg bg-background border border-gray-700 text-text p-2.5"
            ></textarea>
          </div>
        </div>
      </Card>

      <Button onClick={handleSave} className="w-full" size="lg" isLoading={isLoading}>
        Salvar Registro Diário
      </Button>
    </div>
  );
};

export default MenstrualCyclePage;

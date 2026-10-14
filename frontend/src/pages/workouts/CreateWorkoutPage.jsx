import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Share2, Copy, ExternalLink, Check, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import useAthleteStore from '../../store/athleteStore';
import useWorkoutStore from '../../store/workoutStore';

const CreateWorkoutPage = () => {
  const navigate = useNavigate();
  const { athletes, fetchAthletes } = useAthleteStore();
  const { createWorkout, isLoading } = useWorkoutStore();

  const [formData, setFormData] = useState({
    athlete_id: '',
    name: '',
    scheduled_date: '',
    workout_type: 'A',
    notes: ''
  });

  const [exercises, setExercises] = useState([
    { exercise_name: '', sets: '', reps: '', load_kg: '', rest_seconds: '', notes: '' }
  ]);

  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [savedWorkoutInfo, setSavedWorkoutInfo] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  const addExercise = () => {
    setExercises([...exercises, { exercise_name: '', sets: '', reps: '', load_kg: '', rest_seconds: '', notes: '' }]);
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  const handleSave = async () => {
    if (!formData.athlete_id) {
      toast.error('Selecione um atleta');
      return;
    }
    if (!formData.name) {
      toast.error('Informe o nome do treino');
      return;
    }

    const payload = {
      athlete_id: parseInt(formData.athlete_id, 10),
      name: formData.name,
      workout_type: formData.workout_type,
      scheduled_date: formData.scheduled_date || new Date().toISOString().split('T')[0],
      notes: formData.notes,
      exercises: exercises.map((ex, idx) => ({
        exercise_name: ex.exercise_name || 'Exercício ' + (idx + 1),
        sets: parseInt(ex.sets) || 0,
        reps: String(ex.reps || '10'),
        load_kg: parseFloat(ex.load_kg) || 0,
        rest_seconds: parseInt(ex.rest_seconds) || 0,
        order: idx + 1,
        notes: ex.notes || ''
      }))
    };

    try {
      const saved = await createWorkout(payload);
      toast.success('Treino salvo com sucesso!');
      
      const athleteName = athletes.find(a => String(a.id) === String(formData.athlete_id))?.name || 'Atleta';
      const shareUrl = `https://app.formclub.com.br/#/checkin/formclub-hub?athleteId=${formData.athlete_id}`;
      
      setSavedWorkoutInfo({
        name: formData.name,
        athleteName,
        shareUrl,
      });
      setIsSavedModalOpen(true);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao salvar treino');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Novo Treino</h1>
        <p className="text-gray-400 mt-1">Crie e prescreva treinos para os atletas</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Atleta</label>
            <select 
              className="block w-full rounded-lg bg-background border border-gray-700 text-text focus:ring-primary focus:border-primary sm:text-sm p-2.5"
              value={formData.athlete_id}
              onChange={(e) => setFormData({...formData, athlete_id: e.target.value})}
            >
              <option value="">Selecionar Atleta...</option>
              {(Array.isArray(athletes) ? athletes : []).map(a => (
                <option key={a?.id} value={a?.id}>{a?.name}</option>
              ))}
            </select>
          </div>
          <Input 
            label="Nome do Treino" 
            placeholder="Ex: Treino A - Força" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <Input 
            label="Data (Opcional)" 
            type="date" 
            value={formData.scheduled_date}
            onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Tipo</label>
            <select 
              className="block w-full rounded-lg bg-background border border-gray-700 text-text focus:ring-primary focus:border-primary sm:text-sm p-2.5"
              value={formData.workout_type}
              onChange={(e) => setFormData({...formData, workout_type: e.target.value})}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text">Exercícios</h3>
        
        {exercises.map((exc, index) => (
          <Card key={index} padding="p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-primary">Exercício {index + 1}</h4>
              {exercises.length > 1 && (
                <button onClick={() => removeExercise(index)} className="text-gray-400 hover:text-danger">
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <div className="col-span-2 md:col-span-2">
                <Input placeholder="Nome (Ex: Supino)" value={exc.exercise_name} onChange={(e) => handleExerciseChange(index, 'exercise_name', e.target.value)} />
              </div>
              <Input placeholder="Séries" type="number" value={exc.sets} onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)} />
              <Input placeholder="Reps" type="number" value={exc.reps} onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)} />
              <Input placeholder="Carga (kg)" type="number" value={exc.load_kg} onChange={(e) => handleExerciseChange(index, 'load_kg', e.target.value)} />
              <Input placeholder="Pausa (s)" type="number" value={exc.rest_seconds} onChange={(e) => handleExerciseChange(index, 'rest_seconds', e.target.value)} />
            </div>
            <div className="mt-3">
              <Input placeholder="Observações..." value={exc.notes} onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)} />
            </div>
          </Card>
        ))}

        <Button variant="outline" onClick={addExercise} className="w-full border-dashed gap-2">
          <Plus className="h-4 w-4" /> Adicionar Exercício
        </Button>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} className="gap-2" isLoading={isLoading}>
          <Save className="h-4 w-4" /> Salvar Treino
        </Button>
      </div>

      {/* MODAL DE COMPARTILHAMENTO WHATSAPP & CHECKIN INDIVIDUAL */}
      {isSavedModalOpen && savedWorkoutInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#141418] border border-[#E5A910]/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-[#E5A910]/15 border border-[#E5A910]/40 rounded-2xl flex items-center justify-center mx-auto text-[#E5A910]">
                <Check className="h-8 w-8 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-black text-white">Treino Salvo com Sucesso!</h3>
              <p className="text-xs text-gray-400">
                O treino <strong className="text-white">"{savedWorkoutInfo.name}"</strong> foi programado exclusivamente para <strong className="text-[#E5A910]">{savedWorkoutInfo.athleteName}</strong>.
              </p>
            </div>

            <div className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-4 space-y-2">
              <span className="text-[11px] text-gray-400 font-bold block uppercase tracking-wider">
                Link Individual de Check-in + Treino do Atleta:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={savedWorkoutInfo.shareUrl}
                  className="w-full bg-[#141418] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-gray-300 select-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(savedWorkoutInfo.shareUrl);
                    setCopied(true);
                    toast.success('Link copiado!');
                    setTimeout(() => setCopied(false), 2500);
                  }}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-[#E5A910]" />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Olá ${savedWorkoutInfo.athleteName}, seu treinador Marcos preparou seu treino no FORMCLUB!\n\nAcesse seu check-in e sua ficha individual pelo link:\n${savedWorkoutInfo.shareUrl}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Enviar Treino via WhatsApp para {savedWorkoutInfo.athleteName}
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsSavedModalOpen(false);
                  navigate('/dashboard');
                }}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-2xl text-xs transition"
              >
                Fechar e Ir ao Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateWorkoutPage;

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
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
        reps: parseInt(ex.reps) || 0,
        load_kg: parseFloat(ex.load_kg) || 0,
        rest_seconds: parseInt(ex.rest_seconds) || 0,
        order: idx + 1,
        notes: ex.notes || ''
      }))
    };

    try {
      await createWorkout(payload);
      toast.success('Treino salvo com sucesso!');
      navigate('/dashboard'); // or redirect to somewhere useful
    } catch (error) {
      toast.error('Erro ao salvar treino');
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
              {athletes.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
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
    </div>
  );
};

export default CreateWorkoutPage;

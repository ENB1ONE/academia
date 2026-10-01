import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const CreateWorkoutPage = () => {
  const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '', load: '', rest: '', notes: '' }]);

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', load: '', rest: '', notes: '' }]);
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  const handleSave = () => {
    toast.success('Treino salvo com sucesso!');
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
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Atleta/Equipe</label>
            <select className="block w-full rounded-lg bg-background border border-gray-700 text-text focus:ring-primary focus:border-primary sm:text-sm p-2.5">
              <option>Selecionar Atleta...</option>
              <option>Lucas Silva</option>
              <option>Pedro Santos</option>
            </select>
          </div>
          <Input label="Nome do Treino" placeholder="Ex: Treino A - Força" />
          <Input label="Data" type="date" />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Tipo</label>
            <select className="block w-full rounded-lg bg-background border border-gray-700 text-text focus:ring-primary focus:border-primary sm:text-sm p-2.5">
              <option>A</option><option>B</option><option>C</option><option>D</option>
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
              <button onClick={() => removeExercise(index)} className="text-gray-400 hover:text-danger">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <div className="col-span-2 md:col-span-2">
                <Input placeholder="Nome" value={exc.name} onChange={(e) => handleExerciseChange(index, 'name', e.target.value)} />
              </div>
              <Input placeholder="Séries" type="number" value={exc.sets} onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)} />
              <Input placeholder="Reps" type="number" value={exc.reps} onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)} />
              <Input placeholder="Carga (kg)" type="number" value={exc.load} onChange={(e) => handleExerciseChange(index, 'load', e.target.value)} />
              <Input placeholder="Pausa (s)" type="number" value={exc.rest} onChange={(e) => handleExerciseChange(index, 'rest', e.target.value)} />
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
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" /> Salvar Treino
        </Button>
      </div>
    </div>
  );
};

export default CreateWorkoutPage;

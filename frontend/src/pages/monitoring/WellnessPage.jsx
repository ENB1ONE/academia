import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const questions = [
  { id: 'sono', title: 'Qualidade do Sono', low: 'Péssimo', high: 'Ótimo' },
  { id: 'fadiga', title: 'Nível de Fadiga', low: 'Exausto', high: 'Com Energia' },
  { id: 'dor', title: 'Dor Muscular', low: 'Muita Dor', high: 'Sem Dor' },
  { id: 'estresse', title: 'Nível de Estresse', low: 'Muito Estressado', high: 'Relaxado' },
  { id: 'humor', title: 'Estado de Humor', low: 'Irritado/Triste', high: 'Muito Feliz' },
];

const WellnessPage = () => {
  const [answers, setAnswers] = useState({
    sono: 3, fadiga: 3, dor: 3, estresse: 3, humor: 3
  });

  const average = (Object.values(answers).reduce((a, b) => a + b, 0) / 5).toFixed(1);

  const handleSave = () => {
    toast.success('Questionário salvo com sucesso!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Questionário de Bem-Estar</h1>
        <p className="text-gray-400 mt-1">Avaliação diária (Hooper)</p>
      </div>

      <Card>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Atleta</label>
          <select className="block w-full rounded-lg bg-background border border-gray-700 text-text focus:ring-primary focus:border-primary sm:text-sm p-2.5">
            <option>Lucas Silva</option>
          </select>
        </div>

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

      <Button onClick={handleSave} className="w-full" size="lg">
        Salvar Respostas
      </Button>
    </div>
  );
};

export default WellnessPage;

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Flower2, Droplet, HeartPulse, Brain } from 'lucide-react';

const MenstrualCyclePage = () => {
  const [data, setData] = useState({
    flow_intensity: 'Nenhum',
    cramps_intensity: 3,
    mood_impact: 3,
    is_start_of_cycle: false,
    notes: ''
  });

  const handleSave = () => {
    toast.success('Registro de ciclo salvo com sucesso!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <Flower2 className="text-pink-500 h-8 w-8" />
          Ciclo Menstrual
        </h1>
        <p className="text-gray-400 mt-1">Registro diário de sintomas e fluxo</p>
      </div>

      <Card>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Atleta</label>
            <select className="block w-full rounded-lg bg-background border border-gray-700 text-text p-2.5">
              <option>Selecionar Atleta...</option>
              <option>Julia Costa</option>
              <option>Amanda Silva</option>
            </select>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <label className="block text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
              <Droplet className="text-red-400 h-5 w-5" /> Intensidade do Fluxo
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Nenhum', 'Leve', 'Moderado', 'Intenso'].map((level) => (
                <button
                  key={level}
                  onClick={() => setData({ ...data, flow_intensity: level })}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    data.flow_intensity === level
                      ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                      : 'bg-surface border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <label className="block text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
              <HeartPulse className="text-orange-400 h-5 w-5" /> Nível de Cólica / Dor
            </label>
            <input 
              type="range" min="1" max="5" step="1"
              value={data.cramps_intensity}
              onChange={(e) => setData({ ...data, cramps_intensity: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>1 - Nenhuma</span>
              <span>5 - Intensa</span>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <label className="block text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
              <Brain className="text-blue-400 h-5 w-5" /> Humor / Disposição
            </label>
            <input 
              type="range" min="1" max="5" step="1"
              value={data.mood_impact}
              onChange={(e) => setData({ ...data, mood_impact: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>1 - Muito Baixo</span>
              <span>5 - Excelente</span>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox"
                checked={data.is_start_of_cycle}
                onChange={(e) => setData({ ...data, is_start_of_cycle: e.target.checked })}
                className="w-5 h-5 rounded border-gray-700 bg-background text-pink-500 focus:ring-pink-500"
              />
              <span className="text-sm font-medium text-gray-300">Meu ciclo iniciou hoje (1º dia)</span>
            </label>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Observações / Outros Sintomas</label>
            <textarea 
              rows="3"
              value={data.notes}
              onChange={(e) => setData({ ...data, notes: e.target.value })}
              placeholder="Ex: Dor de cabeça, inchaço..."
              className="block w-full rounded-lg bg-background border border-gray-700 text-text p-2.5"
            ></textarea>
          </div>
        </div>
      </Card>

      <Button onClick={handleSave} className="w-full" size="lg">
        Salvar Registro
      </Button>
    </div>
  );
};

export default MenstrualCyclePage;

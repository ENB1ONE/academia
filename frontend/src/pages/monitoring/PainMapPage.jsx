import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useAthleteStore from '../../store/athleteStore';
import useMonitoringStore from '../../store/monitoringStore';

const BODY_PARTS = [
  { id: 'head', label: 'Cabeça', cx: 150, cy: 30 },
  { id: 'neck', label: 'Pescoço', cx: 150, cy: 70 },
  { id: 'left_shoulder', label: 'Ombro E.', cx: 100, cy: 90 },
  { id: 'right_shoulder', label: 'Ombro D.', cx: 200, cy: 90 },
  { id: 'chest', label: 'Peito', cx: 150, cy: 120 },
  { id: 'abdomen', label: 'Abdômen', cx: 150, cy: 180 },
  { id: 'left_elbow', label: 'Cotovelo E.', cx: 70, cy: 150 },
  { id: 'right_elbow', label: 'Cotovelo D.', cx: 230, cy: 150 },
  { id: 'left_hand', label: 'Mão E.', cx: 50, cy: 220 },
  { id: 'right_hand', label: 'Mão D.', cx: 250, cy: 220 },
  { id: 'left_hip', label: 'Quadril E.', cx: 120, cy: 230 },
  { id: 'right_hip', label: 'Quadril D.', cx: 180, cy: 230 },
  { id: 'left_knee', label: 'Joelho E.', cx: 110, cy: 330 },
  { id: 'right_knee', label: 'Joelho D.', cx: 190, cy: 330 },
  { id: 'left_foot', label: 'Pé E.', cx: 110, cy: 430 },
  { id: 'right_foot', label: 'Pé D.', cx: 190, cy: 430 },
];

const PainMapPage = () => {
  const navigate = useNavigate();
  const { athletes, fetchAthletes } = useAthleteStore();
  const { createPainMap, isLoading } = useMonitoringStore();

  const [athleteId, setAthleteId] = useState('');
  const [selectedPart, setSelectedPart] = useState(null);
  const [painData, setPainData] = useState({
    intensity: 5,
    pain_type: 'Muscular',
    notes: ''
  });
  
  const [records, setRecords] = useState({});

  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  const handlePartClick = (part) => {
    setSelectedPart(part);
    if (records[part.id]) {
      setPainData(records[part.id]);
    } else {
      setPainData({ intensity: 5, pain_type: 'Muscular', notes: '' });
    }
  };

  const handleSavePart = () => {
    setRecords({
      ...records,
      [selectedPart.id]: { ...painData }
    });
    toast.success(`Dor em ${selectedPart.label} registrada!`);
    setSelectedPart(null);
  };

  const handleSaveAll = async () => {
    if (!athleteId) {
      toast.error('Selecione o atleta.');
      return;
    }
    if (Object.keys(records).length === 0) {
      toast.error('Nenhuma dor registrada.');
      return;
    }
    
    try {
      // For simplicity, we loop and await, or could Promise.all
      for (const partId of Object.keys(records)) {
        await createPainMap({
          athlete_id: parseInt(athleteId),
          date: new Date().toISOString().split('T')[0],
          body_part: BODY_PARTS.find(p => p.id === partId).label,
          pain_type: records[partId].pain_type,
          intensity: records[partId].intensity,
          notes: records[partId].notes
        });
      }
      toast.success('Mapa de Dor salvo com sucesso!');
      navigate('/dashboard');
    } catch(err) {
      toast.error('Erro ao salvar dores');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text">Mapa de Dor</h1>
        <p className="text-gray-400 mt-1">Indique o local, tipo e intensidade da dor</p>
      </div>

      <Card padding="p-4" className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Atleta</label>
        <select 
          className="block w-full rounded-lg bg-background border border-gray-700 text-text p-2.5"
          value={athleteId} onChange={(e) => setAthleteId(e.target.value)}
        >
          <option value="">Selecione o atleta...</option>
          {athletes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SVG Diagram */}
        <Card className="flex flex-col items-center justify-center py-8">
          <div className="relative">
            <svg width="300" height="480" className="bg-surface rounded-xl border border-gray-800 shadow-inner">
              {/* Lines connecting joints */}
              <line x1="150" y1="30" x2="150" y2="70" stroke="#374151" strokeWidth="4" />
              <line x1="150" y1="70" x2="100" y2="90" stroke="#374151" strokeWidth="4" />
              <line x1="150" y1="70" x2="200" y2="90" stroke="#374151" strokeWidth="4" />
              <line x1="150" y1="70" x2="150" y2="180" stroke="#374151" strokeWidth="4" />
              <line x1="100" y1="90" x2="70" y2="150" stroke="#374151" strokeWidth="4" />
              <line x1="200" y1="90" x2="230" y2="150" stroke="#374151" strokeWidth="4" />
              <line x1="70" y1="150" x2="50" y2="220" stroke="#374151" strokeWidth="4" />
              <line x1="230" y1="150" x2="250" y2="220" stroke="#374151" strokeWidth="4" />
              <line x1="150" y1="180" x2="120" y2="230" stroke="#374151" strokeWidth="4" />
              <line x1="150" y1="180" x2="180" y2="230" stroke="#374151" strokeWidth="4" />
              <line x1="120" y1="230" x2="110" y2="330" stroke="#374151" strokeWidth="4" />
              <line x1="180" y1="230" x2="190" y2="330" stroke="#374151" strokeWidth="4" />
              <line x1="110" y1="330" x2="110" y2="430" stroke="#374151" strokeWidth="4" />
              <line x1="190" y1="330" x2="190" y2="430" stroke="#374151" strokeWidth="4" />

              {BODY_PARTS.map(part => {
                const hasRecord = !!records[part.id];
                const intensity = hasRecord ? records[part.id].intensity : 0;
                let color = '#4B5563'; // gray
                if (hasRecord) {
                  if (intensity <= 3) color = '#10B981'; // green
                  else if (intensity <= 6) color = '#F59E0B'; // yellow/orange
                  else color = '#EF4444'; // red
                }

                return (
                  <g key={part.id} onClick={() => handlePartClick(part)} className="cursor-pointer transition-transform hover:scale-110 origin-center" style={{ transformOrigin: `${part.cx}px ${part.cy}px` }}>
                    <circle cx={part.cx} cy={part.cy} r={16} fill="#1F2937" stroke={color} strokeWidth="3" />
                    {hasRecord && <text x={part.cx} y={part.cy + 4} fill={color} fontSize="12" textAnchor="middle" fontWeight="bold">{intensity}</text>}
                  </g>
                );
              })}
            </svg>
            <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-500 font-medium">
              Clique nas articulações ou músculos
            </div>
          </div>
        </Card>

        {/* Right side form */}
        <div className="space-y-4">
          {selectedPart ? (
            <Card padding="p-6" className="border-primary border">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" /> {selectedPart.label}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Intensidade da Dor: <span className="text-white font-bold">{painData.intensity}</span>/10
                  </label>
                  <input 
                    type="range" min="1" max="10" step="1"
                    value={painData.intensity}
                    onChange={(e) => setPainData({...painData, intensity: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Dor</label>
                  <select 
                    value={painData.pain_type}
                    onChange={(e) => setPainData({...painData, pain_type: e.target.value})}
                    className="block w-full rounded-lg bg-background border border-gray-700 text-text p-2.5"
                  >
                    <option>Muscular</option>
                    <option>Articular</option>
                    <optionÓssea</option>
                    <option>Pontada</option>
                    <option>Queimação</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Observações</label>
                  <textarea 
                    rows="2"
                    value={painData.notes}
                    onChange={(e) => setPainData({...painData, notes: e.target.value})}
                    placeholder="Ex: Piora ao saltar..."
                    className="block w-full rounded-lg bg-background border border-gray-700 text-text p-2.5"
                  ></textarea>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="secondary" className="flex-1" onClick={() => setSelectedPart(null)}>Cancelar</Button>
                  <Button variant="primary" className="flex-1" onClick={handleSavePart}>Confirmar</Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card padding="p-6" className="flex flex-col items-center justify-center h-full text-center text-gray-400 border-dashed border-2 border-gray-700 bg-transparent">
              <Activity className="h-12 w-12 mb-4 opacity-50" />
              <p>Selecione um ponto no diagrama ao lado para registrar a dor.</p>
            </Card>
          )}

          <Button onClick={handleSaveAll} className="w-full" size="lg" disabled={Object.keys(records).length === 0} isLoading={isLoading}>
            Salvar Registros de Dor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PainMapPage;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import { Download } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadChart from '../../components/charts/LoadChart';
import WellnessChart from '../../components/charts/WellnessChart';
import api from '../../services/api';

const AthleteDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('treinos');
  const [isExporting, setIsExporting] = useState(false);
  const [athlete, setAthlete] = useState(null);
  const [pseHistory, setPseHistory] = useState([]);
  const [wellnessHistory, setWellnessHistory] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [athRes, pseRes, wellRes, workRes] = await Promise.all([
          api.get(`/api/v1/athletes/${id}`),
          api.get(`/api/v1/monitoring/pse/${id}`),
          api.get(`/api/v1/monitoring/wellness/${id}`),
          api.get(`/api/v1/workouts/?athlete_id=${id}`)
        ]);
        setAthlete(athRes.data);
        setPseHistory(pseRes.data);
        setWellnessHistory(wellRes.data);
        setWorkouts(workRes.data);
      } catch (error) {
        toast.error('Erro ao carregar dados do atleta');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const tabs = [
    { id: 'treinos', label: 'Treinos' },
    { id: 'pse', label: 'Carga & PSE' },
    { id: 'bem-estar', label: 'Bem-Estar' },
    { id: 'perfil', label: 'Perfil' },
  ];

  const handleExportPDF = async () => {
    setIsExporting(true);
    const toastId = toast.loading('Gerando PDF...');
    
    try {
      const element = document.getElementById('pdf-content');
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#111827' });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${athlete?.name?.replace(/\s+/g, '_')}_Relatorio.pdf`);
      
      toast.success('Relatório exportado!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Erro ao exportar o PDF', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-400">Carregando detalhes do atleta...</div>;
  }

  if (!athlete) {
    return <div className="p-8 text-center text-red-400">Atleta não encontrado.</div>;
  }

  // Calc basic stats
  const age = athlete.birth_date ? new Date().getFullYear() - new Date(athlete.birth_date).getFullYear() : '--';

  return (
    <div className="space-y-6" id="pdf-content">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text">Detalhes do Atleta</h1>
        <Button onClick={handleExportPDF} disabled={isExporting} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          {isExporting ? 'Gerando...' : 'Exportar Relatório PDF'}
        </Button>
      </div>

      <Card padding="p-6">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl border border-primary/30">
            {athlete.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">{athlete.name}</h1>
            <p className="text-gray-400 mt-1">{athlete.sport || 'Sem modalidade'} • {athlete.position || '-'}</p>
            <div className="flex gap-2 mt-3">
              <Badge variant="neutral">{age} anos</Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="border-b border-gray-800">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-text hover:border-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'treinos' && (
          <div className="space-y-4">
            {workouts.length > 0 ? (
              workouts.map(workout => (
                <Card key={workout.id} padding="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-text">{workout.name}</h3>
                    <span className="text-sm text-gray-400">Data: {workout.scheduled_date || 'N/A'}</span>
                  </div>
                  <p className="text-sm text-gray-400">Tipo: {workout.workout_type} | {workout.exercises?.length || 0} exercícios</p>
                </Card>
              ))
            ) : (
              <Card padding="p-8" className="text-center text-gray-400">
                <p>Nenhum treino atribuído recentemente.</p>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'pse' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-text mb-6">Histórico de Carga (PSE)</h3>
              {pseHistory.length > 0 ? (
                <div className="h-80">
                  <LoadChart data={pseHistory} />
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500">Nenhum registro de PSE.</div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'bem-estar' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-text mb-6">Evolução do Bem-Estar</h3>
              {wellnessHistory.length > 0 ? (
                <div className="h-80 flex justify-center">
                  <WellnessChart data={wellnessHistory} />
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500">Nenhum registro de Bem-Estar.</div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'perfil' && (
          <Card>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400">Nome</p>
                <p className="font-medium text-text">{athlete.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-medium text-text">{athlete.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Esporte</p>
                <p className="font-medium text-text">{athlete.sport || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Posição</p>
                <p className="font-medium text-text">{athlete.position || '-'}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AthleteDetailPage;

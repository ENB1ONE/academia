import React, { useState } from 'react';
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

const AthleteDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('treinos');
  const [isExporting, setIsExporting] = useState(false);

  // Mock data
  const athlete = { name: 'Lucas Silva', age: 24, sport: 'Futebol', position: 'Atacante', height: '1.82m', weight: '78kg' };

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
      pdf.save(`${athlete.name.replace(/\s+/g, '_')}_Relatorio.pdf`);
      
      toast.success('Relatório exportado!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Erro ao exportar o PDF', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

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
            <p className="text-gray-400 mt-1">{athlete.sport} • {athlete.position}</p>
            <div className="flex gap-2 mt-3">
              <Badge variant="neutral">{athlete.age} anos</Badge>
              <Badge variant="neutral">{athlete.height}</Badge>
              <Badge variant="neutral">{athlete.weight}</Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="border-b border-gray-800">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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
            <Card padding="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-text">Treino A - Força Máxima</h3>
                <span className="text-sm text-gray-400">Ontem</span>
              </div>
              <p className="text-sm text-gray-400">4 exercícios • 45 minutos</p>
            </Card>
            <Card padding="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-text">Treino B - Potência</h3>
                <span className="text-sm text-gray-400">Há 3 dias</span>
              </div>
              <p className="text-sm text-gray-400">5 exercícios • 50 minutos</p>
            </Card>
          </div>
        )}

        {activeTab === 'pse' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-text mb-6">Carga Crônica vs Aguda</h3>
              <div className="h-80">
                <LoadChart />
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'bem-estar' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-text mb-6">Radar de Bem-Estar (Semanal)</h3>
              <div className="h-80 flex justify-center">
                <WellnessChart />
              </div>
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
                <p className="text-sm text-gray-400">Esporte</p>
                <p className="font-medium text-text">{athlete.sport}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AthleteDetailPage;

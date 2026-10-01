import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAthleteStore from '../../store/athleteStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { useNavigate } from 'react-router-dom';

const AthletesPage = () => {
  const navigate = useNavigate();
  const { athletes, fetchAthletes, createAthlete, updateAthlete, deleteAthlete, isLoading } = useAthleteStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birth_date: '',
    sport: '',
    position: ''
  });

  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  const filteredAthletes = athletes.filter(athlete => 
    athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.sport?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (athlete = null) => {
    if (athlete) {
      setEditingAthlete(athlete);
      setFormData({
        name: athlete.name || '',
        email: athlete.email || '',
        birth_date: athlete.birth_date || '',
        sport: athlete.sport || '',
        position: athlete.position || ''
      });
    } else {
      setEditingAthlete(null);
      setFormData({ name: '', email: '', birth_date: '', sport: '', position: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAthlete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAthlete) {
        await updateAthlete(editingAthlete.id, formData);
        toast.success('Atleta atualizado com sucesso!');
      } else {
        await createAthlete(formData);
        toast.success('Atleta cadastrado com sucesso!');
      }
      handleCloseModal();
    } catch (error) {
      toast.error('Erro ao salvar atleta. Verifique os dados.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este atleta?')) {
      try {
        await deleteAthlete(id);
        toast.success('Atleta removido!');
      } catch (error) {
        toast.error('Erro ao remover atleta');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Atletas</h1>
          <p className="text-gray-400 mt-1">Gerencie seus atletas e equipes</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" /> Novo Atleta
        </Button>
      </div>

      <Card padding="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou modalidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-gray-700 rounded-lg text-text focus:ring-primary focus:border-primary"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && athletes.length === 0 ? (
          <p className="text-gray-400 p-4">Carregando...</p>
        ) : filteredAthletes.length > 0 ? (
          filteredAthletes.map((athlete) => (
            <Card key={athlete.id} padding="p-0" className="overflow-hidden flex flex-col cursor-pointer hover:border-primary transition-colors" onClick={(e) => {
              if (e.target.closest('button')) return;
              navigate(`/athletes/${athlete.id}`);
            }}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg border border-primary/30">
                      {athlete.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text">{athlete.name}</h3>
                      <p className="text-sm text-gray-400">{athlete.sport || 'Sem modalidade'} {athlete.position ? `- ${athlete.position}` : ''}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-surface px-6 py-3 border-t border-gray-800 flex justify-between items-center mt-auto">
                <span className="text-xs font-medium text-gray-400 bg-background px-2 py-1 rounded-md border border-gray-700">
                  {athlete.email || 'Sem email'}
                </span>
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); handleOpenModal(athlete); }} className="text-gray-400 hover:text-white transition-colors" title="Editar">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(athlete.id); }} className="text-gray-400 hover:text-danger transition-colors" title="Excluir">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-400">
            Nenhum atleta encontrado.
          </div>
        )}
      </div>

      {/* Modal Novo/Editar Atleta */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md" padding="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text">
                {editingAthlete ? 'Editar Atleta' : 'Novo Atleta'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white">
                <Plus className="h-6 w-6 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Nome Completo" placeholder="Ex: João da Silva" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <Input label="Email" type="email" placeholder="joao@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <Input label="Data de Nascimento" type="date" value={formData.birth_date} onChange={(e) => setFormData({...formData, birth_date: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Modalidade" placeholder="Ex: Futebol" value={formData.sport} onChange={(e) => setFormData({...formData, sport: e.target.value})} />
                <Input label="Posição" placeholder="Ex: Goleiro" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} />
              </div>
              <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
                {editingAthlete ? 'Salvar Alterações' : 'Cadastrar Atleta'}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AthletesPage;

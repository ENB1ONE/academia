
import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import useAthleteStore from '../../store/athleteStore';

const AthletesPage = () => {
  const { athletes, fetchAthletes, createAthlete, updateAthlete, deleteAthlete, isLoading } = useAthleteStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '', email: '', birth_date: '', sport: '', position: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  const openModal = (athlete = null) => {
    if (athlete) {
      setEditingAthlete(athlete);
      setFormData({
        name: athlete.name || '',
        email: athlete.email || '',
        birth_date: athlete.birth_date ? athlete.birth_date.split('T')[0] : '',
        sport: athlete.sport || '',
        position: athlete.position || ''
      });
    } else {
      setEditingAthlete(null);
      setFormData({ name: '', email: '', birth_date: '', sport: '', position: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveAthlete = async (e) => {
    e.preventDefault();
    try {
      if (editingAthlete) {
        await updateAthlete(editingAthlete.id, formData);
        toast.success('Atleta atualizado com sucesso!');
      } else {
        await createAthlete(formData);
        toast.success('Atleta adicionado com sucesso!');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar atleta. Verifique os dados.');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Previne clique no card
    if (window.confirm('Tem certeza que deseja remover este atleta?')) {
      try {
        await deleteAthlete(id);
        toast.success('Atleta removido!');
      } catch (error) {
        toast.error('Erro ao remover.');
      }
    }
  };

  const handleEdit = (e, athlete) => {
    e.stopPropagation();
    openModal(athlete);
  };

  const filteredAthletes = athletes.filter(a => 
    a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.sport?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Atletas</h1>
          <p className="text-gray-400 mt-1">Gerencie seus atletas e equipes</p>
        </div>
        <Button onClick={() => openModal()} className="gap-2">
          <Plus className="h-4 w-4" /> Novo Atleta
        </Button>
      </div>

      <Card padding="p-4">
        <Input 
          placeholder="Buscar por nome ou modalidade..." 
          icon={Search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      {isLoading && athletes.length === 0 ? (
        <div className="text-center text-gray-400 py-12">Carregando atletas...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAthletes.map(athlete => {
            // Calcula idade basica
            const age = athlete.birth_date ? new Date().getFullYear() - new Date(athlete.birth_date).getFullYear() : '--';
            
            return (
              <Card 
                key={athlete.id} 
                padding="p-5" 
                onClick={() => navigate(`/athletes/${athlete.id}`)}
                className="hover:-translate-y-1 transition-transform relative group cursor-pointer"
              >
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => handleEdit(e, athlete)} className="p-1.5 bg-surface rounded text-gray-300 hover:text-white">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={(e) => handleDelete(e, athlete.id)} className="p-1.5 bg-surface rounded text-red-400 hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl border border-primary/30 shrink-0">
                    {athlete.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text pr-12">{athlete.name}</h3>
                    <p className="text-sm text-gray-400">{athlete.sport || 'Sem modalidade'} � {athlete.position || '-'}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-400 border-t border-gray-800 pt-3 flex justify-between">
                  <span>Idade: {age} anos</span>
                </div>
              </Card>
            );
          })}
          
          {filteredAthletes.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400">
              Nenhum atleta encontrado.
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAthlete ? 'Editar Atleta' : 'Novo Atleta'}>
        <form onSubmit={handleSaveAthlete} className="space-y-4">
          <Input 
            label="Nome Completo" 
            required 
            placeholder="Ex: Jo�o da Silva" 
            icon={User}
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <Input 
            label="Email" 
            type="email" 
            placeholder="joao@email.com" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <Input 
            label="Data de Nascimento" 
            type="date" 
            required 
            value={formData.birth_date}
            onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Modalidade" 
              placeholder="Ex: Futebol" 
              value={formData.sport}
              onChange={(e) => setFormData({...formData, sport: e.target.value})}
            />
            <Input 
              label="Posi��o" 
              placeholder="Ex: Goleiro" 
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
            />
          </div>
          <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
            {editingAthlete ? 'Salvar Altera��es' : 'Cadastrar Atleta'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AthletesPage;


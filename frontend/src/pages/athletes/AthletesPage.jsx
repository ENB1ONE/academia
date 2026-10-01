import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Users, Edit2, Trash2, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAthleteStore from '../../store/athleteStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AthletesPage = () => {
  const navigate = useNavigate();
  const { athletes, isLoading, fetchAthletes, createAthlete, updateAthlete, deleteAthlete } = useAthleteStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState(null);
  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(null);
  
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
      const savedAvatar = localStorage.getItem(`athleteAvatar_${athlete.id}`);
      setAvatar(savedAvatar || null);
    } else {
      setEditingAthlete(null);
      setFormData({ name: '', email: '', birth_date: '', sport: '', position: '' });
      setAvatar(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAthlete(null);
    setAvatar(null);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let savedAthlete;
      if (editingAthlete) {
        savedAthlete = await updateAthlete(editingAthlete.id, formData);
        toast.success('Atleta atualizado com sucesso!');
        if (avatar) {
          localStorage.setItem(`athleteAvatar_${editingAthlete.id}`, avatar);
        }
      } else {
        savedAthlete = await createAthlete(formData);
        toast.success('Atleta cadastrado com sucesso!');
        if (avatar && savedAthlete && savedAthlete.id) {
          localStorage.setItem(`athleteAvatar_${savedAthlete.id}`, avatar);
        }
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
        localStorage.removeItem(`athleteAvatar_${id}`);
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
          filteredAthletes.map((athlete) => {
            const savedAvatar = localStorage.getItem(`athleteAvatar_${athlete.id}`);
            return (
              <Card key={athlete.id} padding="p-0" className="overflow-hidden flex flex-col cursor-pointer hover:border-primary transition-colors" onClick={(e) => {
                if (e.target.closest('button')) return;
                navigate(`/athletes/${athlete.id}`);
              }}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {savedAvatar ? (
                        <img src={savedAvatar} alt={athlete.name} className="h-12 w-12 rounded-full object-cover border border-primary/30" />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg border border-primary/30">
                          {athlete.name.charAt(0).toUpperCase()}
                        </div>
                      )}
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
            );
          })
        ) : (
          <div className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl bg-surface/50">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">
              {searchTerm ? 'Nenhum atleta encontrado' : 'Você ainda não tem atletas'}
            </h3>
            <p className="text-gray-400 max-w-md text-center mb-6">
              {searchTerm 
                ? 'Tente buscar com termos diferentes.' 
                : 'Cadastre seu primeiro atleta agora mesmo e comece a monitorar a carga de treino e o bem-estar dele!'}
            </p>
            {!searchTerm && (
              <Button onClick={() => handleOpenModal()} className="gap-2 px-6">
                <Plus className="h-5 w-5" />
                Cadastrar meu 1º Atleta
              </Button>
            )}
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
              <div className="flex justify-center mb-4">
                <div className="relative h-20 w-20 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  {avatar ? (
                    <img src={avatar} alt="Preview" className="h-20 w-20 rounded-full object-cover border-2 border-primary/50" />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                      <Camera className="h-6 w-6" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full shadow">
                    <Camera className="h-3 w-3" />
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                </div>
              </div>

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

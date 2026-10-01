import React, { useEffect, useState, useRef } from 'react';
import { Plus, Trash2, Shield, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

const AdminTrainersPage = () => {
  const { token } = useAuthStore();
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '',
    cref: ''
  });

  const fetchTrainers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/v1/admin/trainers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrainers(response.data);
    } catch (error) {
      toast.error('Erro ao buscar treinadores');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleOpenModal = () => {
    setFormData({ name: '', email: '', password: '', specialty: '', cref: '' });
    setAvatar(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Preencha todos os campos obrigat�rios');
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.post('/api/v1/admin/trainers', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Treinador cadastrado com sucesso!');
      
      // Save avatar mock to local storage if provided
      if (avatar && res.data && res.data.id) {
        localStorage.setItem(`userAvatar_${res.data.id}`, avatar);
      }
      
      handleCloseModal();
      fetchTrainers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao cadastrar treinador');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar este treinador?')) {
      try {
        await api.delete(`/api/v1/admin/trainers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.removeItem(`userAvatar_${id}`);
        toast.success('Treinador removido!');
        fetchTrainers();
      } catch (error) {
        toast.error('Erro ao remover treinador');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text flex items-center gap-2">
            <Shield className="text-primary h-6 w-6" /> 
            Painel Admin
          </h1>
          <p className="text-gray-400 mt-1">Gerencie os treinadores da plataforma</p>
        </div>
        <Button onClick={handleOpenModal} className="gap-2">
          <Plus className="h-4 w-4" /> Novo Treinador
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map((trainer) => {
          const savedAvatar = localStorage.getItem(`userAvatar_${trainer.id}`);
          return (
            <Card key={trainer.id} padding="p-0" className="overflow-hidden flex flex-col">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {savedAvatar ? (
                      <img src={savedAvatar} alt={trainer.name} className="h-12 w-12 rounded-full object-cover border border-primary/30" />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg border border-primary/30">
                        {trainer.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-text">{trainer.name}</h3>
                      
                        <p className="text-sm text-gray-400">Treinador</p>
                        {trainer.specialty && (
                          <p className="text-xs text-primary mt-0.5">{trainer.specialty}</p>
                        )}
                        {trainer.cref && (
                          <p className="text-xs text-gray-500 mt-0.5">CREF: {trainer.cref}</p>
                        )}

                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-surface px-6 py-3 border-t border-gray-800 flex justify-between items-center mt-auto">
                <span className="text-xs font-medium text-gray-400 bg-background px-2 py-1 rounded-md border border-gray-700">
                  {trainer.email}
                </span>
                <button 
                  onClick={() => handleDelete(trainer.id)} 
                  className="text-gray-400 hover:text-danger transition-colors" 
                  title="Excluir Treinador"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          );
        })}
        
        {trainers.length === 0 && !isLoading && (
          <div className="col-span-full py-12 text-center text-gray-400">
            Nenhum treinador cadastrado ainda.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md" padding="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text">Novo Treinador</h2>
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

              <Input 
                label="Nome Completo" 
                placeholder="Ex: Carlos Treinador" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
              <Input 
                label="Email" 
                type="email" 
                placeholder="carlos@formclub.com.br" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required
              />

              

              <Input 
                label="Senha Inicial" 
                type="password" 
                placeholder="Defina uma senha" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required
              />

              

              
              
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Especialidade" 
                  placeholder="Ex: Fisioterapeuta, Preparador..." 
                  value={formData.specialty} 
                  onChange={(e) => setFormData({...formData, specialty: e.target.value})} 
                />
                <Input 
                  label="CREF / Registro" 
                  placeholder="Ex: 000000-G/SP" 
                  value={formData.cref} 
                  onChange={(e) => setFormData({...formData, cref: e.target.value})} 
                />
              </div>

              <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
                Cadastrar Treinador
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminTrainersPage;

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Shield } from 'lucide-react';
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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
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
    setFormData({ name: '', email: '', password: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    try {
      setIsLoading(true);
      await api.post('/api/v1/admin/trainers', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Treinador cadastrado com sucesso!');
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
        {trainers.map((trainer) => (
          <Card key={trainer.id} padding="p-0" className="overflow-hidden flex flex-col">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg border border-primary/30">
                    {trainer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text">{trainer.name}</h3>
                    <p className="text-sm text-gray-400">Treinador</p>
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
        ))}
        
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
